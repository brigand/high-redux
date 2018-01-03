// @flow
import type { ComponentType } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import buildDispatcherComponent, { type DispatcherOp } from './buildDispatcherComponent';
import HrQuery from './HrQuery';
import * as t from './types';

function queryOrIdentity(value: any) {
  if (value && value.isHrState) return new HrQuery(value);
  return value;
}

export class PropData {
  propOps: Array<BaseOperation>
  dispatchOps: Array<DispatcherOp>
  constructor() {
    this.propOps = [];
    this.dispatchOps = [];
  }


  clone() {
    const copy = new PropData;
    copy.propOps = this.propOps.slice();
    return copy;
  }

  // Wrap a component in connect()
  wrap(component: ComponentType<any>) {

  }

  // Returns a render callback component
  asRender() {

  }

  _buildDispatcherComponent(C: ComponentType<any>) {
    return buildDispatcherComponent(C, this.dispatchOps);
  }

  /*
    Select from state and convert it to one or more props. The `propName` will
    be the name of the prop, or in the case of e.g. HrQuery::propsById it'll
    be the prefix for the prop name.

    The variadic arguments must be either all strings, or all functions.

    If strings, then it'll look up the state by the key path.
    e.g. `select('foo', 'a', 'b', 'c')` will set the 'foo' prop to be
    `state.a.b.c`. Most useful for simple non-hr states.

    When passed an array of functions, it'll work like a reselect selector that's
    created for each instance of this component. The other difference from vanilla
    reselect is that if one of the first selectors returns a hr state object,
    it'll be wrapped in a HrQuery for you.
  */
  select(propName: string, ...args: Array<any>) {
    if (!args.length) throw new Error(`select expects at least 2 arguments`);

    if (args.every(x => typeof x === 'string')) {
      this.propOps.push(new DirectAccessOp(propName, args));
      return this;
    }

    if (args.every(x => typeof x === 'function')) {
      this.propOps.push(new SelectOp(propName, args));
      return this;
    }

    throw new Error(`select expects 1 or more strings, or 1 or more functions but recieved ${args.map(x => typeof x).join(', ')}`);
  }

  _makeSelector(sel: Function | string) {
    return typeof sel === 'function' ? sel : ((ownProps: Object) => ownProps[sel]);
  }

  // userId, { type: 'FETCH_FOO', payload: { id: userId }}
  propsToDispatch(...args: Array<any>) {
    // Check if they provide an action factory
    if (typeof args[args.length - 1] === 'function') {
      const selectors = args.slice(0, -1);
      const fn = args[args.length - 1];
      this.dispatchOps.push({
        propSelectors: selectors.map(this._makeSelector),
        getAction: fn,
      });
    // Otherwise we'll create one from positional arguments.
    } else {
      throw new Error(`withProps::propsToDispatch expected last argument to be a function`);
    }
  }
}

export default function withProps() {
  return new PropData();
}

class BaseOperation {
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

  constructor(propName) {
    this.propName = propName;
  }
}

class DirectAccessOp extends BaseOperation {
  constructor(propName, keys: Array<string>) {
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

class SelectOp extends BaseOperation {
  funcs: Array<Function>

  constructor(propName, funcs: Array<Function>) {
    super(propName);
    this.funcs = funcs;

    if (funcs.length === 1) {
      this.handler = funcs[0];
    } else {
      this.getHandler = () => {
        const selector = createSelector(...funcs);

        return (state, ownProps) => selector(wrapWholeStateInQueries(state), ownProps);
      };
    }
  }
}

function wrapWholeStateInQueries(state) {
  const keys = Object.keys(state);
  const out = {};
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[0];
    out[key] = queryOrIdentity(state[key]);
  }
  return out;
}
