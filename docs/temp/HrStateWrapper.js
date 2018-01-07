// @flow
import * as t from './types';
import HrQuery from './HrQuery';

// eslint-disable-next-line

export function makeDefaultHrState(): t.HrState {
  return {
    isHrState: true,
    byId: {},
    lists: {},
    kv: {},
  };
}

export function makeHrStateDesc<T>(value: T, properties: ?$Shape<t.HrStateDesc<T>>): t.HrStateDesc<T> {
  return {
    loading: false,
    hasError: false,
    error: null,
    value,
    loadingStartTime: 0,
    loadingCompleteTime: 0,
    etc: {},
    ...properties,
  };
}

type PathType = 'id' | 'list' | 'kv';
type OpType = 'set' | 'setIds' | 'updateValue' | 'mergeDesc' | 'setInDesc';

type StateInfo = {
  state: t.HrState,
  ops: Array<HrStateWrapperOp>,
  time: number,
}

type StatePath = {
  isHrStatePath: true,

  // The type of selector, defaults to null.
  type: ?PathType,

  // The value for the selector. Used by id and kv types
  typeValue: string | null,

  // The state key, which defaults to null
  key: string | null,

  info: StateInfo,
  parent: ?HrStateWrapper,
}

// Mirrows StatePath
type HrStateWrapperOp = {
  op: OpType,
  data: any,
  type: ?PathType,
  typeValue: string | null,
  key: ?string,
};


const TEST_TIME = 1500000000000;

function makeInfo(state: t.HrState): StateInfo {
  return {
    state,
    ops: [],
    time: process.env.NODE_ENV === 'test' ? TEST_TIME : Date.now(),
  };
}

function makePath(info: StateInfo, parent: ?HrStateWrapper): StatePath {
  return {
    isHrStatePath: true,
    type: parent ? parent.path.type : null,
    typeValue: parent ? parent.path.typeValue : null,
    key: parent ? parent.path.key : null,
    info,
    parent,
  };
}

export function wrapperFromState(_state: ?t.HrState) {
  const state: t.HrState = _state || makeDefaultHrState();
  const info = makeInfo(state);
  const path = makePath(info);
  return new HrStateWrapper(path);
}

export class HrStateWrapper {
  path: StatePath
  /*
    Creates a HrStateWrapper instance. This is typically done for you.
  */
  constructor(path: StatePath) {
    this.path = path;
  }

  /*
    Utility for running a function without breaking the chain. Receives the
    `HrStateWrapper` as an argument.
  */
  invoke(fn: (s: HrStateWrapper) => mixed) {
    fn(this);
    return this;
  }

  /*
    Returns a state wrapper for the specified `id`. You can then call methods
    like `.set` on it.

    ```javascript
    s.id('some-id').set('some-value')
    ```
  */
  id(id: string) {
    const path = makePath(this.path.info, this);
    path.type = 'id';
    path.typeValue = id;
    return new HrStateWrapper(path);
  }

  /*
    Returns a state wrapper for the list.

    ```javascript
    s.list().set(['a', 'b'])
    ```
  */
  list() {
    const path = makePath(this.path.info, this);
    path.type = 'list';
    path.typeValue = null;
    return new HrStateWrapper(path);
  }

  /*
    Returns a state wrapper for the specified key in the key/value pair.

    ```javascript
    s.kv('some-key').set('some-value')
    ```
  */
  kv(kvKey: string) {
    const path = makePath(this.path.info, this);
    path.type = 'kv';
    path.typeValue = kvKey;
    return new HrStateWrapper(path);
  }

  /*
    Returns a state wrapper for the specified sub-key.

    ```javascript
    s.key('some-key').id('some-id').set('foo')
    ```
  */
  key(key: string) {
    const path = makePath(this.path.info, this);
    path.key = key;
    return new HrStateWrapper(path);
  }

  /*
    Get an `HrQuery` object for the state.
  */
  query() {
    return new HrQuery(this.path.info.state);
  }

  /*
    Sets the currently focused item. See the examples for `id`/`list`/`kv`
  */
  set(value: any) {
    this._pushOp('set', value);
    return this;
  }

  /*
    For each item in `pairs`, map the first item in the pair (the id) to the
    second item (the value).

    Often you'll generate this with an `array.map` call.

    ```javascript
    s.setIdPairs(items.map(x => [x.id, x]))
    s.key('some-key').setIdPairs(items.map(x => [x.id, x]))
    ```
  */
  setIds(pairs: Array<[string, any]>) {
    this._pushOp('setIds', pairs, { type: 'id' });
    return this;
  }

  /*
    Update an item with the given id by passing it to the 'updater' function.
  */
  update(updater: Function) {
    this._pushOp('updateValue', updater);
    return this;
  }

  /*
    Set the focused item to a loading state. Also captures the loading state.

    ```javascript
    s.id('some-id').setLoading()
    ```
  */
  setLoading() {
    const desc: Object = { hasError: false, loading: true, loadingStartTime: this.path.info.time };

    this._pushOp('mergeDesc', desc);

    return this;
  }

  /*
    Set the focused item to a completed loading state.

    ```javascript
    s.id('some-id').setLoadingDone()
    ```
  */
  setLoadingDone() {
    const desc: Object = { hasError: false, loading: false, loadingCompleteTime: this.path.info.time };

    this._pushOp('mergeDesc', desc);

    return this;
  }

  /*
    Set the focused item to an error state. Pass `null` to clear the error state.

    ```javascript
    s.id('some-id').setError({ message: 'Oops' })
    ```
  */
  setError(error: ?any) {
    const desc: Object = {
      hasError: error != null,
      error: error,
      loading: false,
      loadingCompleteTime: this.path.info.time,
    };

    this._pushOp('mergeDesc', desc);

    return this;
  }

  /*
    Set custom metadata for the current item.

    ```javascript
    s.id('some-id').setMeta('isNew', true)
    ```
  */
  setMeta(metaKey: string, metaValue: any) {
    this._pushOp('setInDesc', { path: ['etc', metaKey], value: metaValue });

    return this;
  }

  /*
    Compute the state by applying all update operations. Mostly for internal use.
  */
  getState(): Object {
    const sw: HrStateWrapper = this.root();
    let { state, ops } = sw.path.info;
    if (!ops.length) return state;

    state = { ...state };

    // Track which things we've cloned to improve performance, and avoid
    // cloning objects that don't need to be cloned.
    const cloned = { id: false, list: false, kv: false };
    const clonedKey = {
      id: Object.create(null),
      list: Object.create(null),
      kv: Object.create(null),
    };

    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];

      const key = t.getKey(op.key);

      if (op.type === 'id' || op.type === 'kv') {
        const stateKey = op.type === 'id' ? 'byId' : 'kv';
        if (!cloned[op.type]) {
          cloned[op.type] = true;
          state[stateKey] = { ...state.byId };
        }

        if (!clonedKey[op.type][key]) {
          clonedKey[op.type][key] = true;
          state[stateKey][key] = { ...state[stateKey][key] };
        }

        if (op.op === 'set') {
          const opts: $Shape<t.HrStateDesc<any>> = {};
          opts.loadingCompleteTime = this.path.info.time;
          // $FlowFixMe
          if (state[stateKey][key][op.typeValue]) {
            opts.loadingStartTime = state[stateKey][key][op.typeValue].loadingStartTime;
          }

          // $FlowFixMe
          state[stateKey][key][op.typeValue] = makeHrStateDesc(op.data, opts);
        }

        if (op.op === 'setIds') {
          for (let i = 0; i < op.data.length; i += 1) {
            const pair = op.data[i];
            state[stateKey][key][pair[0]] = makeHrStateDesc(pair[1]);
          }
        }

        if (op.op === 'mergeDesc') {
          // $FlowFixMe
          const desc = state[stateKey][key][op.typeValue] ? { ...state[stateKey][key][op.typeValue] } : makeHrStateDesc(null);
          Object.assign(desc, op.data);
          // $FlowFixMe
          state[stateKey][key][op.typeValue] = desc;
        }

        if (op.op === 'setInDesc') {
          // $FlowFixMe
          const desc = state[stateKey][key][op.typeValue] ? { ...state[stateKey][key][op.typeValue] } : makeHrStateDesc(null);

          const final = op.data.path.slice(0, -1).reduce((acc, k) => {
            desc[k] = { ...desc[k] };
            return desc[k];
          }, desc);
          final[op.data.path[op.data.path.length - 1]] = op.data.value;

          // $FlowFixMe
          state[stateKey][key][op.typeValue] = desc;
        }
      }

      if (op.type === 'list') {
        if (!cloned.list) {
          cloned.list = true;
          state.lists = { ...state.lists };
        }

        if (op.op === 'set') {
          const opts: $Shape<t.HrStateDesc<any>> = {};
          opts.loadingCompleteTime = this.path.info.time;
          // $FlowFixMe
          if (state.lists[key]) {
            opts.loadingStartTime = state.lists[key].loadingStartTime;
          }
          // $FlowFixMe
          state.lists[key] = makeHrStateDesc(op.data, opts);
        }

        if (op.op === 'mergeDesc') {
          const desc = state.lists[key] ? { ...state.lists[key] } : makeHrStateDesc(null);
          Object.assign(desc, op.data);
          // $FlowFixMe
          state[stateKey][key] = desc;
        }

        if (op.op === 'setInDesc') {
          const desc = state.lists[key] ? { ...state.lists[key] } : makeHrStateDesc(null);

          const final = op.data.path.slice(0, -1).reduce((acc, k) => {
            desc[k] = { ...desc[k] };
            return desc[k];
          }, desc);
          final[op.data.path[op.data.path.length - 1]] = op.data.value;

          // $FlowFixMe
          state[stateKey][key] = desc;
        }
      }
    }

    return state;
  }

  /*
    Get the root `HrStateWrapper` instance.
  */
  root() {
    let wrapper: HrStateWrapper = this;
    while (wrapper.path.parent) {
      wrapper = wrapper.path.parent;
    }

    return wrapper;
  }

  /*
    Internal: adds an operation to the queue
  */
  _pushOp(op: OpType, data: any, overrides: $Shape<HrStateWrapperOp> = {}) {
    this.path.info.ops.push({
      op,
      key: this.path.key,
      type: this.path.type,
      typeValue: this.path.typeValue,
      data,
      ...overrides,
    });
  }
}
