import * as React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

export { mount };

export function testStore() {
  function reducer(state = { value: 'initial' }, action) {
    if (action.type === 'SET') {
      store.setActionCount += 1;
      return { value: action.payload };
    }
    return state;
  }
  const store = createStore(reducer);
  store.setActionCount = 0;

  return store;
}

export function mountWithStore(Comp, initialProps) {
  const store = testStore();

  class TestWrapper extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <Comp {...this.props} />
        </Provider>
      );
    }
  }

  const wrapper = mount(<TestWrapper {...initialProps} />);

  return { store, wrapper };
}
