import * as React from 'react';
import { mountWithStore } from './testUtils';
import buildDispatcherComponent from '../buildDispatcherComponent';

describe.skip('buildDispatcherComponent', () => {
  it(`basic`, () => {
    const C = () => <div>hello</div>;

    const C2 = buildDispatcherComponent(C, [{
      propSelectors: [props => props.x],
      getAction: (props) => ({ type: 'SET', payload: props.x }),
    }]);

    const { store, wrapper } = mountWithStore(C2, { x: 7 });

    expect(store.getState()).toEqual({ value: 7 });

    wrapper.setProps({ x: 20 });
    expect(store.getState()).toEqual({ value: 20 });

    expect(store.setActionCount).toBe(2);
  });

  it(`doesn't dispatch for other props changing`, () => {
    const C = () => <div>hello</div>;

    const C2 = buildDispatcherComponent(C, [{
      propSelectors: [props => props.thisIsNeverUpdated],
      getAction: (props) => ({ type: 'SET', payload: 100 }),
    }]);

    const { store, wrapper } = mountWithStore(C2, { x: 7 });
    expect(store.getState()).toEqual({ value: 100 });

    wrapper.setProps({ x: 20 });
    expect(store.getState()).toEqual({ value: 100 });
    expect(store.setActionCount).toBe(1);
  });

  it(`works for 2 selectors`, () => {
    const C = () => <div>hello</div>;

    const C2 = buildDispatcherComponent(C, [{
      propSelectors: [props => props.x, props => props.y],
      getAction: (props) => ({ type: 'SET', payload: `${props.x},${props.y}` }),
    }]);

    const { store, wrapper } = mountWithStore(C2, { x: 1, y: 2 });
    expect(store.getState()).toEqual({ value: `1,2` });

    wrapper.setProps({ x: 20 });
    expect(store.getState()).toEqual({ value: `20,2` });

    wrapper.setProps({ y: 30 });
    expect(store.getState()).toEqual({ value: `20,30` });

    wrapper.setProps({ z: 100 });
    expect(store.getState()).toEqual({ value: `20,30` });
    expect(store.setActionCount).toBe(3);
  });
});
