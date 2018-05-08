import pathToRegexp from 'path-to-regexp'
import memoize from 'lodash/memoize'
import { withProps } from 'recompose'
import Component from './link'

// TODO: Move all of this logic to redux so we can remove lodash / recompose

const getRoutesMap = memoize((routes) => {
  const getKey = (route) => {
    // this is not a route
    if (undefined === route
      || typeof route !== 'object'
      || Array.isArray(route)
    ) return undefined

    return route.title
  }

  const routesMap = {}
  const addRoute = (currentRoutes) => {
    Object
      .entries(currentRoutes)
      .forEach(([href, route]) => {
        // if a route doesn't have a key this is because we are in an other object type
        const key = getKey(route)
        if (!key) return

        // in other cases we add the route to the map
        routesMap[key] = {
          ...route,
          parent: undefined,
          href,
          compiledHref: (href.includes(':') ? pathToRegexp.compile(href) : undefined),
        }

        // recursion on each
        addRoute({ ...route, parent: undefined })
      })
  }

  addRoute(routes)
  return routesMap
})

const findRoute = (routes) => {
  const routesMap = getRoutesMap(routes)

  return title => routesMap[title]
}

const getTargetHref = (route, props) => {
  if (!route || !route.href) return props.href

  const { href, compiledHref } = route
  if (!compiledHref) return href

  return compiledHref(props)
}

const emptyProps = {}
export default withProps((props) => {
  const { href, routes, title } = props
  if (href) return emptyProps

  const route = findRoute(routes)(title)
  return {
    href: getTargetHref(route, props),
  }
})(Component)
