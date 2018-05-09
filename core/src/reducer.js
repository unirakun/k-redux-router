import pathToRegexp from 'path-to-regexp'
// import { keyValue } from 'k-redux-factory'

const getFullHrefVersion = (routes) => {
  const fullVersion = []

  const addRoute = (base, currentRoutes) => {

    Object
      .entries(currentRoutes)
      .filter(([href, route]) => (typeof route === 'object'))
      .forEach(([href, route]) => {
        const url = [base, href].join('').replace('//', '/')

        fullVersion.push(Object.assign(
          {},
          route,
          {
            href: {
              base: url,
              compiled: (url.includes(':') ? pathToRegexp.compile(url) : undefined),
              regexp: pathToRegexp(url),
              parsed: pathToRegexp.parse(url),
            },
          },
        ))

        addRoute(url, route)
      })
  }

  addRoute('', routes)

  return fullVersion
}

// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const toQueryString = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')

// https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
const queryToObject = () => {
  if (location.search.length < 2) return {}

  const search = location.search.substring(1)
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}

export default (routes, options = {}) => {
  // get history implementation (default is window.history _this is history API_)
  let { history, getState } = options
  if (!history && window && window.history) history = window.history
  if (!history) throw new Error('[k-redux-router] no history implementation is given')

  // transform route
  const innerRoutes = { array: getFullHrefVersion(routes) }
  innerRoutes.map = innerRoutes.array.reduce(
    (acc, curr) => Object.assign({}, acc, { [curr.code]: curr }),
    {},
  )

  // first route is the result
  let result = { found: false }
  if (window && window.location && window.location.pathname) {
    // find route (& path params)
    let pathParams
    const route = innerRoutes.array.find((route) => {
      pathParams = route.href.regexp.exec(window.location.pathname)
      return pathParams
    })

    // attach names to path params
    pathParams = route.href.parsed
      .map(part => part.name)
      .filter(Boolean)
      .reduce(
        (acc, curr, index) => Object.assign({ [curr]: pathParams[index + 1] }, acc),
        {},
      )

    result = {
      found: true,
      params: { path: pathParams, query: queryToObject() },
      route,
    }
  }

  // init redux state
  const initState = Object.assign(
    {},
    {
      routes: innerRoutes,
      result,
    }
  )


  // init reducer
  // const reducer = keyValue({ name: 'router', path: 'ui', key: 'code' })
  // const init = reducer(undefined, { type: '@@k-redux-router/INIT' })
  // const initState = reducer(init, reducer.set(fullHrefVersion))

  // TODO: maybe I don't need a middlare if I wrap k-redux-factory here (in a wrapper reducer)
  // This avoid dispatch in dispatch
  // I can access history-api here

  const reducer = (state = initState, { type, payload } = {}) => {
    switch (type) {
      case '@@router/PUSH': {
        const { code, params } = payload

        // find route
        const route = state.routes.map[code]

        // update history API
        if (route) {
          let { href } = route
          let queryPart = ''

          if (href.compiled) href = href.compiled(params.path)
          if (params.query) queryPart = `?${toQueryString(params.query)}`

          history.pushState(undefined, undefined, `${href}${queryPart}`)
        }

        // TODO: if no route, find the closest `notFound` to push it in `result`

        // update state
        return Object.assign(
          {},
          state,
          {
            result: {
              found: true,
              params,
              route,
            },
          },
        )
      }
      default: return state
    }
  }

  // selectors
  reducer.getResult = state => getState(state).result
  reducer.getCode = state => reducer.getRoute(state).code
  reducer.getRoute = state => reducer.getResult(state).route
  reducer.isFound = state => reducer.getResult(state).found
  reducer.getParams = state => reducer.getResult(state).params
  reducer.getPathParams = state => reducer.getParams(state).path
  reducer.getQueryParams = state => reducer.getParams(state).query
  reducer.getPathParam = code => state => reducer.getPathParams(state)[code]
  reducer.getQueryParam = code => state => reducer.getQueryParams(state)[code]
  reducer.getParam = code => state => reducer.getPathParam(code)(state) || reducer.getQueryParam(code)(state)

  return reducer
}
