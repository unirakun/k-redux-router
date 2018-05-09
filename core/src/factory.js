import pathToRegexp from 'path-to-regexp'
import middleware from './middleware'
import reducer from './reducer'
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

  // implementations
  const reducerImpl = reducer(innerRoutes, options)
  return ({
    middleware: middleware(innerRoutes, options, reducerImpl),
    reducer: reducerImpl,
  })
}
