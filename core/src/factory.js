import pathToRegexp from 'path-to-regexp'
import middleware from './middleware'
import reducer from './reducer'
// import { keyValue } from 'k-redux-factory'

const isRoute = route => typeof route === 'object' && route.code

const getFullHrefVersion = (routes) => {
  const fullVersion = []

  const addRoute = (base, parent, route) => {
    // parameters to copy from parent to route
    let propertiesToCopy = {}
    if (parent) {
      propertiesToCopy = Object
      .entries(parent)
      .filter(([key, value]) => !isRoute(value)) // remove children routes
      .reduce(
        (acc, [key, value]) => Object.assign(acc, { [key]: value }),
        {},
      )
    }

    // process href and add to array
    let innerRoute = route
    if (parent) {
      innerRoute = Object.assign(
        propertiesToCopy,
        route,
        {
          parent: parent && parent.code,
          href: {
            base,
            compiled: (base.includes(':') ? pathToRegexp.compile(base) : undefined),
            regexp: pathToRegexp(base),
            parsed: pathToRegexp.parse(base),
          },
        },
      )

      fullVersion.push(innerRoute)
    }

    // process children
    Object
      .entries(route)
      .filter(([key, value]) => isRoute(value))
      .forEach(([href, childRoute]) => addRoute([base, href].join('').replace('//', '/'), innerRoute, childRoute))
  }

  // start the graph
  addRoute('', undefined, routes)

  // update links
  fullVersion.forEach((route) => {
    // children
    Object
      .entries(route)
      .forEach(([key, value]) => {
        let newValue = value
        if (isRoute(value)) newValue = value.code

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
