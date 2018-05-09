import { keyValue } from 'k-redux-factory'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { reducer } from '@k-redux-router/core'

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

const router = reducer(routes, { getState: state => state.ui.router })

const store = createStore(
  combineReducers({
    dummy: () => true,
    otherReducer: keyValue({ name: 'otherReducer', key: 'id' }),
    ui: combineReducers({
      router,
    })
  }),
  undefined,
  composeEnhancers(),
)

window.debug_router = router
window.debug_store = store

export default store
