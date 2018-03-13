// @flow

import { DO_SPREAD } from './internalUtils';
import { createSelector } from 'reselect';
import { wrapWholeStateInQueries } from './internalUtils';

export class BaseStateOp {
  // The prop name hint. Most set a prop with this name.
  propName: string

  // Indicates if this operation needs the component's ownProps
  // If none of them do, then we can use the faster version of connect()
  needsOwnProps: boolean

  // A static handler that receives 'resProps', 'state' and 'ownProps' arguments
  // It should modify 'resProps' to add props to the props the component will receive
  // 'state' is the redux state without any wrappers.
  // 'ownProps' are the props the component has received
  // When used as a render callback, 'ownProps' will be <ConnectedRender ownProps={this value}>
  handler: ?Function

  // A function that returns a function like 'handler'
  // This is called for each instance of the component
  getHandler: ?Function

  constructor(propName: string) {
    this.propName = propName;
  }
}

export class DirectAccessOp extends BaseStateOp {
  constructor(propName: string, keys: Array<string>) {
    super(propName);
    const handler = (resProps, state) => {
      let value = state;
      for (let i = 0; i < keys.length; i += 1) {
        value = value[keys[i]];
      }

      resProps[this.propName] = value;
    };
    this.handler = handler;
  }
}

export class SelectOp extends BaseStateOp {
  funcs: Array<Function>

  constructor(propName: string, funcs: Array<Function>) {
    super(propName);
    this.funcs = funcs;

    if (funcs.length === 1) {
      var self = this;
      const selectOpHandler = (resProps, state, ownProps) => {
        const data = funcs[0](state, ownProps);
        self._applyRes(resProps, data);
      };
      this.handler = selectOpHandler;
    } else {
      this.getHandler = () => {
        const selector = createSelector(...funcs);

        return (resProps, state, ownProps) => {
          const data = selector(wrapWholeStateInQueries(state), ownProps);
          this._applyRes(resProps, data);
        };
      };
    }
  }

  _applyRes(resProps: Object, data: Object) {
    if (this.propName === DO_SPREAD) {
      Object.assign(resProps, data);
    } else {
      resProps[this.propName] = data;
    }
  }
}

export class CachedHrSelector extends BaseStateOp {
  constructor(propName: string, fromComp: Array<Function>, fromHr: Array<Function>) {
    super(propName);

    this.getHandler = () => {
      const pre1 = fromComp;
      const pre2 = fromHr.slice(0, -1);

      const finalFunc = fromHr[fromHr.length - 1];

      const selParts = [];

      let memo = [];
      const NULL = {};
      let memoFinal = NULL;

      return (resProps, state, ownProps) => {
        const args = [];
        const argsPre1 = [];
        const argsPre2 = [];
        let anyChanged = false;

        for (let i = 0; i < pre1.length; i += 1) {
          const value = pre1[i](state, ownProps);
          args.push(value);
          argsPre1.push(value);
          const last = args.length - 1;
          if (args[last] !== memo[last]) anyChanged = true;
        }

        const firstArgs = args.slice();

        for (let i = 0; i < pre2.length; i += 1) {
          const value = pre2[i](state, firstArgs);
          args.push(value);
          argsPre2.push(value);
          const last = args.length - 1;
          if (args[last] !== memo[last]) anyChanged = true;
        }

        if (anyChanged || memoFinal === NULL) {
          const final = finalFunc(...argsPre2);

          // If we're receiving a props object, it's very likely to have changed
          // since it's generated on each call. Instead of ===, do a shallow compare.
          if (this.propName === DO_SPREAD) {
            if (memoFinal === NULL || !memoFinal || typeof memoFinal !== 'object') {
              memoFinal = final;
              memo = args;
            } else {
              const keys = Object.keys(final);

              for (let i = 0; i < keys.length; i += 1) {
                const key = keys[i];
                if (final[key] !== memoFinal[key]) {
                  memoFinal = final;
                  memo = args;
                  break;
                }
              }
              // No differences? Don't touch anything
            }
          // Much easier when not in props spread mode
          } else if (final !== memoFinal) {
            memoFinal = final;
            memo = args;
          }
        }

        this._applyRes(resProps, memoFinal);
      };
    };
  }

  _applyRes(resProps: Object, data: any) {
    if (this.propName === DO_SPREAD) {
      Object.assign(resProps, data);
    } else {
      resProps[this.propName] = data;
    }
  }
}
