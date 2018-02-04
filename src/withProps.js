// @flow
'use strict';
import type { ComponentType } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import buildDispatcherComponent from './buildDispatcherComponent';
import HrQuery from './HrQuery';
import * as t from './types';
import { BaseStateOp, DirectAccessOp, SelectOp, CachedHrSelector } from './internal/selectorOps';
import * as globalState from './globalState';
import { DO_SPREAD, queryOrIdentity, wrapWholeStateInQueries } from './internal/internalUtils';

export class PropData {
  propOps: Array<BaseStateOp>
  dispatchComponentOps: Array<t.SubscribeDescriptor>
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

  watchAndDispatchAdvanced(descriptor: t.SubscribeDescriptor) {
    this.dispatchComponentOps.push(descriptor);
    return this;
  }

  /*
    Simple way to dispatch an action based on a prop changing.

    ```javascript
    .watchAndDispatch('SOME_ACTION', { somePayloadProperty: 'somePropName' })
    ```
  */
  watchAndDispatch(actionType: string, mapping: {[payloadKey: string]: any}) {
    const payloadKeys = Object.keys(mapping);
    const propKeys = payloadKeys.map(key => mapping[key]);

    this.watchAndDispatchAdvanced({
      handler: (selfState, ownProps, dispatch) => {
        let shouldDispatch = false;

        const currValues = propKeys.map(key => typeof key === 'function' ? key(ownProps) : ownProps[key]);

        if (!selfState.prev) {
          shouldDispatch = true;
        } else {
          for (let i = 0; i < propKeys.length; i += 1) {
            if (selfState.prev[i] !== currValues[i]) {
              shouldDispatch = true;
              break;
            }
          }
        }

        selfState.prev = currValues;

        if (shouldDispatch) {
          let payload = {};
          for (let i = 0; i < payloadKeys.length; i += 1) {
            payload[payloadKeys[i]] = currValues[i];
          }
          dispatch({
            type: actionType,
            payload,
          });
        }
      },
      needsState: false,
    });

    return this;
  }

  /*
    Creates a reselect selector which is evaluated against the component's own props.

    The final selector should return an action to be dispatched, or `null`
    if no action should be dispatched.

    If all of the selectors, excluding the final selector, return values `===`
    to the previous time they were called, the final selector won't be called
    again, and no action will be dispatched.

    This runs before any other selectors, so it only receives props passed to
    component returned by `.wrap` or `.asRender`, not props from the `.select` calls
    or similar.

    ```javascript
    .selectAndDispatch(
      props => props.item.id,
      props => props.sortOrder,

      // 'id' is the result of the first selector
      // 'sortOrder', the result of the second
      // returns an action
      (id, sortOrder) => ({ type: 'FOO', payload: { id, sortOrder } }),
    )
    ```
  */
  selectAndDispatch(...args: Array<Function>) {
    return this._selectAndDispatchInternal(false, ...args)
  }

  /*
    Like `selectAndDispatch` except selectors receive state (wrapped in `HrQuery`
    objects) as the first argument, and will be called on any redux state change,
    or props change.

    Be careful to avoid infinite dispatch cycles.
  */
  selectAndDispatchWithState(...args: Array<Function>) {
    return this._selectAndDispatchInternal(true, ...args)
  }

  _selectAndDispatchInternal(needsState: boolean, ...args: Array<Function>) {
    const selectors = args.slice(0, -1);
    const actionCreator = args[args.length - 1];

    this.watchAndDispatchAdvanced({
      needsState,
      handler: (selfState, ownProps, dispatch, state) => {
        selfState.didUpdate = false;
        if (!selfState.selector) selfState.selector = createSelector(...selectors, (...args) => {
          selfState.didUpdate = true;
          return actionCreator(...args);
        });

        let action;
        if (needsState) {
          action = selfState.selector(state, ownProps);
        } else {
          action = selfState.selector(ownProps);
        }

        if (selfState.didUpdate && action) {
          dispatch(action);
        }
      },
    });
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
