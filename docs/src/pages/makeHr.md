---
title: "makeHr"
lesson: 2
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/01/2017"
category: "docs"
type: "lesson"
slug: 'makeHr'
tags:
    - programming
    - react
    - high-redux
---

## Basics

`makeHr` replaces the classic reducer function with a high reducer. There are
10s of libraries that change the way you define reducers. The ones I've looked
at are simple syntax sugar. In high-redux, we provide a reducer abstraction
that's designed to handle changes to your code over time, while not producing
a lot of extra complexity in the reducer definition, nor extra code in your
components/selectors for accessing the state in simple cases.

Let's start with the basic example found on the intro page:

```javascript
const userHr = makeHr({
  name: 'user',
  actions: {
    FETCH_USER_SUCCESS: (s, payload) => (
      s.setId(payload.id, payload.data)
    ),
  },
});
```

First we have the name. By defining where our reducer will be mounted onto the
redux store state, we can know how to query it by looking at just this file,
and we can implement state selectors in the same file (more on that later).

## Top Level

The top level properties of the object you pass to `makeHr` are `'name'`, `'actions'`,
and `'selectors'`. We covered `'name'` above, so let's go into 'actions'.

## Actions

Each property of the `'actions'` object is the type of an action. In this example,
we have `'FETCH_USER_SUCCESS'`. You can define as many actions as you like.

Your action handlers receive three arguments. `s` is an
[`HrStateWrapper`](/HrStateWrapper) instance. You use it to modify the previous
state, producing a new state that the reducer will return.

The second argument, `'payload'`, is simply the action's `'payload'` property,
exposed here for convenience.

The third argument is the original, unmodified action. For the bulk of the work here,
see the [`HrStateWrapper`](/HrStateWrapper) documentation.

## Selectors

This is a WIP. Will be documented when the api stabilizes.

## Summary

`makeHr` is a powerful abstraction for defining potentially complex states in
your app.
