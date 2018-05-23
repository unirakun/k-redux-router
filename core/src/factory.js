/* eslint-env browser */
import middleware from './middleware'
import reducer from './reducer'
import init from './init'
import getFullHrefVersion from './getFullHrefVersion'

const defaultOptions = {
  history: window && window.history,
  location: window && window.location,
}

export default (routes, options = defaultOptions) => {
  const innerOptions = {
    ...defaultOptions,
    ...options,
  }

  // get history implementation (default is window.history _this is history API_)
  if (!innerOptions.history) throw new Error('[k-redux-router] no history implementation is given')
  // get location implementation (default is window.location)
  if (!innerOptions.location) throw new Error('[k-redux-router] no location implementation is given')

  // transform route
  const innerRoutes = { array: getFullHrefVersion(routes) }
  innerRoutes.map = innerRoutes.array.reduce(
    (acc, curr) => Object.assign({}, acc, { [curr.code]: curr }),
    {},
  )

  // implementations
  const reducerImpl = reducer(innerRoutes, innerOptions)
  return ({
    middleware: middleware(innerRoutes, innerOptions, reducerImpl),
    reducer: reducerImpl,
    init,
  })
}
