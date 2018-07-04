export default (getState) => {
  const getRoute = code => state => getState(state).routes.map[code]
  const getResult = state => getState(state).result
  const getCurrentRoute = state => getResult(state).route
  const getCurrentCode = state => getCurrentRoute(state).code
  const isFound = state => getResult(state).found
  const getResultParam = code => state => getCurrentRoute(state)[code]
  const getParams = state => getResult(state).params
  const getPathParams = state => getParams(state).path
  const getQueryParams = state => getParams(state).query
  const getPathParam = code => (state) => {
    const pathParams = getPathParams(state)
    if (pathParams) return pathParams[code]
    return undefined
  }
  const getQueryParam = code => (state) => {
    const queryParams = getQueryParams(state)
    if (queryParams) return getQueryParams(state)[code]
    return undefined
  }
  const getParam = code => state => getResultParam(code)(state) || getPathParam(code)(state) || getQueryParam(code)(state)

  return {
    getState,
    getRoute,
    getResult,
    getCurrentCode,
    getCurrentRoute,
    isFound,
    getResultParam,
    getParams,
    getPathParams,
    getQueryParams,
    getPathParam,
    getQueryParam,
    getParam,
  }
}
