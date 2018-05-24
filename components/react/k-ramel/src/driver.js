import { router, selectors, actions } from '@k-redux-router/core'
import { applyMiddleware } from 'k-ramel'

export default (options = {}) => {
  const {
    routes,
    path = 'ui.router',
    getState = state => state.ui.router,
  } = options

  const { middleware, reducer, init } = router(routes, { getState })

  return {
    getDriver: store => ({
      // actions
      ...Object
        .entries(actions)
        .reduce(
          (acc, [key, action]) => ({
            ...acc,
            [key]: (...args) => store.dispatch(action(...args)),
          }),
          {},
        ),
      // selectors
      ...Object.entries(selectors(getState))
        .reduce(
          (acc, [key, selector]) => {
            let fn = () => selector(store.getState())
            if (['getRoute', 'getPathParam', 'getQueryParam', 'getParam'].includes(key)) {
              fn = (...args) => selector(...args)(store.getState())
            }

            return ({
              ...acc,
              [key]: fn,
            })
          },
          {},
        ),
    }),
    getReducer: () => ({ path, reducer }),
    getEnhancer: () => applyMiddleware(middleware),
    init: (store) => { store.dispatch(init()) },
  }
}
