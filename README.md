# k-redux-router

> redux router (with bindings) / one route = one code

[![CircleCI](https://circleci.com/gh/alakarteio/k-redux-router.svg?style=shield)](https://circleci.com/gh/alakarteio/k-redux-router) [![Coverage Status](https://coveralls.io/repos/github/alakarteio/k-redux-router/badge.svg?branch=master)](https://coveralls.io/github/alakarteio/k-redux-router?branch=master) [![NPM Version](https://badge.fury.io/js/%40k-redux-router%2Fcore.svg)](https://www.npmjs.com/package/@k-redux-router/core) [![Greenkeeper badge](https://badges.greenkeeper.io/alakarteio/k-redux-router.svg)](https://greenkeeper.io/)

## contents
 - [purpose](#purpose)
 - [why](#why)
 - [influences](#influences)
 - [installation](#install)
 - [API](#api)
   * [core](#core)
      - [definition](#routes-definitions)
      - [redux actions](#actions)
      - [redux selectors](#selectors)
      - [create your store](#create-your-store)
   * [bindings](#bindings)
      - [connect a component to a route](#connect-a-component-to-a-route)
      - [create links](#create-links)

## purpose
The main purpose of the lib is to have a full redux driven history API router that is fast and easy to use.

That's why we identify route by unique `code`, and use this codes internally.

## why
The lib was created to simplify our routes usages. This is done by matching an unique `code` to a route (we never identify a route with its `href`).

This lib allows us, via bindings, to use `path` params and `query` params, and `context` informations on top of that.
`context` informations are the data you are putting in route definitions, like "is this route public?"

So this lib aims to simplify the maintenance of your routes:
 - We use unique route `code` to identify routes, meaning that if you change related `href` your code is not impacted
 - We describe routes as nested components
 - We allow to put `context` informations into routes definition
 - `context` informations are copied from parent to children and can be overwritten, meaning that you can put a `isPublic: false` flag on a parent (and only on a parent), and all your children will have this `isPublic: false` set.

## influences
This lib is mostly influenced by [redux-little-router](https://github.com/FormidableLabs/redux-little-router) and our first hoc [hoc-little-router](https://github.com/alakarteio/hoc-little-router).

## sizes
| packages | size | gziped |
| -- | -- | -- |
| `@k-redux-router/core` | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/core/dist/index.es.js.svg) | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/core/dist/index.es.js.svg?compression=gzip) |
| `@k-redux-router/react-redux` | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/components/react/redux/dist/index.es.js.svg) | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/components/react/redux/dist/index.es.js.svg?compression=gzip) |
| `@k-redux-router/react-k-ramel` | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/components/react/k-ramel/dist/index.es.js.svg) | ![Size](http://img.badgesize.io/alakarteio/k-redux-router/master/components/react/k-ramel/dist/index.es.js.svg?compression=gzip) |

## install
### redux reducer, middleware, actions and selectors
`yarn add @k-redux-router/core path-to-regexp`

### binding to ReactJS (there is no other binder at the moment)
 - with **react-redux**: `yarn add @k-redux-router/react-redux`
 - with **k-ramel**: `yarn add @k-redux-router/react-k-ramel`

## API
### core
#### routes definitions
```js
// you define your routes in a plain object

export default {
  '/': { // url are keys of your route
    code: 'main', // your routes are defined by a code, this is **required**
    public: true, // you can add custom properties
    '/login': { // url is `/login`
      code: 'login',
      // all the properties from parent route are copied into children
      // so /login is public: true :)
    },
    '/users': { // url is `/users`
      code: 'users',
      public: false, // you can override parent properties
      '/:id': { // url is `/users/:id`
        code: 'user',
        // public is false since parent defined it to false
        '/socials': { // url is `/users/:id/socials`
          code: 'user-socials', // code are UNIQUES !!
        }
      }
    }
  }
}
```

#### actions
```js
import { actions } from '@k-redux-router/core'

// dispatch a `@@router/PUSH` with
// - the route code (user here)
// - paths params that are named (id === 2 here)
// - eventually query params (as an object)
actions.push('user', { id: '2' })

// dispatch a `@@router/REPLACE` with
// - the route code (user here)
// - paths params that are named (id === 2 here)
// - eventually query params (as an object)
actions.replace('user', { id: '2' })

// dispatch a `@@router/GO_BACK` with
// - eventually the number of steps (1 is default)
actions.goBack()

// dispatch a `@@router/GO_FORWARD` with
// - eventually the number of steps (1 is default)
actions.goForward()
```

#### selectors
```js
import { selectors } from '@k-redux-router/core'

// by default selectors() will look at `state.ui.router`
// you can change where the routes are located (where the reducer is binded), giving a callback
// in this example the router is located to `state.path.to.router`
const decoratedSelectors = selectors(state => state.path.to.router)

// state could be
// - retrieved from `getState` of redux-thunk
// - retrieved from `state` of react-redux
// - injected by `select` of redux-sagas
// - etc
// here this is a mock up
const state = {
  path: {
    to: {
      router: { /* mock up to illustrate */ }
    }
  }
}

// get the route defined by the code `user`
decoratedSelectors.getRoute('user')(state)

// get the result
decoratedSelectors.getResult(state)

// the current route code
decoratedSelectors.getCurrentCode(state)

// the current route
decoratedSelectors.getCurrentRoute(state)

// is the route found? (404 or not)
decoratedSelectors.isFound(state)

// get query and path params
decoratedSelectors.getParams(state)

// get all the path params
decoratedSelectors.getPathParams(state)

// get all the query params
decoratedSelectors.getQueryParams(state)

// get ONE path param by its name
decoratedSelectors.getPathParam('id')(state)

// get ONE query param by its name
decoratedSelectors.getQueryParam('token')(state)

// get ONE param (either result param, path param or query param)
// - if the result param exists, this is returned first
// - then if the state param exists this is returned second
// - query param comes at last
decoratedSelectors.getParam('id')(state)

```

#### create your store
**with pure redux**
```js
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createRouter from '@k-redux-router/core'
import routes from './routes' // your routes defined previously

// if you want redux-devtools ;-)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

// create the router
// - by default the path is `state.ui.router`
// - here we override it to `state.path.to.router`
const router = createRouter(routes, { getState: state => state.path.to.router })

// create the redux store
const store = createStore(
  combineReducers({
    path: combineReducers({
      to: combineReducer({
        // 1. bind the reducer where you want
        // here this is in to `state.path.to.router`
        router: router.reducer,
      }),
    }),
  }),
  undefined,
  // 2. add the middleware
  composeEnhancers(applyMiddleware(router.middleware)),
)

// 3. init the router
// this one is used to init the current route by reading your URL
store.dispatch(router.init())

export default store
```

**with k-ramel**
```js
import { createStore } from 'k-ramel'
import { router } from '@k-redux-router/react-k-ramel'
import routes from './routes' // your routes defined previously

// create the redux store
export default createStore(
  {
    ui: {},
  },
  {
    drivers: {
      // 1. add the driver (its name should be 'router')
      router: router({
        routes, // 2. bind your routes
        state: 'path.to.router' // 3. the path to the state (default is `ui.router`)
        getState: state => state.path.to.router // 4. accessor to the state (default is `ui.router`)
      }),
    },
  },
)
```

### bindings
At that time we only have binding for `ReactJS` but feel free to add more if needed :)
You can use this library with either [k-ramel](https://github.com/alakarteio/k-ramel) or a raw [redux](https://github.com/reduxjs/redux) application (with [react-redux](https://github.com/reduxjs/react-redux)).
The API is quite the same, the import will change:
 - **k-ramel**: `import { forRoute } from '@k-redux-router/react-k-ramel'`
 - **react-redux**: `import { forRoute } from '@k-redux-router/react-redux'`

#### connect a component to a route
```jsx
import { forRoute } from '@k-redux-router/react-k-ramel'
// or import { forRoute } from '@k-redux-router/react-redux'

// this is the wrapped component (to print _or not_ based on route)
import Component from './Component'

// this will print `Component` when the route identified by the `main` code is found
// -> if you are in a `second` route that is a child of `main`
//    then Component will *NOT* be printed here
export default forRoute.absolute('main')(Component)

// this will print `Component` when the route identified by the `main` code is found
// in the tree
// -> if you are in a `second` route that is a child of `main`
//    then Component *WILL* be printed here
export default forRoute('main')(Component)

// You can use simple route codes (single string) or an array in all the previous hoc
// Here we will print component if either `second` or `third` route is found
export default forRoute.absolute(['second', 'third'])(Component)

// this will print `Component` when no routes are found (you can handle client 404 here)
export default forRoute.notFound()(Component)

// if you don't use the default reducer location (ui.router), you can override it here (react-redux)
export default forRoute('main', { getState: state => state.custom.location })(Component)
```

### create links
```jsx
import { Link } from '@k-redux-router/react-k-ramel'
// or import { Link } from '@k-redux-router/react-redux'

export default () => (
  <div>
      {/* link to the `second` route */}
      <Link
        code="second"
      >
        click here
      </Link>

      {/* link to the `user` route passing its `id` in path params */}
      <Link
        code="user"
        id={3}
      >
        user detail
      </Link>

      {/* link to the `search` route passing query params */}
      <Link
        code="search"
        query={{ max: 3, name: 'Jean' }}
      >
        search users that are named 'Jean'
      </Link>
  </div>
)

```

# About ![alakarteio](http://alakarte.io/assets/img/logo.markdown.png)
**alakarteio** is created by two passionate french developers.

Do you want to contact them? Go to their [website](http://alakarte.io)

<table border="0">
 <tr>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/26094222?s=460&v=4" width="100" /></td>
  <td align="center"><img src="https://avatars1.githubusercontent.com/u/17828231?s=460&v=4" width="100" /></td>
 </tr>
 <tr>
  <td align="center"><a href="https://github.com/guillaumecrespel">Guillaume CRESPEL</a></td>
  <td align="center"><a href="https://github.com/fabienjuif">Fabien JUIF</a></td>
</table>
