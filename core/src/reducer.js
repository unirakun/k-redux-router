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
