/* eslint-env browser */
import routeFound from '../routeFound'
import mapQueryToObject from './mapQueryToObject'

export default reducer => (store) => {
  if (window && window.location && window.location.pathname) {
    // find route (& path params)
    let pathParams
    const route = reducer.getState(store.getState()).routes.array.find((r) => {
      pathParams = r.href.regexp.exec(window.location.pathname)
      return !!pathParams
    })

    // attach names to path params
    pathParams = route.href.parsed
      .map(part => part.name)
      .filter(Boolean)
      .reduce(
        (acc, curr, index) => Object.assign({ [curr]: pathParams[index + 1] }, acc),
        {},
      )

    store.dispatch(routeFound({
      route,
      params: {
        path: pathParams,
        query: mapQueryToObject(),
      },
    }))
  }
}
