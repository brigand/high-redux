// @flow
'use strict';
import { HrStateWrapper, wrapperFromState, makeDefaultHrState } from './HrStateWrapper'
import HrQuery from './HrQuery';
import withProps from './withProps';
import * as globalState from './globalState';
import * as t from './types';

export * from './HrStateWrapper';
export * from './types';
export * from './HrQuery';
export { withProps };


// Convenience function
export const query = (state: Object, key: ?string = null): HrQuery => {
  let adjustedState = state;
  if (!adjustedState.isHrState && key) {
    adjustedState = state[key];
  }

  if (!adjustedState.isHrState) {
    if (key) {
      throw new Error(`Neither state nor state[key] (key is second argument) returned an HrState object`);
    } else {
      throw new Error(`Attempted to make a query for a non-HrState object with no key (second argument) provided`);
    }
  }

  const queryClass = key && globalState.get().hrQueryClasses[key] || HrQuery;
  return new queryClass(adjustedState);
}

export type HighReducerRes = {
  reducer: (state: ?Object, action: Object) => Object,
}

export type ActionHandler = (s: HrStateWrapper, payload: any, action: { type: string, payload: any }) => HrStateWrapper;

export type Opts = {
  name?: string,
  list?: boolean,
  byId?: boolean,
  actions: {[actionName: string]: ActionHandler},
  selectors: t.SelectorMapping,
}

export function makeHr(opts: Opts): HighReducerRes {
  const { name, actions, selectors } = opts;

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

  function addToObject(obj, opts = {}) {
    obj[name] = reducer;

    const hrQueryClasses = globalState.get().hrQueryClasses;
    if (name && !opts.noBindSelectors) {
      if (hrQueryClasses[name]) {
        throw new Error(`Attempted to addToObject twice with the same name. Can't bind selectors. To disable the global selector binding do addToObject(reducers, { noBindSelectors: true })`);
      }

      class HrQueryForSelectors extends HrQuery {
        constructor(...args) {
          super(...args);
        }
      }

      const selectorNames = Object.keys(selectors);
      for (let i = 0; i < selectorNames.length; i += 1) {
        const selName = selectorNames[i];

        // $FlowFixMe
        if (HrQueryForSelectors.prototype[name]) {
          throw new Error(`Selector named ${selName} for hr state ${name} conflicts with an HrQuery method`);
        }

        const original = selectors[selName];

        let value = null;

        if (typeof original === 'function') {
          value = function wrappedSelector(...args) {
            return original(this, ...args);
          };
          Object.defineProperty(value, 'name', {
            configurable: true,
            writable: true,
            enumerable: true,
            value: `hrWrappedSel:${name}:${selName}`,
          });
        } else if (Array.isArray(original)) {
          value = original;
        } else {
          throw new Error(`Expected selector ${selName} to either be a function, or an array of functions`);
        }

        Object.defineProperty(HrQueryForSelectors.prototype, selName, {
          configurable: true,
          writable: true,
          value,
        });
      }

      hrQueryClasses[name] = HrQueryForSelectors;
    }

    return obj;
  }

  function getQuery(reduxState: Object) {
    const hrQueryClasses = globalState.get().hrQueryClasses;

    if (!name) {
      throw new Error(`getQuery called on a HighRedux with no 'name' provided at creation time.`);
    }

    const queryClass = hrQueryClasses[name] || HrQuery;

    let selfState = reduxState.isHrState ? reduxState : reduxState[name];

    return new queryClass(selfState);
  }

  return { name, reducer, addToObject, getQuery, selectors };
}

export const cleanGlobalState = () => {
  globalState.clear();
}
