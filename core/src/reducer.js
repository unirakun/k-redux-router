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
            href: url,
            compiledHref: (url.includes(':') ? pathToRegexp.compile(url) : undefined),
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

export default (routes, options = {}) => {
  // transform routes
  const fullHrefVersion = getFullHrefVersion(routes)
  // console.log({ fullHrefVersion })
  // const routesMap = getRoutesMap(fullHrefVersion)

  // get history implementation (default is window.history _this is history API_)
  let { history } = options
  if (!history && window && window.history) history = window.history
  if (!history) throw new Error('[k-redux-router] No history implementation is given')

  const initState = {
    byHref: fullHrefVersion.reduce(
      (acc, curr) => Object.assign({}, acc, { [curr.href]: curr }),
      {},
    ),
    byCode: fullHrefVersion.reduce(
      (acc, curr) => Object.assign({}, acc, { [curr.code]: curr }),
      {},
    ),
    result: undefined,
  }

  console.log({ initState })

  // init reducer
  // const reducer = keyValue({ name: 'router', path: 'ui', key: 'code' })
  // const init = reducer(undefined, { type: '@@k-redux-router/INIT' })
  // const initState = reducer(init, reducer.set(fullHrefVersion))

  // TODO: maybe I don't need a middlare if I wrap k-redux-factory here (in a wrapper reducer)
  // This avoid dispatch in dispatch
  // I can access history-api here

  return (state = initState, { type, payload } = {}) => {
    switch (type) {
      case '@@router/PUSH': {
        const { code, params } = payload

        // find route
        const route = state.byCode[code]

        // update history API
        if (route) {
          let { href, compiledHref } = route
          let queryPart = ''

          if (compiledHref) href = compiledHref(params.path)
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
}
