---
title: "HrStateWrapper"
lesson: 4
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/01/2017"
category: "docs"
type: "lesson"
slug: 'hrStateWrapper'
tags:
    - programming
    - react
    - high-redux
---

## Basics

You get `HrStateWrapper` instances inside the action handlers in [`makeHr`](/makeHr).

The wrapper allows you to perform efficient, high level updates to the state object without
mutation.

## Methods

<!-- BEGIN_GENERATED CLASS HrStateWrapper -->

### `HrStateWrapper::constructor`

Signature: `new HrStateWrapper(path: StatePath)`

Creates a HrStateWrapper instance. This is typically done for you.



### `HrStateWrapper::invoke`

Signature: `.invoke(fn: (s: HrStateWrapper) => mixed)`

Utility for running a function without breaking the chain. Receives the
`HrStateWrapper` as an argument.



### `HrStateWrapper::id`

Signature: `.id(id: string)`

Returns a state wrapper for the specified `id`. You can then call methods
like `.set` on it.

```javascript
s.id('some-id').set('some-value')
```



### `HrStateWrapper::list`

Signature: `.list()`

Returns a state wrapper for the list.

```javascript
s.list().set(['a', 'b'])
```



### `HrStateWrapper::kv`

Signature: `.kv(kvKey: string)`

Returns a state wrapper for the specified key in the key/value pair.

```javascript
s.kv('some-key').set('some-value')
```



### `HrStateWrapper::key`

Signature: `.key(key: string)`

Returns a state wrapper for the specified sub-key.

```javascript
s.key('some-key').id('some-id').set('foo')
```



### `HrStateWrapper::queryRoot`

Signature: `.queryRoot()`

Get an `HrQuery` object for the state.



### `HrStateWrapper::query`

Signature: `.query()`



### `HrStateWrapper::set`

Signature: `.set(value: any)`

Sets the currently focused item. See the examples for `id`/`list`/`kv`



### `HrStateWrapper::setIds`

Signature: `.setIds(pairs: Array<[string, any]>)`

For each item in `pairs`, map the first item in the pair (the id) to the
second item (the value).

Often you'll generate this with an `array.map` call.

```javascript
s.setIdPairs(items.map(x => [x.id, x]))
s.key('some-key').setIdPairs(items.map(x => [x.id, x]))
```



### `HrStateWrapper::update`

Signature: `.update(updater: Function)`

Update an item with the given id by passing it to the 'updater' function.



### `HrStateWrapper::setLoading`

Signature: `.setLoading()`

Set the focused item to a loading state. Also captures the loading state.

```javascript
s.id('some-id').setLoading()
```



### `HrStateWrapper::setLoadingDone`

Signature: `.setLoadingDone()`

Set the focused item to a completed loading state.

```javascript
s.id('some-id').setLoadingDone()
```



### `HrStateWrapper::setError`

Signature: `.setError(error: ?any)`

Set the focused item to an error state. Pass `null` to clear the error state.

```javascript
s.id('some-id').setError({ message: 'Oops' })
```



### `HrStateWrapper::setMeta`

Signature: `.setMeta(metaKey: string, metaValue: any)`

Set custom metadata for the current item.

```javascript
s.id('some-id').setMeta('isNew', true)
```



### `HrStateWrapper::getState`

Signature: `.getState()`

Compute the state by applying all update operations. Mostly for internal use.



### `HrStateWrapper::root`

Signature: `.root()`

Get the root `HrStateWrapper` instance.



### `HrStateWrapper::_pushOp`

Signature: `._pushOp(op: OpType, data: any, overrides: $Shape<HrStateWrapperOp> = {})`

Internal: adds an operation to the queue

<!-- END_GENERATED -->

## Summary
