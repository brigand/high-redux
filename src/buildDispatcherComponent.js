// @flow
'use strict';
import * as React from 'react';
import * as PT from 'prop-types';
import shallowEqual from 'shallowequal';

export type PropSelector = (ownProps: Object) => any;

export type PropAction = {
  type: string,
  payload: any,
}

export type DispatchComponentOp = {
  propSelectors: Array<PropSelector>,
  getAction: (ownProps: Object, selectorResults: Array<any>) => PropAction,
}

type ExtraOpts = {
  computeKey: ?Function
}

export default function buildDispatcherComponent(C: React.ComponentType<Object>, ops: Array<DispatchComponentOp>, extraOpts: ExtraOpts) {
  class DispatcherComponent extends React.Component<any> {
    previousValues: Array<any>

    constructor(props: any, context: any) {
      super(props, context);
      this.previousValues = [];
      for (let i = 0; i < ops.length; i += 1) {
        this.previousValues.push(null);
      }
    }

    componentWillMount() {
      this.maybeDispatch(null, this.props);
    }

    componentWillReceiveProps(nextProps: Object) {
      this.maybeDispatch(this.props, nextProps);
    }

    maybeDispatch(prevProps: ?Object, nextProps: Object) {
      for (let i = 0; i < ops.length; i += 1) {
        const op = ops[i];
        const prev = this.previousValues[i];

        const values = op.propSelectors.map(f => f(nextProps));

        if (!prevProps || !prev) {
          this.dispatchAction(op.getAction(nextProps, values));
        } else if (!shallowEqual(this.previousValues[i], values)) {
          this.dispatchAction(op.getAction(nextProps, values));
        }
        this.previousValues[i] = values;
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
