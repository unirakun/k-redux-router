import { pathToRegexp, parse, compile } from 'path-to-regexp'
import isRoute from './isRoute'

export default (routes) => {
  const fullVersion = []

  const addRoute = (base, parent, route) => {
    // parameters to copy from parent to route
    let propertiesToCopy = {}
    if (parent) {
      propertiesToCopy = Object
        .entries(parent)
        // eslint-disable-next-line no-unused-vars
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
            compiled: (base.includes(':') ? compile(base) : undefined),
            regexp: pathToRegexp(base),
            parsed: parse(base),
          },
        },
      )

      fullVersion.push(innerRoute)
    }

    // process children
    Object
      .entries(route)
      .filter(([key, value]) => isRoute(value)) // eslint-disable-line no-unused-vars
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

        route[key] = newValue // eslint-disable-line no-param-reassign
      })
  })

  return fullVersion
}
