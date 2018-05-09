export default (routes, options) => {
  // init redux state
  const initState = Object.assign(
    {},
    {
      routes,
      result: { found: false }
    }
  )

  const reducer = (state = initState, { type, payload } = {}) => {
    switch (type) {
      case '@@router/ROUTE_FOUND': return Object.assign({}, state, { result: payload })

      /* TODO: move this to middleware ? */
      case '@@router/PUSH': {
        const { code, params } = payload

        // find route
        const route = state.routes.map[code]

        // update history API
        if (route) {
          let { href } = route
          let queryPart = ''

          let toPush = href.base
          if (href.compiled) toPush = href.compiled(params.path)
          if (params.query) queryPart = `?${toQueryString(params.query)}`

          console.log('url to push', `${toPush}${queryPart}`)
          history.pushState(undefined, undefined, `${toPush}${queryPart}`)
        }

        // TODO: if no route, find the closest `notFound` to push it in `result`

        // update state
        return Object.assign(
          {},
          state,
          {
            result: {
              found: true,
              route,
              params,
            },
          },
        )
      }
      default: return state
    }
  }

  // selectors
  reducer.getState = options.getState || (state => state.ui.router)
  reducer.getResult = state => reducer.getState(state).result
  reducer.getCode = state => reducer.getRoute(state).code
  reducer.getRoute = state => reducer.getResult(state).route
  reducer.isFound = state => reducer.getResult(state).found
  reducer.getParams = state => reducer.getResult(state).params
  reducer.getPathParams = state => reducer.getParams(state).path
  reducer.getQueryParams = state => reducer.getParams(state).query
  reducer.getPathParam = code => state => reducer.getPathParams(state)[code]
  reducer.getQueryParam = code => state => reducer.getQueryParams(state)[code]
  reducer.getParam = code => state => reducer.getPathParam(code)(state) || reducer.getQueryParam(code)(state)

  // actions
  reducer.push = (code, pathParams, queryParams) => ({ type: '@@router/PUSH', payload: { code, params: { path: pathParams, query: queryParams } } })

  return reducer
}
