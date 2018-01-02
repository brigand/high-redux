import { HrStateWrapper, getKey } from '../HrStateWrapper';

describe(`HrStateWrapper basic`, () => {
  it(`doesn't error`, () => {
    const s = new HrStateWrapper();
    s.setIdPairs(null, [['some-id', 'some-value']]);
    s.setById(null, 'another-id', 'another-value');
    s.setIdError(null, 'another-id', { message: 'test error' });
    s.setList(null, ['some-id', 'another-id']);
    const state = s.getState();

    expect(state).toBeInstanceOf(Object);
    expect(state).toMatchSnapshot(`doesn't error: testing many operations`);
  });
});

describe(`HrStateWrapper id`, () => {
  it(`setIdPairs`, () => {
    const s = new HrStateWrapper();
    s.setIdPairs(null, [['idA', 'valueA'], ['idB', 'valueB']]);

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idB.value).toBe('valueB');
  });

  it(`setById`, () => {
    const s = new HrStateWrapper();
    s.setIdPairs(null, [['idA', 'valueA'], ['idB', 'valueB']]);
    s.setById(null, 'idC', 'valueC');

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idB.value).toBe('valueB');
    expect(state.byId[getKey()].idC.value).toBe('valueC');
  });

  it(`setIdError`, () => {
    const s = new HrStateWrapper();

    s.setById(null, 'idA', 'valueA');
    s.setIdError(null, 'idA', 'some-error');
    s.setIdError(null, 'idB', 'another-error');

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idA.hasError).toBe(true);
    expect(state.byId[getKey()].idB.hasError).toBe(true);

    expect(state.byId[getKey()].idA.error).toBe('some-error');
    expect(state.byId[getKey()].idB.error).toBe('another-error');
  });

  it(`alternate keys`, () => {
    const s = new HrStateWrapper();
    s.setById('foo', 'id', 'valueA');
    s.setById(null, 'id', 'valueB');
    s.setById('bar', 'id', 'valueC');
    s.setById('bar', 'id2', 'valueD');

    const state = s.getState();
    expect(state.byId[getKey('foo')].id.value).toBe('valueA');
    expect(state.byId[getKey(null)].id.value).toBe('valueB');
    expect(state.byId[getKey('bar')].id.value).toBe('valueC');
    expect(state.byId[getKey('bar')].id2.value).toBe('valueD');
  });
});

describe(`HrStateWrapper list`, () => {
  it(`setList`, () => {
    const s = new HrStateWrapper();
    s.setList(null, ['v1', 'v2']);

    const state = s.getState();
    expect(state.lists[getKey()].value).toEqual(['v1', 'v2']);
  });
});


describe(`HrStateWrapper kv`, () => {
  it(`setKv`, () => {
    const s = new HrStateWrapper();
    s.setKv(null, 'test', 'val');

    const state = s.getState();
    expect(state.kv[getKey()].test.value).toBe('val');
    expect(state.kv[getKey()].test.hasError).toBe(false);
  });

  it(`setKvMeta`, () => {
    const s = new HrStateWrapper();
    s.setKv(null, 'test', 'val');
    s.setKvMeta(null, 'test', { userMeta: { x: 1 } });

    const state = s.getState();
    expect(state.kv[getKey()].test.value).toBe('val');
    expect(state.kv[getKey()].test.userMeta.x).toBe(1);
  });
});
