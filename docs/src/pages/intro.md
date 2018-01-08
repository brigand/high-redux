---
title: "Intro"
lesson: 1
chapter: 1
cover: "https://unsplash.it/400/300/?random?BoldMage"
date: "01/01/2017"
category: "overview"
type: "lesson"
slug: 'intro'
tags:
    - programming
    - react
    - high-redux
---

## What is High Redux?

high-redux is a set of two primary abstractions for improving your react/redux app.
You can use either part on their own, or for best results, use them together.
You **don't** need to rewrite your existing code. It's fully compatible with
existing redux code, any redux middleware, `connect()`, `<Provider>`, etc.

## Install

You can install it with `npm` or `yarn`.

```sh
npm install --save high-redux
yarn add high-redux
```

You must also install `react`, `redux`, and `react-redux`, which you likely
already have. We'll use the version you've installed to avoid duplicate code
in the bundle.

## makeHr

The first abstraction is [`makeHr`](/makeHr) which creates an entity. This includes a reducer
and selectors for that reducer. Unlike reducers you might write by hand, we generate
a highly flexible and future-proof state shape, while allowing you to ignore that
in the basic cases of retrieving a value by id or similar.

The state shape we use allows loading states, error states, and custom metadata
for each item the reducer manages. This also applies to lists, and key/value
data. We use the concept of a 'default key' and 'named keys', which work similarly
to ES6 modules.

This is a very basic example where we supposedly get a user object from an api. We're
not specifying a key, so the 'default key' is used. In the future, we might need
another key-space for secondary information. You never run into a case where
you have to refactor the code using your reducer state when you need to track extra
information.

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

For more information, see the [`makeHr`](/makeHr) documentation.

## withProps

The second abstraction is [`withProps`](/withProps) which is a wrapper around `react-redux`'s `connect`.

```javascript
const UserDisplay = (props) => (
  <div>
    {props.data && <div>Hi, {props.data.name}</div>}
  </div>
);

export default withProps()
  // When props.id changes, dispatch { type: 'FETCH_USER', payload: { userId: ownProps.id } }
  .watchAndDispatch('FETCH_USER', { userId: 'id' })

  // Create the prop 'data' from `userHr`s state for the id we have in props
  .select('data', (s, props) => s.cars.byId(props.id))

  // Generate our connect() and watchAndDispatch wrappers, and return the resulting
  // component.
  .wrap(UserDisplay);
```

The above shows a very common case that would otherwise be very noisy: requiring
a class component implementing `componentDidMount` and `componentWillReceiveProps`
(where you further have to diff props), the propTypes for the `FETCH_USER` action,
5 lines for `mapStateToProps`, and at least 3 lines for `mapDispatchToProps`.

From a technical perspective, with `watchAndDispatch` we avoid rendering in the
state before `watchAndDispatch` dispatches the `FETCH_USER` which might set a
loading state or clear out the old data since it runs before `mapStateToProps`.
This can be a significant performance boost.

The `.select` function has extra potential which will be explained in the `withProps`
and `HrQuery` docs.

For more information, see the [`withProps`](/withProps) documentation.
