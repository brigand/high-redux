// @flow
import * as t from './types';

type HrQueryPath = {
  key: ?string,
}

function makePath() {
  return { key: null };
}

export default class HrQuery {
  st: Object;
  path: HrQueryPath;

  /*
    Create an HrQuery for the given object, which often implements the HrState
    interface. Most methods don't work on any other object.
  */
  constructor(stateTree: Object, path: ?HrQueryPath) {
    this.st = stateTree
    this.path = path || makePath();
  }


  /*
    Scope the query to a specific key
  */
  key(key: string): HrQuery {
    const path = {
      ...this.path,
      key,
    };

    return new HrQuery(this.st, path);
  }

  /*
    Get the value with the specified id, or null if it doesn't exist.
  */
  id(id: string) {
    const desc = this.idDesc(id);
    return desc ? desc.value : null;
  }

  /*
    Get a record by id, and return an object with a set of props that can be
    passed to a React component or similar.

    For example, var p = propsById(someId); p.data is the data, and p.dataLoading
    is the loading boolean.

    A name can be specified, which will be the prefix of the prop names.

    var p = propsById(someId, 'foo') gives p.foo as the main data, and p.fooLoading
    as the loading boolean.
  */
  idProps(id: string, name: string = 'data') {
    const desc = this.idDesc(id);

    if (!desc) return {};

    const props = {
      [name]: desc.value,
      [`${name}Error`]: desc.error,
      [`${name}HasError`]: desc.hasError,
      [`${name}Loading`]: desc.loading,
      [`${name}Meta`]: desc.etc || {},
    };

    return props;
  }

  /*
    Get the list for the current key. Always returns an array, but it may be empty
  */
  list() {
    const desc = this.listDesc();

    if (!desc) return [];

    return desc.value;
  }

  listDesc() {
    const key = t.getKey(this.path.key);
    const desc = this.st.lists[key];
    return desc || null;
  }

  /*
    Get props for the list state. See the propsById docs for an example
    of how this works.
  */
  listProps(name: string = 'items') {
    const desc = this.listDesc();

    if (!desc) return {};

    const props = {
      [name]: desc.value || [],
      [`${name}Error`]: desc.error || null,
      [`${name}HasError`]: desc.hasError || false,
      [`${name}Loading`]: desc.loading || false,
      [`${name}Meta`]: desc.etc || {},
    };

    return props;
  }

  idDesc(id: string) {
    const desc = this.st.byId[t.getKey(this.path.key)][id];
    return desc || null;
  }

  /*
    Get the state descriptor for the list. Mostly for internal use.
  */
  listDesc() {
    const desc = this.st.lists[t.getKey(this.path.key)];
    return desc || null;
  }

  /*
    Get the state descriptor for the given key/value pair. Mostly for internal use.
  */
  kvDesc(id: string) {
    const desc = this.st.kv[t.getKey(this.path.key)][id];
    return desc || null;
  }
}
