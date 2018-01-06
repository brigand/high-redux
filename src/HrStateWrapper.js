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

type HrStateWrapperOp = {
  type: 'setIds',
  key: string,
  data: Array<[string, any]>,
} | {
  type: 'setList',
  key: string,
  data: Array<any>,
} | {
  type: 'updateIdDesc',
  key: string,
  id: string,
  data: $Shape<t.HrStateDesc<any>>,
} | {
  type: 'setKvMeta',
  key: string,
  id: string,
  data: any,
}

export class HrStateWrapper {
  state: t.HrState
  ops: Array<HrStateWrapperOp>
  time: number

  // In case getState is called twice without any ops being pushed
  computedState: ?t.HrState;

  /*
    Creates a HrStateWrapper instance. This is typically done for you.
  */
  constructor(state: ?t.HrState) {
    this.state = state || makeDefaultHrState();

    if (process.env.NODE_ENV === 'test') {
      this.setTime(1500000000000);
    } else {
      this.setTime(Date.now());
    }
    this.ops = [];
  }

  /*
    Utility for running a function without breaking the chain. Essentially
    an IIFE.
  */
  invoke(fn: Function) {
    fn(this);
    return this;
  }

  /*
    Get an HrQuery object for the state.

    The argument `type` indicates which version of the state to use.

    By default, type is `'initial'`, where it uses the initial state passed to
    `HrState`, ignoring any queued operations on the state. Most of the time,
    this is what you want.

    The `'cached'` variation is very rarely useful, but it gives the state snapshot
    from the last time `getState` was called.

    The `'compute'` option applies all pending state updates by calling `getState`,
    and gives an `HrQuery` of the result.

    To understand the differences, say we have a key/value of `'x'` set to `'foo'` from a previous
    call to the action handler, and then this code is running:

    The following (or omitting the argument to .query) gives `'foo'`.

    ```javascript
    s.setKv('x', 'bar')
      .query('initial') // or .query() with no args
      .getKv('x')
    ```

    Where here, where we pass `'compute'`, it gives '`bar'`.

    ```javascript
    s.setKv('x', 'bar')
      .query('compute')
      .getKv('x')
    ```
  */
  query(type: ('initial' | 'cached' | 'compute') = 'initial') {
    let state = this.state;
    if (type === 'cached' && this.computedState) state = this.computedState;
    if (type === 'compute') state = this.getState();

    return new HrQuery(state);
  }

  /*
    For each item in `pairs`, map the first item in the pair (the id) to the
    second item (the value). More efficient than `setById` for many items.

    Often you'll generate this with an `array.map` call.

    ```javascript
    s.setIdPairs(items.map(x => [x.id, x]))
    ```
  */
  setIdPairs(pairs: Array<[string, any]>) {
    return this.setIdPairsKey(null, pairs);
  }
  setIdPairsKey(key: ?string, pairs: Array<[string, any]>) {
    if (!Array.isArray(pairs)) {
      throw new Error(`HrStateWrapper::setIdPairs expected the second argument to be an array but got ${pairs}`);
    }
    this.ops.push({ type: 'setIds', key: t.getKey(key), data: pairs });
    return this;
  }

  /*
    Store a mapping of the id to the value.
  */
  setById(id: string, value: any) {
    return this.setByIdKey(null, id, value);
  }
  setByIdKey(key: ?string, id: string, value: any) {
    if (arguments.length < 3) {
      throw new Error(`HrStateWrapper::setById expects args (key: ?string, id: string, value: any) but received ${arguments.length} args`);
    }
    this.ops.push({ type: 'updateIdDesc', key: t.getKey(key), id, data: { value, loading: false, loadingCompleteTime: this.time } });
    return this;
  }

  /*
    Update an item with the given id by passing it to the 'updater' function
  */
  updateById(id: string, updater: Function) {
    return this.updateByIdKey(null, id, updater);
  }

  updateByIdKey(key: ?string, id: string, updater: Function) {
    const value = updater(this._getById(key, id));

    // Not sure why we can't make value nullable
    // $FlowFixMe
    this.ops.push({ type: 'updateIdDesc', key: t.getKey(key), data: { value } });

    return this;
  }

  _getById(key: ?string, id: string) {
    return new HrQuery(this.state).valueByIdKey(t.getKey(key), id) || null;
  }

  /*
    Set the error value for an id to the argument. Even if the error value is
    `null`/`undefined`, it'll still register as having an error.
  */
  setIdLoading(id: string, isLoading: ?boolean) {
    return this.setIdLoadingKey(null, id, isLoading);
  }
  setIdLoadingKey(key: ?string, id: string, isLoading: ?boolean) {
    const data: $Shape<t.HrStateDesc<any>> = {
      hasError: false,
      error: null,
      loading: isLoading !== false,
    };

    if (isLoading !== false) {
      data.loadingStartTime = this.time;
    } else {
      data.loadingCompleteTime = this.time;
    }

    this.ops.push({
      type: 'updateIdDesc',
      key: t.getKey(key),
      id,
      data,
    });

    return this;
  }

  /*
    Set the error value for an id to the argument. Even if the error value is
    null/undefined, it'll still register as having an error.
  */
  setIdError(id: string, error?: any) {
    return this.setIdErrorKey(null, id, error);
  }
  setIdErrorKey(key: ?string, id: string, error?: any) {
    this.ops.push({
      type: 'updateIdDesc',
      key: t.getKey(key),
      id,
      data: {
        hasError: !!error,
        error,
      },
    });
  }

  /*
    Store a list, typically containing id strings, but can be any value.
  */
  setList(items: Array<any>) {
    return this.setListKey(null, items);
  }
  setListKey(key: ?string, items: Array<any>) {
    if (!Array.isArray(items)) {
      throw new Error(`HrStateWrapper::setList expected the second argument to be an array but got ${items}`);
    }
    this.ops.push({ type: 'setList', key: t.getKey(key), data: items });
  }

  /*
    Sets a simple key/value pair
  */
  setKv(id: string, value: any) {
    return this.setKvKey(null, id, value);
  }
  setKvKey(key: ?string, id: string, value: any) {

    this.ops.push({ type: 'setKvMeta', key: t.getKey(key), id, data: { value } });
    return this;
  }

  /*
    Sets metadata for the key, e.g. `setKvMeta(id, { loading: true, etc: { anything: 1 } })`
  */
  setKvMeta(id: string, value: $Shape<t.HrStateDesc<any>>) {
    return this.setKvMetaKey(null, id, value);
  }
  setKvMetaKey(key: ?string, id: string, value: $Shape<t.HrStateDesc<any>>) {

    this.ops.push({ type: 'setKvMeta', key: t.getKey(key), id, data: value });
    return this;
  }

  /*
    Compute the state by applying all update operations. Mostly for internal use.
  */
  getState(): Object {
    const { ops } = this;
    if (!ops.length) return this.state;
    this.ops = [];

    // Track which things we've cloned to improve performance, and avoid
    // cloning objects that don't need to be cloned.
    const cloned = { id: false, lists: false, kv: false };
    const clonedKey = {
      id: Object.create(null),
      lists: Object.create(null),
      kv: Object.create(null),
    };

    const state = this.computedState ? this.computedState : { ...this.state };
    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];

      const key = t.getKey(op.key);

      if (op.type === 'setIds') {
        if (!cloned.id) {
          state.byId = { ...state.byId };
          cloned.id = true;
        }
        if (!clonedKey.id[key]) {
          state.byId[key] = { ...state.byId[key] };
          clonedKey.id[key] = true;
        }

        for (let j = 0; j < op.data.length; j += 1) {
          const pair = op.data[j];
          state.byId[key][pair[0]] = makeHrStateDesc(pair[1], { loadingCompleteTime: this.time });
        }
      }

      if (op.type === 'setList') {
        if (!cloned.lists) {
          state.lists = { ...state.lists };
          cloned.lists = true;
        }
        if (!clonedKey.lists[key]) {
          state.lists[key] = { ...state.lists[key] };
          clonedKey.lists[key] = true;
        }

        state.lists[key] = makeHrStateDesc(
          op.data,
          { loadingCompleteTime: this.time },
        );
      }

      if (op.type === 'updateIdDesc') {
        if (!cloned.id) {
          state.byId = { ...state.byId };
          cloned.id = true;
        }
        if (!clonedKey.id[key]) {
          state.byId[key] = { ...state.byId[key] };
          clonedKey.id[key] = true;
        }

        state.byId[key] = state.byId[key] || {};

        state.byId[key][op.id] = state.byId[key][op.id]
          ? { ...state.byId[key][op.id], ...op.data }
          : makeHrStateDesc(null, op.data);
      }

      if (op.type === 'setKvMeta') {
        if (!cloned.kv) {
          state.kv = { ...state.kv };
          cloned.kv = true;
        }
        if (!clonedKey.kv[key]) {
          state.kv[key] = { ...state.kv[key] };
          clonedKey.kv[key] = true;
        }

        state.kv[key] = state.kv[key] || {};

        state.kv[key][op.id] = state.kv[key][op.id]
          ? { ...state.kv[key][op.id], ...op.data }
          : makeHrStateDesc(null, op.data);
      }
    }

    this.computedState = state;

    return state;
  }

  /*
    Set the time we use for loading states. By default, it's `Date.now()` at
    the time the `HrStateWrapper` constructor is called.

    In unit tests (`NODE_ENV === 'test'`) the time will be set to `1500000000000`
    (2017-07-14T02:40:00.000Z).
  */
  setTime(time: number) {
    this.time = time;
    return this;
  }
}
