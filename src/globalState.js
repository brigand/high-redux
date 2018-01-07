// @flow
import * as t from './types';
import type HrQuery from './HrQuery';

type GlobalState = {
  hrQueryClasses: { [hrName: string]: Class<HrQuery> },
}

const globalState: GlobalState = {
  hrQueryClasses: {},
};

export const get = () => globalState;

export const clear = () => {
  const hrQueryClasses = globalState.hrQueryClasses;

  Object.keys(hrQueryClasses).forEach((key) => {
    delete hrQueryClasses[key];
  });
}
