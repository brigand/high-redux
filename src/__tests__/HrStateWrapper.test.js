import { wrapperFromState } from '../HrStateWrapper';
import HrQuery from '../HrQuery';
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

  it(`push`, () => {
    const s = wrapperFromState().list().set(['v1', 'v2']);

    const s2 = wrapperFromState(s.getState()).optimistic('foo').list().push('v3', 'v4');

    expect(s2.getState().lists[getKey()].value).toEqual(['v1', 'v2', 'v3', 'v4']);

    const s3 = wrapperFromState(s2.getState()).optimistic('foo').rollback();
    expect(s3.getState().lists[getKey()].value).toEqual(['v1', 'v2']);
  });

  it(`unshift`, () => {
    const s = wrapperFromState().list().set(['v1', 'v2']);

    const s2 = wrapperFromState(s.getState()).optimistic('foo').list().unshift('v3', 'v4');

    expect(s2.getState().lists[getKey()].value).toEqual(['v3', 'v4', 'v1', 'v2']);

    const s3 = wrapperFromState(s2.getState()).optimistic('foo').rollback();
    expect(s3.getState().lists[getKey()].value).toEqual(['v1', 'v2']);
  });

  it(`pop`, () => {
    const s = wrapperFromState().list().set(['v1', 'v2', 'v3', 'v4']);

    const s2 = wrapperFromState(s.getState()).optimistic('foo').list().pop(2);

    expect(s2.getState().lists[getKey()].value).toEqual(['v1', 'v2']);

    const s3 = wrapperFromState(s2.getState()).optimistic('foo').rollback();
    expect(s3.getState().lists[getKey()].value).toEqual(['v1', 'v2', 'v3', 'v4']);
  });

  it(`shift`, () => {
    const s = wrapperFromState().list().set(['v1', 'v2', 'v3', 'v4']);

    const s2 = wrapperFromState(s.getState()).optimistic('foo').list().shift(2);

    expect(s2.getState().lists[getKey()].value).toEqual(['v3', 'v4']);

    const s3 = wrapperFromState(s2.getState()).optimistic('foo').rollback();
    expect(s3.getState().lists[getKey()].value).toEqual(['v1', 'v2', 'v3', 'v4']);
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
    s.kv('test').setMeta('x', 1);

    const state = s.getState();
    expect(state.kv[getKey()].test.value).toBe('val');
    expect(state.kv[getKey()].test.etc.x).toBe(1);
  });
});

describe('HrStateWrapper optimistic', () => {
  it(`id/kv set`, () => {
    const s = wrapperFromState()
      .kv('foo').set('a').getState();

    const s2 = wrapperFromState(s).optimistic('op').kv('foo').set('b').getState();

    const s3 = wrapperFromState(s2).optimistic('op').rollback().getState();

    const q = new HrQuery(s3);
    expect(q.kv('foo')).toBe('a');
  });

  it(`id/kv updateValue`, () => {
    const s = wrapperFromState()
      .kv('foo').set({ a: 1, b: 2, c: 3 }).getState();

    const s2 = wrapperFromState(s).optimistic('op').kv('foo').update(o => ({
      b: 'this will be reverted',
    })).getState();

    const s3 = wrapperFromState(s2).kv('foo').update(o => ({ c: 3 })).getState();
    const s4 = wrapperFromState(s2).optimistic('op').rollback().getState();

    const q = new HrQuery(s4);
    expect(q.kv('foo')).toEqual({ a: 1, b: 2, c: 3 });
  });

  it(`id/kv setIds`, () => {
    const s = wrapperFromState()
      .setIds([
        ['ak', 'av'],
        ['bk', 'bv'],
      ]).getState();

    const s2 = wrapperFromState(s).optimistic('op').setIds([
      ['bk', 'this will be reset'],
      ['ck', 'this will be removed'],
    ]).getState();

    const s3 = wrapperFromState(s2).optimistic('op').rollback().getState();

    const q = new HrQuery(s3);
    expect(q.id('ak')).toBe('av');
    expect(q.id('bk')).toBe('bv');

    // Assert that we deleted the 'ck' key
    expect(s3.byId['[[default]]'].ak).toBeTruthy();
    expect(s3.byId['[[default]]'].ck).toBe(undefined);
  });

  it(`id/kv set new`, () => {
    const s = wrapperFromState()
      .id('foo').optimistic('op').set({ x: 1 }).getState();

    const q = new HrQuery(s);
    expect(q.id('foo')).toEqual({ x: 1 });

    const s2 = wrapperFromState(s).optimistic('op').rollback().getState();

    expect(s2.byId[getKey()]).toEqual({});
  });

  it(`clearOptimistic`, () => {
    const s = wrapperFromState()
      .kv('foo').set('a').getState();

    const s2 = wrapperFromState(s).optimistic('op').kv('foo').set('b').getState();

    const s3 = wrapperFromState(s2).clearOptimistic('op').getState();
    expect(s3.rollbackOps).toEqual({});
  });
});
