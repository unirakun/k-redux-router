# k-redux-router

:construction: this is a WIP

# TODO: summary
# TODO: bindings doc

## install
### redux reducer, middleware, actions and selectors
`yarn add @k-redux-router/core`

### binding to ReactJS (there is no other binder at the moment)
 - with **react-redux**: `yarn add @k-redux-router/react-redux`
 - with **k-ramel**: `yarn add @k-redux-router/react-kramel`

## API
### routes definitions
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
          code: 'user-socials', // code are UNIQ !!
        }
      }
    }
  }
}
```

### actions
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

### selectors
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

// get the route definied by the code `user`
decoratedSelectors.getRoute('user')(state)

// get the result, you can retrieve from here:
// - the current route
// - the paths params
// - the query params
// - your custom parameters
decoratedSelectors.getResult(state)

// the current route code
decoratedSelectors.getCurrentCode(state)

// the current route
decoratedSelectors.getCurrentRoute(state)

// is the route found ? (404 or not)
decoratedSelectors.isFound(state)

// get query and path params
decoratedSelectors.getParams(state)

// get all the path params
decoratedSelectors.getPathParams(state)

// get all the query params
decoratedSelectors.getQueryParams(state)

// get ONE path params by its name
decoratedSelectors.getPathParam('id')(state)

// get ONE query params by its name
decoratedSelectors.getQueryParam('token')(state)

// get ONE parm (either path param or query param)
// - if the state param exist this is returned first
decoratedSelectors.getParam('id')(state)

```

### create your store
**With pure redux**
```js
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import createRouter from '@k-redux-router/core'
import routes from './routes' // you previous defined routes

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
import { router } from '@k-redux-router/react-kramel'
import routes from './routes' // you previous defined routes

// create the redux store
export default createStore(
  {
    ui: {},
  },
  {
    drivers: {
      // 1. add the driver (its name should be router)
      router: router({
        routes, // 2. bind your routes
        state: 'path.to.router' // 3. the path to the state (default is `ui.router`)
        getState: state => state.path.to.router // 4. accessor to the state (default is `ui.router`)
      }),
    },
  },
)
```
