export default (getState) => {
  const getRoute = code => state => getState(state).routes.map[code]
  const getResult = state => getState(state).result
  const getCurrentRoute = state => getResult(state).route
  const getCurrentCode = state => getCurrentRoute(state).code
  const isFound = state => getResult(state).found
  const getParams = state => getResult(state).params
  const getPathParams = state => getParams(state).path
  const getQueryParams = state => getParams(state).query
  const getPathParam = code => state => getPathParams(state)[code]
  const getQueryParam = code => state => getQueryParams(state)[code]
  const getParam = code => state => getPathParam(code)(state) || getQueryParam(code)(state)

  return {
    getState,
    getRoute,
    getResult,
    getCurrentCode,
    getCurrentRoute,
    isFound,
    getParams,
    getPathParams,
    getQueryParams,
    getPathParam,
    getQueryParam,
    getParam,
  }
}
