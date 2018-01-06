import HrQuery from '../HrQuery';
import hrStateFixture, { IDS } from './hrStateFixture';

describe(`HrQuery byId`, () => {
  it(`valueById`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const v = q.id(IDS[0]);
    expect(v).toEqual({ index: 0 });
  });

  it(`propsById`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const v = q.idProps(IDS[0], 'foo');
    expect(v).toEqual({
      foo: { index: 0 },
      fooError: null,
      fooHasError: false,
      fooLoading: false,
      fooMeta: {},
    });
  });
});

describe(`HrQuery list`, () => {
  it(`list`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const l = q.list();
    expect(l).toBeInstanceOf(Array);
    expect(l.length).toBe(IDS.length);
    expect(l[0]).toBe(IDS[0]);
  });

  it(`propsFromList`, () => {
    const q = new HrQuery(hrStateFixture().getState());
    const v = q.listProps('foo');
    expect(v).toEqual({
      foo: IDS,
      fooError: null,
      fooHasError: false,
      fooLoading: false,
      fooMeta: {},
    });
  });
});
