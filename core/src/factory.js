import pathToRegexp from 'path-to-regexp'
import middleware from './middleware'
import reducer from './reducer'
// import { keyValue } from 'k-redux-factory'

const getFullHrefVersion = (routes) => {
  const fullVersion = []

  const addRoute = (base, parent) => Object
    .entries(parent)
    .filter(([href, route]) => (typeof route === 'object') && route.code)
    .forEach(([href, route]) => {
      const url = [base, href].join('').replace('//', '/')

      // construct a new route
      const newRoute = Object.assign(
        {},
        route,
        {
          parent: parent.code,
          href: {
            base: url,
            compiled: (url.includes(':') ? pathToRegexp.compile(url) : undefined),
            regexp: pathToRegexp(url),
            parsed: pathToRegexp.parse(url),
          },
        },
      )

      // add the new full route
      fullVersion.push(newRoute)

      // add next (children) routes
      addRoute(url, route)
    })

  // start the graph
  addRoute('', routes)

  // update links
  fullVersion.forEach((route) => {
    // children
    Object
      .entries(route)
      .forEach(([key, value]) => {
        let newValue = value
        if (typeof value === 'object' && value.code) newValue = value.code

        route[key] = newValue
      })
  })

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

  // implementations
  const reducerImpl = reducer(innerRoutes, options)
  return ({
    middleware: middleware(innerRoutes, options, reducerImpl),
    reducer: reducerImpl,
  })
}
