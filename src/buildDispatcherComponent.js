// @flow
import * as React from 'react';
import * as PT from 'prop-types';
import shallowEqual from 'shallowequal';

export type PropSelector = (ownProps: Object) => any;

export type PropAction = {
  type: string,
  payload: any,
}

export type DispatcherOp = {
  propSelectors: Array<PropSelector>,
  getAction: (ownProps: Object, selectorResults: Array<any>) => PropAction,
}

export default function buildDispatcherComponent(C: React.ComponentType<Object>, ops: Array<DispatcherOp>) {
  class DispatcherComponent extends React.Component<any> {
    static contextTypes = {
      store: PT.any.isRequired,
    }

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
      this.context.store.dispatch(action);
    }

    render() {
      return <C {...this.props} />;
    }
  }

  return DispatcherComponent;
}
