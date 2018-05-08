import { keyValue } from 'k-redux-factory'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { middleware, reducer } from '@k-redux-router/core'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const routes = {
  '/': {
    code: 'main',
    '/login': { code: 'login' },
    '/profile': { code: 'profile' },
    '/search': { code: 'search' },
    '/projects': {
      code: 'projects',
      public: true,
      '/:id': {
        code: 'project',
        '/setup': { code: 'setup' },
        '/summary': { code: 'summary', public: undefined },
        '/measures': { code: 'measures', public: false },
        '/symptoms': { code: 'symptoms' },
        '/diagnostics': { code: 'diagnostics' },
      },
    },
  },
}

export default createStore(
  combineReducers({
    dummy: () => true,
    otherReducer: keyValue({ name: 'otherReducer', key: 'id' }),
    ui: combineReducers({
      router: reducer(routes),
    })
  }),
  undefined,
  composeEnhancers(
    applyMiddleware(middleware),
  ),
)
