// @flow

import HrQuery from '../HrQuery';
import * as globalState from '../globalState';

export const DO_SPREAD = '[[spread]]';

export function queryOrIdentity(value: any, queryClass: typeof HrQuery) {
  if (value && value.isHrState) return new queryClass(value);
  return value;
}


export function wrapWholeStateInQueries(state: Object) {
  const hrQueryClasses = globalState.get().hrQueryClasses;

  const keys = Object.keys(state);
  const out = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    let queryClass = HrQuery;
    if (hrQueryClasses[key]) queryClass = hrQueryClasses[key];

    out[key] = queryOrIdentity(state[key], queryClass);
  }
  return out;
}
