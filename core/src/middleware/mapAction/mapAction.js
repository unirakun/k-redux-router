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
        const { code, params } = payload

        // find route
        const route = reducer.getState(store.getState()).routes.map[code]

        // update history API
        if (route) {
          const { href } = route
          let queryPart = ''

          let toPush = href.base
          if (href.compiled) toPush = href.compiled(params.path)
          if (params.query) queryPart = `?${toQueryString(params.query)}`

          toPush = `${toPush}${queryPart}`
          if (type === '@@router/PUSH') history.pushState(undefined, undefined, toPush)
          else history.replaceState(undefined, undefined, toPush)
        }

        // TODO: if no route, find the closest `notFound` to push it in `result`

        // update state
        return routeFound({
          route,
          params,
        })
      }
      // default is undefined so we avoid infinite loop
      default: return undefined
    }
  }
}
