// @flow
'use strict';
import * as t from './types';
import HrQuery from './HrQuery';

// eslint-disable-next-line

export function makeDefaultHrState(): t.HrState {
  return {
    isHrState: true,
    byId: {},
    lists: {},
    kv: {},
    rollbackOps: {},
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

type StateInfo = {
  state: t.HrState,
  ops: Array<t.HrStateWrapperOp>,
  time: number,
}

type StatePath = {
  isHrStatePath: true,

  // The type of selector, defaults to null.
  type: ?t.PathType,

  // The value for the selector. Used by id and kv types
  typeValue: string | null,

  // The state key, which defaults to null
  key: string | null,

  info: StateInfo,
  parent: ?HrStateWrapper,

  optimisticId: ?string,
}

const TEST_TIME = 1500000000000;

function makeInfo(state: t.HrState): StateInfo {
  const infoObj = {
    state,
    ops: [],
    time: process.env.NODE_ENV === 'test' ? TEST_TIME : Date.now(),
  };

  return infoObj;
}

function makePath(info: StateInfo, parent: ?HrStateWrapper): StatePath {
  const pathObj = {
    isHrStatePath: true,
    type: parent ? parent.path.type : null,
    typeValue: parent ? parent.path.typeValue : null,
    key: parent ? parent.path.key : null,
    info,
    parent,
    optimisticId: parent ? parent.path.optimisticId : null,
  };

  return pathObj;
}

export function wrapperFromState(_state: ?t.HrState) {
  const state: t.HrState = _state || makeDefaultHrState();
  if (process.env.NODE_ENV === 'test') require('deep-freeze')(state);

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
  queryRoot() {
    return new HrQuery(this.path.info.state);
  }

  query() {
    let q = new HrQuery(this.path.info.state);
    if (this.path.key) q = q.key(this.path.key);

    if (this.path.type === 'id' && this.path.typeValue) {
      q = q.id(this.path.typeValue);
    } else if (this.path.type === 'list') {
      q = q.list();
    } else if (this.path.type === 'kv' && this.path.typeValue) {
      q = q.kv(this.path.typeValue);
    }

    return q;
  }

  /*
    Sets the currently focused item. See the examples for `id`/`list`/`kv`
  */
  set(value: any) {
    this._pushOp('updateInDesc', {
      path: ['value'],
      value,
      merge: false,
    });
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
    this._pushOp('updateInDesc', { path: ['value'], updater, merge: true });
    return this;
  }

  /*
    Update an item with the given id by passing it to the 'updater' function.
  */
  updateIn(updatePath: Array<string | number>, updater: Function) {
    this._pushOp('updateInDesc', { path: ['value'].concat(updatePath), updater, merge: true });
    return this;
  }

  /*
    Set the focused item to a loading state. Also captures the loading state.

    ```javascript
    s.id('some-id').setLoading()
    ```
  */
  setLoading() {
    this._pushOp('updateInDesc', {
      path: ['hasError'],
      value: false,
    });
    this._pushOp('updateInDesc', {
      path: ['loading'],
      value: true,
    });
    this._pushOp('updateInDesc', {
      path: ['loadingStartTime'],
      value: this.path.info.time,
    });

    return this;
  }

  /*
    Set the focused item to a completed loading state.

    ```javascript
    s.id('some-id').setLoadingDone()
    ```
  */
  setLoadingDone() {
    this._pushOp('updateInDesc', {
      path: ['hasError'],
      value: false,
    });
    this._pushOp('updateInDesc', {
      path: ['loading'],
      value: false,
    });
    this._pushOp('updateInDesc', {
      path: ['loadingCompleteTime'],
      value: this.path.info.time,
    });

    return this;
  }

  /*
    Set the focused item to an error state. Pass `null` to clear the error state.

    ```javascript
    s.id('some-id').setError({ message: 'Oops' })
    ```
  */
  setError(error: ?any) {
    this._pushOp('updateInDesc', {
      path: ['hasError'],
      value: error != null,
    });
    this._pushOp('updateInDesc', {
      path: ['error'],
      value: error,
    });
    this._pushOp('updateInDesc', {
      path: ['loading'],
      value: false,
    });
    this._pushOp('updateInDesc', {
      path: ['loadingCompleteTime'],
      value: this.path.info.time,
    });

    return this;
  }

  /*
    Set custom metadata for the current item.

    ```javascript
    s.id('some-id').setMeta('isNew', true)
    ```
  */
  setMeta(metaKey: string, metaValue: any) {
    this._pushOp('updateInDesc', { path: ['etc', metaKey], value: metaValue });

    return this;
  }

  /*
    Push an item to the list.

    Throws if not in list mode.
  */
  push(...items: Array<any>) {
    if (this.path.type !== 'list') {
      throw new Error(`Attempted to push while in ${this.path.type || '(none)'} mode.`);
    }
    this._pushOp('listOp', { items: items, listOp: 'push' });
    return this;
  }

  /*
    Adds an item to the start of the list.

    Throws if not in list mode.
  */
  unshift(...items: Array<any>) {
    if (this.path.type !== 'list') {
      throw new Error(`Attempted to push while in ${this.path.type || '(none)'} mode.`);
    }
    this._pushOp('listOp', { items: items, listOp: 'unshift' });

    return this;
  }

  /*
    Removes items from the end of the list. The count defaults to 1.

    Throws if not in list mode.
  */
  pop(count: number = 1) {
    if (this.path.type !== 'list') {
      throw new Error(`Attempted to push while in ${this.path.type || '(none)'} mode.`);
    }
    this._pushOp('listOp', { count, listOp: 'pop' });

    return this;
  }

  /*
    Removes items from the start of the list. The count defaults to 1.

    Throws if not in list mode.
  */
  shift(count: number = 1) {
    if (this.path.type !== 'list') {
      throw new Error(`Attempted to push while in ${this.path.type || '(none)'} mode.`);
    }
    this._pushOp('listOp', { count, listOp: 'shift' });

    return this;
  }

  /*
    Set this operation to be optimistic, which can be rolled back on future
    state wrappers.

    ```javascript
    s.optimistic('token').id('some-id').set(value);

    // in the future
    s.optimistic('token').rollback()
    ```
  */
  optimistic(id: ?string) {
    const id2 = id || '[[default]]';

    const path = makePath(this.path.info, this);
    path.optimisticId = id2;
    return new HrStateWrapper(path);
  }

  /*
    Rolls back a previous optimistic update.

    ```javascript
    s.optimistic('token').rollback()
    ```
  */
  rollback() {
    const id = this.path.optimisticId;

    if (!id) {
      throw new Error(`You must call .optimistic before you can rollback an update.`);
    }

    const ops = this.path.info.state.rollbackOps[id];
    if (!ops) {
      throw new Error(`Attempted to rollback optimistic update "${id}" which doesn't exist.`);
    }

    this.path.info.ops.push(...ops);

    return this;
  }

  /*
    Compute the state by applying all update operations. Mostly for internal use.
  */
  getState(): Object {
    const sw: HrStateWrapper = this.root();
    let { state, ops } = sw.path.info;
    if (!ops.length) return state;

    if (process.env.NODE_ENV === 'test') require('deep-freeze')(state);

    state = { ...state };

    // Track which things we've cloned to improve performance, and avoid
    // cloning objects that don't need to be cloned.
    const cloned = { id: false, list: false, kv: false, rollbackOps: false };
    const clonedKey = {
      id: Object.create(null),
      list: Object.create(null),
      kv: Object.create(null),
    };

    const updatedRollbacks = {};
    const addRollback = (id: string, op: t.HrStateWrapperOp) => {
      if (!cloned.rollbackOps) {
        cloned.rollbackOps = true;
        state.rollbackOps = { ...state.rollbackOps };
      }

      if (!updatedRollbacks[id]) {
        state.rollbackOps[id] = [];
        updatedRollbacks[id] = true;
      }

      op.optimisticId = null;

      state.rollbackOps[id].push(op);
    }

    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];

      const key = t.getKey(op.key);

      if (op.type === 'id' || op.type === 'kv') {
        const stateKey = op.type === 'id' ? 'byId' : 'kv';
        if (!cloned[op.type]) {
          cloned[op.type] = true;
          state[stateKey] = { ...state[stateKey] };
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

          if (op.optimisticId) {
            addRollback(op.optimisticId, {
              ...op,
              // $FlowFixMe
              data: state[stateKey][key][op.typeValue] !== undefined ? state[stateKey][key][op.typeValue].value : undefined,
            });
          }

          // $FlowFixMe
          state[stateKey][key][op.typeValue] = makeHrStateDesc(op.data, opts);
        }

        if (op.op === 'setIds') {
          const optimisticId = op.optimisticId;

          const newDescs = [];

          for (let i = 0; i < op.data.length; i += 1) {
            const pair = op.data[i];
            newDescs.push(makeHrStateDesc(pair[1]));
          }

          if (optimisticId) {
            const newDescsMapping = {};
            const oldDescPairs = [];
            const oldDescNotExist = [];
            for (let i = 0; i < op.data.length; i += 1) {
              const pair = op.data[i];
              const curr = state[stateKey][key][pair[0]];
              newDescsMapping[pair[0]] = newDescs[i];
              if (curr) {
                const oldValue = state[stateKey][key][pair[0]];
                oldDescPairs.push([pair[0], oldValue]);
              } else {
                oldDescNotExist.push(pair[0]);
              }
            }

            for (const pair of oldDescPairs) {
              addRollback(optimisticId, {
                ...op,
                type: 'id',
                typeValue: pair[0],
                op: 'updateInDesc',
                data: {
                  path: [],
                  value: pair[1],
                },
              });
            }

            for (const id of oldDescNotExist) {
              addRollback(optimisticId, {
                ...op,
                type: 'id',
                typeValue: id,
                op: 'deleteDesc',
                data: {},
              });
            }
          }

          for (let i = 0; i < op.data.length; i += 1) {
            const pair = op.data[i];
            state[stateKey][key][pair[0]] = newDescs[i];
          }
        }

        if (op.op === 'deleteDesc') {
          const { optimisticId } = op;

          // $FlowFixMe
          const current = state[stateKey][key][op.typeValue];

          if (current) {
            // $FlowFixMe
            delete state[stateKey][key][op.typeValue];

            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                op: 'updateInDesc',
                data: {
                  path: ['value'],
                  data: current,
                },
              });
            }
          }
        }

        if (op.op === 'updateInDesc') {
          // $FlowFixMe
          const desc = state[stateKey][key][op.typeValue] ? { ...state[stateKey][key][op.typeValue] } : makeHrStateDesc(null);

          const opPath = [...op.data.path];
          let final = opPath.slice(0, -1).reduce((acc, k) => {
            desc[k] = { ...desc[k] };
            return desc[k];
          }, desc);

          // Apply the updater function to the new value
          const prop = opPath[opPath.length - 1];

          const updateValue = op.data.updater ? op.data.updater(prop ? final[prop] : final) : op.data.value;
          let newValue = updateValue;
          let changed = null;

          const { optimisticId } = op;

          // If it's a non-array object, then merge it into the previous value
          if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
            newValue = { ...final[prop], ...newValue };

            if (optimisticId) {
              const changed = Object.keys(updateValue);
              const original = changed.reduce((acc, key) => {
                if (final[prop]) {
                  acc[key] = final[prop][key];
                } else {
                  throw new Error(`Something is wrong in updateInDesc`);
                }
                return acc;
              }, {});

              addRollback(optimisticId, {
                ...op,
                data: {
                  path: op.data.path,
                  value: original,
                },
              });
            }

            if (prop) {
              final[prop] = newValue;
            } else {
              final = newValue;
            }
          } else {
            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                data: {
                  path: op.data.path,
                  value: prop ? final[prop] : final,
                },
              });
            }
          }

          if (!prop) {
            // $FlowFixMe
            state[stateKey][key][op.typeValue] = final;
          } else {
            final[prop] = newValue;
            // $FlowFixMe
            state[stateKey][key][op.typeValue] = desc;
          }
        }
      }

      if (op.type === 'list') {
        if (!cloned.list) {
          cloned.list = true;
          state.lists = { ...state.lists };
        }

        if (op.op === 'updateInDesc') {
          const desc = state.lists[key] ? { ...state.lists[key] } : makeHrStateDesc(null);

          const opPath = [...op.data.path];

          let final = opPath.slice(0, -1).reduce((acc, k) => {
            desc[k] = { ...desc[k] };
            return desc[k];
          }, desc);

          // Apply the updater function to the new value
          const prop = opPath[opPath.length - 1];

          const updateValue = op.data.updater ? op.data.updater(prop ? final[prop] : final) : op.data.value;
          let newValue = updateValue;

          const { optimisticId } = op;

          if (optimisticId) {
            addRollback(optimisticId, {
              ...op,
              data: {
                path: op.data.path,
                value: prop ? final[prop] : final,
              },
            });
          }

          if (prop) {
            final[prop] = newValue;
          } else {
            final = newValue;
          }

          // $FlowFixMe
          state.lists[key] = desc;
        }

        if (op.op === 'listOp') {
          const { optimisticId } = op;
          const { listOp, count, items } = op.data;
          const desc = state.lists[key] ? { ...state.lists[key] } : makeHrStateDesc([]);

          if (listOp === 'push') {
            desc.value = desc.value.concat(items);
            state.lists[key] = desc;

            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                op: 'listOp',
                data: {
                  listOp: 'removeItems',
                  items,
                },
              });
            }
          }
          if (listOp === 'unshift') {
            desc.value = items.concat(desc.value);
            state.lists[key] = desc;

            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                op: 'listOp',
                data: {
                  listOp: 'removeItems',
                  items,
                },
              });
            }
          }
          if (listOp === 'pop') {
            const current = desc.value || [];

            const removed = current.slice(-1 * count);
            desc.value = current.slice(0, -1 * count);
            state.lists[key] = desc;

            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                op: 'listOp',
                data: {
                  listOp: 'push',
                  items: removed,
                },
              });
            }
          }

          if (listOp === 'shift') {
            const current = desc.value || [];

            const removed = current.slice(0, count);
            desc.value = current.slice(count);
            state.lists[key] = desc;

            if (optimisticId) {
              addRollback(optimisticId, {
                ...op,
                op: 'listOp',
                data: {
                  listOp: 'unshift',
                  items: removed,
                },
              });
            }
          }
          if (listOp === 'removeItems') {
            desc.value = desc.value.filter(x => items.indexOf(x) === -1);
            state.lists[key] = desc;
          }
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
  _pushOp(op: t.OpType, data: any, overrides: $Shape<t.HrStateWrapperOp> = {}) {
    this.path.info.ops.push({
      op,
      key: this.path.key,
      type: this.path.type,
      typeValue: this.path.typeValue,
      data,
      optimisticId: this.path.optimisticId,
      ...overrides,
    });
  }
}
