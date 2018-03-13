// @flow
'use strict';
import * as t from './types';
import { makeHrStateDesc } from './HrStateWrapper';

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
    Create an HrQuery for an object implementing the `HrState` interface. Omit the second argument.
  */
  constructor(stateTree: t.HrState, path: ?HrQueryPath) {
    this.st = stateTree
    this.path = path || makePath();
  }


  /*
    Scope the query to a specific key.

    ```javascript
    // in a reducer
    s.key('some-key').id('some-id').set(someValue)

    // then later query it
    q.key('some-key').id('some-id') // returns `someValue`
    ```
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

    ```javascript
    q.id('foo')
    ```
  */
  id(id: string) {
    const desc = this.idDesc(id);
    return desc ? desc.value : null;
  }

  /*
    Get a record by id, and return an object with a set of props that can be
    passed to a React component or similar.

    For example, var p = q.idProps(someId); p.data is the data, and p.dataLoading
    is the loading boolean.

    A name can be specified, which will be the prefix of the prop names.

    ```javascript
    q.idProps('some-user-id')

    // gives:
    {
      data: { first: 'John', last: 'Smith' },
      dataHasError: false,
      dataError: null,
      dataLoading: false,
      dataEtc: { myCustomMetadata: true },
    }

    q.idProps('some-user-id', 'foo')

    // gives:
    {
      foo: { first: 'John', last: 'Smith' },
      fooHasError: false,
      // ...
    }
    ```
  */
  idProps(id: string, name: string = 'data') {
    let desc = this.idDesc(id);

    if (!desc) desc = makeHrStateDesc(null);

    const props = {
      [name]: desc.value,
      [`${name}Error`]: desc.error,
      [`${name}HasError`]: desc.hasError,
      [`${name}Loading`]: desc.loading,
      [`${name}Etc`]: desc.etc || {},
    };

    return props;
  }

  /*
    Get the mapping of ids to `HrStateDesc` objects. Unfortunately required
    for cached selectors going from lists of ids to lists of values.
  */
  idsDescs() {
    return this.st.byId[t.getKey(this.path.key)] || {};
  }

  /*
    Get the list for the current key. Always returns an array, but it may be empty
  */
  list() {
    const desc = this.listDesc();

    if (!desc) return [];

    return desc.value;
  }

  /*
    Get props for the list state. See the `q.idProps` docs for an example
    of how this works.
  */
  listProps(name: string = 'items') {
    let desc = this.listDesc();

    if (!desc) desc = makeHrStateDesc([]);

    const props = {
      [name]: desc.value || [],
      [`${name}Error`]: desc.error || null,
      [`${name}HasError`]: desc.hasError || false,
      [`${name}Loading`]: desc.loading || false,
      [`${name}Etc`]: desc.etc || {},
    };

    return props;
  }

  /*
    Gets the value for the key/value pair

    ```javascript
    q.kv('some-key') // => someValue
    ```
  */
  kv(key: string) {
    const desc = this.kvDesc(key);
    if (!desc) return null;

    return desc.value;
  }

  /*
    Get props for the key/value pair. See the `idProps` docs.

    An exception here is that if you don't specify a name, and the first argument
    is a valid identifier, we'll use that as the prefix.

    If you don't specify a second argument, and the first argument isn't a valid
    identifier, this function will throw. This addresses a common case where
    you have hard-coded key names in your key/value pair.
  */
  kvProps(key: string, name: ?string = null) {
    let finalName = name;
    if (!finalName) {
      if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(key)) {
        finalName = key;
      } else {
        throw new Error(`HrQuery::kvProps expected either the second argument to be provided, or for the first argument to be a valid identifier.`);
      }
    }
    let desc = this.kvDesc(key);

    if (!desc) desc = makeHrStateDesc(null);

    const props = {
      [finalName]: desc.value,
      [`${finalName}Error`]: desc.error,
      [`${finalName}HasError`]: desc.hasError,
      [`${finalName}Loading`]: desc.loading,
      [`${finalName}Etc`]: desc.etc || {},
    };

    return props;
  }

  /*
    Mostly for internal use.

    Gets the `HrStateDesc` object for the specified id, or null.
  */
  idDesc(id: string) {
    const forKey = this.st.byId[t.getKey(this.path.key)];
    if (!forKey) return null;

    const desc = forKey[id];
    return desc || null;
  }

  /*
    Mostly for internal use.

    Gets the `HrStateDesc` object for the current list, or null.
  */
  listDesc() {
    const desc = this.st.lists[t.getKey(this.path.key)];
    return desc || null;
  }

  /*
    Mostly for internal use.

    Gets the `HrStateDesc` object for the specified key in the key/value pair.
  */
  kvDesc(id: string) {
    const forKey = this.st.kv[t.getKey(this.path.key)];
    if (!forKey) return null;

    const desc = forKey[id];
    return desc || null;
  }
}
