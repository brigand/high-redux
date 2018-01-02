import HrQuery from '../HrQuery';
import hrStateFixture, { IDS } from './hrStateFixture';

describe(`HrQuery byId`, () => {
  it(`valueById`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const v = q.valueById(IDS[0]);
    expect(v).toEqual({ index: 0 });
  });

  it(`propsById`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const v = q.propsById(IDS[0], 'foo');
    expect(v).toEqual({
      foo: { index: 0 },
      fooError: null,
      fooHasError: false,
      fooLoading: false,
      fooMeta: {}
    });
  });
});
