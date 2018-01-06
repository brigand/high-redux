---
title: "HrState"
lesson: 5
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/01/2017"
category: "docs"
type: "lesson"
slug: 'hrState'
generatedFrom: 'types'
tags:
    - programming
    - react
    - high-redux
---

## Basics

HrState is the internal data shape for your high-redux reducers. Normally you
don't interact with it directly, but instead go through the the [HrQuery](/high-redux-docs/hr-query)
interface. Documenting it here might help you understand how high-redux works.

We'll start with the formal type definition, and then go into examples. Note that
this describes an interface (a defined type of JS primitives), not a `class`. It's
typically wrapped in an `HrStateWrapper` class instance to allow updates, or
an `HrQuery` class instance to query it for data.

## Type

If you're unfamiliar with type annotation syntax, don't worry about it. The examples
should give you a better idea of how it looks. The full structure of the state:

<!-- BEGIN_GENERATED TYPE HrState -->

```javascript
export type HrState = {
  isHrState: true,
  byId: HrStateById,
  lists: HrStateList,
  kv: HrStateKv,
  // TODO: implement this in some way
  // receipts: { [key: string]: any },
}
```

<!-- END_GENERATED TYPE -->

<!-- BEGIN_GENERATED TYPE HrStateById -->

```javascript
type HrStateById = { [type: string]: { [id: string]: HrStateDesc<any> } };
```

<!-- END_GENERATED TYPE -->

<!-- BEGIN_GENERATED TYPE HrStateList -->

```javascript
type HrStateList = { [type: string]: HrStateDesc<Array<any>> };
```

<!-- END_GENERATED TYPE -->

<!-- BEGIN_GENERATED TYPE HrStateKv -->

```javascript
type HrStateKv = { [type: string]: { [id: string]: HrStateDesc<any> } };
```

<!-- END_GENERATED TYPE -->

You may notice the `HrStateDesc` types. They're a consistent interface to describing
a record in state. While in classic redux you often store data without any metadata,
having this available by default ensures you can track things like loading and error
states as your code evolves.

There's also the 'etc' property, where you can put any custom data you want.

<!-- BEGIN_GENERATED TYPE HrStateDesc -->

```javascript
export type HrStateDesc<T> = {
  loading: boolean,
  hasError: boolean,
  error: ?any,
  value: T,
  loadingStartTime: number,
  loadingCompleteTime: number,
  etc: Object,
}
```

<!-- END_GENERATED TYPE HrStateDesc -->


## Examples

First, let's look at what a blank state looks like. We simply return the
`HrStateWrapper` without making any changes.

```javascript
const { reducer } = hr.makeHr({
  name: 'example',
  actions: {
    TEST: s => s,
  },
});

const state = runReducer(reducer, { type: 'TEST' });

print(state);
```

<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->

```javascript
{
  "isHrState": true,
  "byId": {},
  "lists": {},
  "kv": {}
}
```

<!-- END_GENERATED FROM_CODE_ABOVE -->

Now it gets a little more interesting. We're setting an item by id using the
default key, which is the same as `s.key('[[default]]').id(...`.

```javascript
const { reducer } = hr.makeHr({
  name: 'example',
  actions: {
    SET_ID: (s, payload) => (
      s.id(payload.id).set(payload.data)
    ),
  },
});

const state = runReducer(reducer, {
  type: 'SET_ID',
  payload: { id: '123', data: { name: 'John' } },
});

print(state);
```

<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->

```javascript
{
  "isHrState": true,
  "byId": {
    "[[default]]": {
      "123": {
        "loading": false,
        "hasError": false,
        "error": null,
        "value": {
          "name": "John"
        },
        "loadingStartTime": 0,
        "loadingCompleteTime": 1515228631128,
        "etc": {}
      }
    }
  },
  "lists": {},
  "kv": {}
}
```

<!-- END_GENERATED FROM_CODE_ABOVE -->

We could set some metadata with object. In this case, we set the loading state,
and it also captures `loadingStartTime` for us.

```javascript
const { reducer } = hr.makeHr({
  name: 'example',
  actions: {
    FETCH_USER_START: (s, payload) => (
      s.id(payload.id).setLoading()
    ),
  },
});

const state = runReducer(reducer, {
  type: 'FETCH_USER_START',
  payload: { id: '123' },
});

print(state);
```

<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->

```javascript
{
  "isHrState": true,
  "byId": {
    "[[default]]": {
      "123": {
        "loading": true,
        "hasError": false,
        "error": null,
        "value": null,
        "loadingStartTime": 1515228631131,
        "loadingCompleteTime": 0,
        "etc": {}
      }
    }
  },
  "lists": {},
  "kv": {}
}
```

<!-- END_GENERATED FROM_CODE_ABOVE -->

The key/value store works identically to the `id` store, but `list` is somewhat
different. Instead of each item having its own descriptor, the entire list
has one descriptor.

```javascript
const { reducer } = hr.makeHr({
  name: 'example',
  actions: {
    FETCH_LETTERS_SUCCESS: (s, payload) => (
      s.list().set(payload)
    ),
  },
});

const state = runReducer(reducer, {
  type: 'FETCH_LETTERS_SUCCESS',
  payload: ['a', 'b', 'c'],
});

print(state);
```

<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->

```javascript
{
  "isHrState": true,
  "byId": {},
  "lists": {
    "[[default]]": {
      "loading": false,
      "hasError": false,
      "error": null,
      "value": [
        "a",
        "b",
        "c"
      ],
      "loadingStartTime": 0,
      "loadingCompleteTime": 1515228631132,
      "etc": {}
    }
  },
  "kv": {}
}
```

<!-- END_GENERATED FROM_CODE_ABOVE -->

For all of the types, you can also set a custom key.

```javascript
const { reducer } = hr.makeHr({
  name: 'example',
  actions: {
    FETCH_LETTERS_SUCCESS: (s, payload) => (
      s.key('my-key').list().set(payload)
    ),
  },
});

const state = runReducer(reducer, {
  type: 'FETCH_LETTERS_SUCCESS',
  payload: ['a', 'b', 'c'],
});

print(state);
```

<!-- BEGIN_GENERATED FROM_CODE_ABOVE -->

```javascript
{
  "isHrState": true,
  "byId": {},
  "lists": {
    "my-key": {
      "loading": false,
      "hasError": false,
      "error": null,
      "value": [
        "a",
        "b",
        "c"
      ],
      "loadingStartTime": 0,
      "loadingCompleteTime": 1515228631133,
      "etc": {}
    }
  },
  "kv": {}
}
```

<!-- END_GENERATED FROM_CODE_ABOVE -->


We could go into many more examples, but this should give you the general idea.

## Summary

The `HrState` type is a future-proof interface to managing redux state. It makes
few assumptions about how you want to use it.
