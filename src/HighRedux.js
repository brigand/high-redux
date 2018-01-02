// @flow
import { HrStateWrapper } from './HrStateWrapper'
export * from './HrStateWrapper';

export function makeHighReducer(opts: Opts): HighReducerRes {
  const { name, actions } = opts;

  function reducer(_state: ?Object, action: Object) {
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
