// @flow
'use strict';
import { HrStateWrapper, wrapperFromState, makeDefaultHrState } from './HrStateWrapper'
import HrQuery from './HrQuery';
import withProps from './withProps';

export * from './HrStateWrapper';
export * from './types';
export * from './HrQuery';
export { withProps };


// Convenience function
export const query = (data) => new HrQuery(data);

export type HighReducerRes = {
  reducer: (state: ?Object, action: Object) => Object,
}

export type ActionHandler = (s: HrStateWrapper, payload: any, action: { type: string, payload: any }) => HrStateWrapper;

export type Opts = {
  name?: string,
  list?: boolean,
  byId?: boolean,
  actions: {[actionName: string]: ActionHandler},
}

export function makeHr(opts: Opts): HighReducerRes {
  const { name, actions } = opts;

  function reducer(_state: ?Object, action: Object): Object {
    const state = _state || makeDefaultHrState();

    const handler = actions[action.type];
    if (!handler) return state;

    const hrState = wrapperFromState(state);

    const res = handler(hrState, action.payload, action);

    if (!(res instanceof HrStateWrapper)) {
      throw new Error(`Expected high redux reducer ${name || '(no name)'} to return an object or HrStateWrapper but got ${res}`);
    }

    const resState = res.getState();

    return resState;
  }

  function addToObject(obj) {
    obj[name] = reducer;
    return obj;
  }

  return { name, reducer, addToObject };
}
