// @flow
import { HrStateWrapper, makeDefaultHrState } from './HrStateWrapper'
import HrQuery from './HrQuery';

export * from './HrStateWrapper';
export * from './types';
export * from './HrQuery';

// Convenience function
export const query = (data) => new HrQuery(data);

export type HighReducerRes = (state: ?Object, action: Object) => Object;

export type ActionHandler = (s: HrStateWrapper, payload: Object) => HrStateWrapper;

export type Opts = {
  name?: string,
  list?: boolean,
  byId?: boolean,
  actions: {[actionName: string]: ActionHandler},
}

export function makeReducer(opts: Opts): HighReducerRes {
  const { name, actions } = opts;

  function reducer(_state: ?Object, action: Object): Object {
    const state = _state || makeDefaultHrState();

    const handler = actions[action.type];
    if (!handler) return state;

    const hrState = new HrStateWrapper(state);

    const payload = {
      ...action.payload,
      orig: action.originalAction ? action.originalAction : null,
    };
    const res = handler(hrState, payload);

    if (!(res instanceof HrStateWrapper)) {
      throw new Error(`Expected high redux reducer ${name || '(no name)'} to return an object or HrStateWrapper but got ${res}`);
    }

    const resState = res.getState();

    return resState;
  }

  return reducer;
}
