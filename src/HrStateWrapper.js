// @flow
import * as t from './types';

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
    userMeta: {},
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

export function getKey(key: ?string) {
  if (!key) return '[[default]]';
  return key;
}

export class HrStateWrapper {
  state: t.HrState
  ops: Array<HrStateWrapperOp>

  // In case getState is called twice without any ops being pushed
  computedState: ?t.HrState;

  /*
    Creates a HrStateWrapper instance. This is typically done for you.
  */
  constructor(state: ?t.HrState) {
    this.state = state || makeDefaultHrState();
    this.computedState = null;

    this.ops = [];
  }

  /*
    For each item in 'pairs', map the first item in the pair (the id) to the
    second item (the value). More efficient than `setById` for lists.
  */
  setIdPairs(pairs: Array<[string, any]>) {
    return this.setIdPairsKey(null, pairs);
  }
  setIdPairsKey(key: ?string, pairs: Array<[string, any]>) {
    this.computedState = null;
    if (!Array.isArray(pairs)) {
      throw new Error(`HrStateWrapper::setIdPairs expected the second argument to be an array but got ${pairs}`);
    }
    this.ops.push({ type: 'setIds', key: getKey(key), data: pairs });
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
    this.computedState = null;
    this.ops.push({ type: 'updateIdDesc', key: getKey(key), id, data: { value } });
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
    this.computedState = null;
    this.ops.push({
      type: 'updateIdDesc',
      key: getKey(key),
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
    this.computedState = null;
    if (!Array.isArray(items)) {
      throw new Error(`HrStateWrapper::setList expected the second argument to be an array but got ${items}`);
    }
    this.ops.push({ type: 'setList', key: getKey(key), data: items });
  }

  /*
    Sets a simple key/value pair
  */
  setKv(id: string, value: any) {
    return this.setKvKey(null, id, value);
  }
  setKvKey(key: ?string, id: string, value: any) {
    this.computedState = null;

    this.ops.push({ type: 'setKvMeta', key: getKey(key), id, data: { value } });
    return this;
  }

  /*
    Sets metadata for the key, e.g. setKvMeta(id, { loading: true, userMeta: { anything: 1 } })
  */
  setKvMeta(id: string, value: $Shape<t.HrStateDesc<any>>) {
    return this.setKvMetaKey(null, id, value);
  }
  setKvMetaKey(key: ?string, id: string, value: $Shape<t.HrStateDesc<any>>) {
    this.computedState = null;

    this.ops.push({ type: 'setKvMeta', key: getKey(key), id, data: value });
    return this;
  }

  /*
    Compute the state by applying all update operations. Mostly for internal use.
  */
  getState(): Object {
    const { ops } = this;
    if (!ops.length) return this.state;
    this.ops = [];
    if (this.computedState) return this.computedState;

    // Cache this in case our code spans 2+ms, and gives better perf
    const now = process.env.NODE_ENV === 'test' ? 1514862765212 : Date.now();

    // Track which things we've cloned to improve performance, and avoid
    // cloning objects that don't need to be cloned.
    const cloned = { id: false, lists: false, kv: false };
    const clonedKey = {
      id: Object.create(null),
      lists: Object.create(null),
      kv: Object.create(null),
    };

    const state = { ...this.state };
    for (let i = 0; i < ops.length; i += 1) {
      const op = ops[i];

      const key = getKey(op.key);

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
          state.byId[key][pair[0]] = makeHrStateDesc(pair[1], { loadingCompleteTime: now });
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
          { loadingCompleteTime: now },
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
}
