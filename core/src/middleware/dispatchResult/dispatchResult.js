import routeFound from '../routeFound'
import mapQueryToObject from './mapQueryToObject'

export default (options, reducer) => (store) => {
  const innerWindow = options.window || window

  if (innerWindow && innerWindow.location && innerWindow.location.pathname) {
    // find route (& path params)
    let pathParams
    const route = reducer.getState(store.getState()).routes.array.find((r) => {
      pathParams = r.href.regexp.exec(innerWindow.location.pathname)
      return !!pathParams
    })

    // TODO: handle not found
    if (!route) return

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
        query: mapQueryToObject(innerWindow),
      },
    }))
  }
}
