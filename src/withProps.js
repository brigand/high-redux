// @flow
'use strict';
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import buildDispatcherComponent, { type DispatchComponentOp } from './buildDispatcherComponent';
import HrQuery from './HrQuery';
import * as t from './types';
import { BaseStateOp, DirectAccessOp, SelectOp, CachedHrSelector } from './internal/selectorOps';
import * as globalState from './globalState';
import { DO_SPREAD, queryOrIdentity, wrapWholeStateInQueries } from './internal/internalUtils';

export class PropData {
  propOps: Array<BaseStateOp>
  dispatchComponentOps: Array<DispatchComponentOp>
  dispatchPropOps: Array<DispatchPropOp>
  computeKey: ?Function

  constructor() {
    this.propOps = [];
    this.dispatchComponentOps = [];
    this.dispatchPropOps = [];
    this.computeKey = null;
  }

  clone() {
    const copy = new PropData;
    copy.propOps = this.propOps.slice();
    return copy;
  }

  // Wrap a component in connect()
  wrap(component: ComponentType<any>) {
    let C = connect(this._buildMapState(), this._buildMapDispatch())(component);

    if (this.dispatchComponentOps.length
      // If computeKey is defined, we need a wrapper component that sets the 'key', so we build the
      // dispatch component even if there are no dispatch opts
      || this.computeKey
    ) {
      C = this._buildDispatcherComponent(C);
    }

    return C;
  }

  // Returns a render callback component
  asRender() {

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

    const preArgs = args.slice(0, -1);
    const selArg = args[args.length - 1];
    if (preArgs.every(x => typeof x === 'function') && Array.isArray(selArg)) {
      this.propOps.push(new CachedHrSelector(propName, preArgs, selArg));
      return this;
    }

    throw new Error(`select expects 1 or more strings, or 1 or more functions but recieved ${args.map(x => typeof x).join(', ')}`);
  }

  selectProps(...args: Array<any>) {
    return this.select(DO_SPREAD, ...args);
  }

  bindAction(propName: string, getAction: Function) {
    this.dispatchPropOps.push(new DispatchPropOp(propName, getAction));
    return this;
  }

  _makeSelector(sel: Function | string) {
    return typeof sel === 'function' ? sel : ((ownProps: Object) => ownProps[sel]);
  }

  propsToDispatchRaw(selectors: Array<any>, getAction: Function) {
    this.dispatchComponentOps.push({
      propSelectors: selectors.map(this._makeSelector),
      getAction,
    });
    return this;
  }

  watchAndDispatch(actionType: string, mapping: {[payloadKey: string]: any}) {
    const keys = Object.keys(mapping);
    const values = keys.map(key => mapping[key]);
    this.propsToDispatchRaw(values, (ownProps, results) => {
      const payload = {};
      for (let i = 0; i < keys.length; i += 1) {
        payload[keys[i]] = results[i];
      }
      return {
        type: actionType,
        payload,
      }
    });
    return this;
  }

  propsToDispatchPos(actionType: string, selectors: Array<string>) {
    const invalidIndex = selectors.findIndex(x => typeof x !== 'string');
    if (invalidIndex !== -1) {
      throw new Error(`withProps::propsToDispatchPos expected all selectors to be strings, but selector at ${invalidIndex} is ${typeof selectors[invalidIndex]}`);
    }

    this.propsToDispatchRaw(selectors, (ownProps: Object, results: Array<any>) => {
      const payload = {};

      for (let i = 0; i < selectors.length; i += 1) {
        const sel = selectors[i];
        const res = results[i];
        payload[sel] = res;
      }

      return {
        type: actionType,
        payload,
      };
    });
    return this;
  }

  keyBy(_selector: string | Function) {
    const selector = typeof _selector === 'string'
      ? ((ownProps) => ownProps[_selector])
      : _selector;
    if (typeof selector !== 'function') {
      throw new Error(`withProps::keyBy first arg must be a string or function`);
    }

    this.computeKey = selector;
    return this;
  }


  _buildDispatcherComponent(C: ComponentType<any>) {
    return buildDispatcherComponent(C, this.dispatchComponentOps, { computeKey: this.computeKey });
  }

  // Builds mapStateToProps for connect
  _buildMapState() {
    const { propOps } = this;

    return function makeMapStateToProps() {
      const handlers = propOps.map(x => x.getHandler ? x.getHandler() : x.handler);
      return function mapStateToProps(state: Object, ownProps: Object) {
        const resProps = {};
        const wrappedState = wrapWholeStateInQueries(state)
        for (let i = 0; i < handlers.length; i += 1) {
          const handler = handlers[i];
          if (handler) {
            handler(resProps, wrappedState, ownProps);
          }
        }
        return resProps;
      }
    }
  }

  // Builds mapDispatchToProps for connect
  _buildMapDispatch() {
    const { dispatchPropOps } = this;

    const mapDispatchToProps = {};
    for (let i = 0; i < dispatchPropOps.length; i += 1) {
      const op = dispatchPropOps[i];
      mapDispatchToProps[op.propName] = op.makeAction;
    }

    return mapDispatchToProps;
  }
}

export default function withProps() {
  return new PropData();
}


class DispatchPropOp {
  propName: string
  makeAction: Function
  constructor(propName: string, makeAction: Function) {
    this.propName = propName;
    this.makeAction = makeAction;
  }
}
