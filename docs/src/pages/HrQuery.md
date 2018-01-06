---
title: "HrQuery"
lesson: 5
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/01/2017"
category: "docs"
type: "lesson"
slug: 'hrQuery'
tags:
    - programming
    - react
    - high-redux
---

## Basics

You get `HrQuery` instances inside the `.select` functions of `withProps`. You
can construct them by passing the result of a high-redux reducer, or the object
`HrStateWrapper::getState` returns.

## Methods

<!-- BEGIN_GENERATED CLASS HrQuery -->

### `HrQuery::constructor`

Signature: `new HrQuery(stateTree: t.HrState, path: ?HrQueryPath)`

Create an HrQuery for an object implementing the `HrState` interface. Omit the second argument.



### `HrQuery::key`

Signature: `.key(key: string)`

Scope the query to a specific key.

```javascript
// in a reducer
s.key('some-key').setId('some-id', someValue)

// then later query it
q.key('some-key').id('some-id') // returns `someValue`
```



### `HrQuery::id`

Signature: `.id(id: string)`

Get the value with the specified id, or null if it doesn't exist.

```javascript
q.id('foo')
```



### `HrQuery::idProps`

Signature: `.idProps(id: string, name: string = 'data')`

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



### `HrQuery::list`

Signature: `.list()`

Get the list for the current key. Always returns an array, but it may be empty



### `HrQuery::listProps`

Signature: `.listProps(name: string = 'items')`

Get the descriptor for
listDesc() {
  const key = t.getKey(this.path.key);
  const desc = this.st.lists[key];
  return desc || null;
}

/*
  Get props for the list state. See the `q.idProps` docs for an example
  of how this works.



### `HrQuery::kv`

Signature: `.kv(key: string)`

Gets the value for the key/value pair

```javascript
q.kv('some-key') // => someValue
```



### `HrQuery::kvProps`

Signature: `.kvProps(key: string, name: ?string = null)`

Get props for the key/value pair. See the `idProps` docs.

An exception here is that if you don't specify a name, and the first argument
is a valid identifier, we'll use that as the prefix.

If you don't specify a second argument, and the first argument isn't a valid
identifier, this function will throw. This addresses a common case where
you have hard-coded key names in your key/value pair.



### `HrQuery::idDesc`

Signature: `.idDesc(id: string)`

Mostly for internal use.

Gets the `HrStateDesc` object for the specified id, or null.



### `HrQuery::listDesc`

Signature: `.listDesc()`

Mostly for internal use.

Gets the `HrStateDesc` object for the current list, or null.



### `HrQuery::kvDesc`

Signature: `.kvDesc(id: string)`

Mostly for internal use.

Gets the `HrStateDesc` object for the specified key in the key/value pair.

<!-- END_GENERATED -->

## Summary
