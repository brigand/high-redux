import { wrapperFromState } from '../HrStateWrapper';
import { getKey } from '../types';

describe(`HrStateWrapper basic`, () => {
  it(`doesn't error`, () => {
    const s = wrapperFromState();
    s.setIds([['some-id', 'some-value']]);
    s.id('another-id').set('another-value');
    s.id('another-id').setError({ message: 'test error' });
    s.list().set(['some-id', 'another-id']);
    const state = s.getState();

    expect(state).toBeInstanceOf(Object);
    expect(state).toMatchSnapshot(`doesn't error: testing many operations`);
  });
});

describe(`HrStateWrapper id`, () => {
  it(`setIds`, () => {
    const s = wrapperFromState();
    s.setIds([['idA', 'valueA'], ['idB', 'valueB']]);

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idB.value).toBe('valueB');
  });

  it(`id->set`, () => {
    const s = wrapperFromState();
    s.setIds([['idA', 'valueA'], ['idB', 'valueB']]);
    s.id('idC').set('valueC');

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idB.value).toBe('valueB');
    expect(state.byId[getKey()].idC.value).toBe('valueC');
  });

  it(`id->setError`, () => {
    const s = wrapperFromState();

    s.id('idA').set('valueA');
    s.id('idA').setError('some-error');
    s.id('idB').setError('another-error');

    const state = s.getState();
    expect(state.byId[getKey()].idA.value).toBe('valueA');
    expect(state.byId[getKey()].idA.hasError).toBe(true);
    expect(state.byId[getKey()].idB.hasError).toBe(true);

    expect(state.byId[getKey()].idA.error).toBe('some-error');
    expect(state.byId[getKey()].idB.error).toBe('another-error');
  });

  it(`alternate keys`, () => {
    const s = wrapperFromState();
    s.key('foo').id('id').set('valueA');
    s.id('id').set('valueB');
    s.id('id').set('valueB');
    s.key('bar').id('id').set('valueC');
    s.key('bar').id('id2').set('valueD');

    const state = s.getState();
    expect(state.byId[getKey('foo')].id.value).toBe('valueA');
    expect(state.byId[getKey(null)].id.value).toBe('valueB');
    expect(state.byId[getKey('bar')].id.value).toBe('valueC');
    expect(state.byId[getKey('bar')].id2.value).toBe('valueD');
  });
});

describe(`HrStateWrapper list`, () => {
  it(`setList`, () => {
    const s = wrapperFromState();
    s.list().set(['v1', 'v2']);

    const state = s.getState();
    expect(state.lists[getKey()].value).toEqual(['v1', 'v2']);
  });
});


describe(`HrStateWrapper kv`, () => {
  it(`setKv`, () => {
    const s = wrapperFromState();
    s.kv('test').set('val');

    const state = s.getState();
    expect(state.kv[getKey()].test.value).toBe('val');
    expect(state.kv[getKey()].test.hasError).toBe(false);
  });

  it(`setKvMeta`, () => {
    const s = wrapperFromState();
    s.kv('test').set('val');
    s.kv('test').setMeta({ x: 1 });

    const state = s.getState();
    expect(state.kv[getKey()].test.value).toBe('val');
    expect(state.kv[getKey()].test.etc.x).toBe(1);
  });
});
