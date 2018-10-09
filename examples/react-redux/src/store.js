import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux'
import { router } from '@k-redux-router/core'

// eslint-disable-next-line no-underscore-dangle, no-undef
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const routes = {
  '/': {
    code: 'first',
    public: true,
    '/:id/second': {
      code: 'second',
    },
    '/third': {
      code: 'third',
      public: false,
    },
  },
}

const { init, middleware } = router(routes, { getState: state => state.ui.router })

const store = createStore(
  combineReducers({
    ui: combineReducers({
      router: router.reducer,
    }),
  }),
  undefined,
  composeEnhancers(applyMiddleware(middleware)),
)

store.dispatch(init())

export default store
