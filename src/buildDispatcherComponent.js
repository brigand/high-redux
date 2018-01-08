// @flow
'use strict';
import * as React from 'react';
import * as PT from 'prop-types';
import * as t from './types';
import { wrapWholeStateInQueries } from './internal/internalUtils';
import shallowEqual from 'shallowequal';

export type PropSelector = (ownProps: Object) => any;

export type PropAction = {
  type: string,
  payload: any,
}

type ExtraOpts = {
  computeKey: ?Function
}

export default function buildDispatcherComponent(C: React.ComponentType<Object>, ops: Array<t.SubscribeDescriptor>, extraOpts: ExtraOpts) {
  const anyNeedState = ops.some(x => x.needsState);

  class DispatcherComponent extends React.Component<any> {
    previousValues: Array<any>
    handlerState: Array<any>
    unsub: ?() => mixed

    constructor(props: any, context: any) {
      super(props, context);
      this.previousValues = [];
      for (let i = 0; i < ops.length; i += 1) {
        this.previousValues.push(null);
      }

      this.handlerState = Array.from({ length: ops.length }, () => ({}));
    }

    componentWillMount() {
      this.maybeDispatch(null, this.props);
      if (anyNeedState) {
        this.unsub = this.context.store.subscribe(() => {
          this.maybeDispatch(this.props, this.props);
        });
      }
    }

    componentWillReceiveProps(nextProps: Object) {
      this.maybeDispatch(this.props, nextProps);
    }


    componentWillUnmount() {
      if (this.unsub) this.unsub();
    }

    maybeDispatch(prevProps: ?Object, nextProps: Object) {
      const store = this.context.store;
      let state = null;

      if (anyNeedState) {
        state = wrapWholeStateInQueries(store.getState());
      }

      for (let i = 0; i < ops.length; i += 1) {
        const op = ops[i];
        const prev = this.previousValues[i];

        const res = op.handler(
          this.handlerState[i],
          nextProps,
          store.dispatch,
          op.needsState ? state : null,
        );

        if (res) {
          this.handlerState[i] = res;
        }
      }
    }

    dispatchAction(action: PropAction) {
      if (action) {
        this.context.store.dispatch(action);
      }
    }

    render() {
      let key = undefined;
      const { computeKey } = extraOpts || {};
      if (computeKey) {
        key = computeKey(this.props, this.context.store.getState());
      }

      if (key !== undefined) {
        return <C {...this.props} key={key} />;
      } else {
        return <C {...this.props} />;
      }
    }
  }

  DispatcherComponent.contextTypes = { store: PT.any.isRequired };

  return DispatcherComponent;
}
