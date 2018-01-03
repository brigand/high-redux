// @flow
import * as t from './types';

export default class HrQuery {
  st: Object;

  /*
    Create an HrQuery for the given object, which often implements the HrState
    interface. Most methods don't work on any other object.
  */
  constructor(stateTree: Object) {
    this.st = stateTree
  }

  /*
    Get the value with the specified id, or null if it doesn't exist.
  */
  valueById(id: string) {
    return this.valueByIdKey(t.getKey(null), id);
  }
  valueByIdKey(key: string, id: string) {
    const desc = this.descByIdKey(key, id);
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
  propsById(id: string, name: ?string = null) {
    return this.propsByIdKey(t.getKey(null), id, name);
  }
  propsByIdKey(key: string, id: string, _name: ?string = null) {
    const name = _name || 'data';

    const desc = this.descByIdKey(key, id);
    if (!desc) return {};

    return {
      [name]: desc.value,
      [`${name}Error`]: desc.error,
      [`${name}HasError`]: desc.hasError,
      [`${name}Loading`]: desc.loading,
      [`${name}Meta`]: desc.userMeta || {},
    };
  }

  /*
    Get the default list. Always returns an array, but it may be empty
  */
  list() {
    return this.listKey(t.getKey(null));
  }
  listKey(key: string) {
    const obj = this._assertHr(`list`);
    return obj.lists[key] && obj.lists[key].value || [];
  }

  /*
    Get props for the list state. See the propsById docs for an example
    of how this works.
  */
  propsFromList(name: ?string = null) {
    return this.propsFromListKey(t.getKey(null), name);
  }
  propsFromListKey(key: string, _name: ?string = null) {
    const name = _name || 'data';

    const desc = this.descListKey(key);
    if (!desc) return {};

    return {
      [name]: desc.value,
      [`${name}Error`]: desc.error,
      [`${name}HasError`]: desc.hasError,
      [`${name}Loading`]: desc.loading,
      [`${name}Meta`]: desc.userMeta || {},
    };
  }

  /*
    Get the state descriptor for the given id. Mostly for internal use.
  */
  descById(id: string) {
    return this.descByIdKey(t.getKey(null), id);
  }
  descByIdKey(key: string, id: string) {
    const obj = this._assertHr(`descByIdKey`);
    const desc = obj.byId[key][id];
    return desc || null;
  }

  /*
    Get the state descriptor for the list. Mostly for internal use.
  */
  descList() {
    return this.descListKey(t.getKey(null));
  }
  descListKey(key: string) {
    const obj = this._assertHr(`descListKey`);
    const desc = obj.lists[key];
    return desc || null;
  }

  /*
    Get the state descriptor for the given key/value pair. Mostly for internal use.
  */
  descKv(id: string) {
    return this.descKvKey(t.getKey(null), id);
  }
  descKvKey(key: string, id: string) {
    const obj = this._assertHr(`descByIdKey`);
    const desc = obj.kv[key][id];
    return desc || null;
  }

  /*
    Asserts that we have an HR state object. For internal use.
  */
  _assertHr(method: string, obj: Object = this.st): t.HrState {
    if (!obj.isHrState) {
      throw new Error(`HrQuery::${method} requires a high-redux state object but got {${Object.keys(obj).join(', ')}}`);
    }
    return obj;
  }
}
