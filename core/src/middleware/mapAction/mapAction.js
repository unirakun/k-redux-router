/* eslint-env browser */
import routeFound from '../routeFound'
import toQueryString from './toQueryString'

export default (options, reducer) => {
  const {
    history,
  } = options

  return store => (action) => {
    const { type, payload } = action

    switch (type) {
      case '@@router/GO_FORWARD': {
        history.go(payload)
        return undefined
      }
      case '@@router/GO_BACK': {
        history.go(payload * -1)
        return undefined
      }
      case '@@router/REPLACE':
      case '@@router/PUSH': {
        const { code, params = {} } = payload

        // find route
        const route = reducer.getState(store.getState()).routes.map[code]

        if (route) {
          const { href } = route

          // remove unknown path params
          const pathParamsToPush = {}
          if (params && params.path && href.parsed) {
            href.parsed
              .filter(part => typeof part === 'object')
              .map(part => part.name)
              .filter(name => params.path[name])
              .forEach((name) => { pathParamsToPush[name] = params.path[name] })
          }

          // construct URI
          let queryPart = ''
          let toPush = href.base
          if (href.compiled) toPush = href.compiled(pathParamsToPush)
          if (params.query) queryPart = `?${toQueryString(params.query)}`

          // push URI to history API
          toPush = `${toPush}${queryPart}`
          if (type === '@@router/PUSH') history.pushState(undefined, undefined, toPush)
          else history.replaceState(undefined, undefined, toPush)


          // update state
          const paramsToPush = { ...params }
          if (params && params.path) paramsToPush.path = pathParamsToPush
          return routeFound({
            route,
            params: paramsToPush,
          })
        }

        // TODO: if no route, find the closest `notFound` to push it in `result`
        return undefined
      }
      // default is undefined so we avoid infinite loop
      default: return undefined
    }
  }
}
