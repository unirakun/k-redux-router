/* eslint-env browser */

// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const toQueryString = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')

// https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
const queryToObject = () => {
  const { location } = window

  if (location.search.length < 2) return {}

  const search = location.search.substring(1)
  return JSON.parse(`{"${decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`)
}

const routeFound = result => ({ type: '@@router/ROUTE_FOUND', payload: Object.assign({ found: true }, result) })

const dispatchResultFactory = reducer => (store) => {
  if (window && window.location && window.location.pathname) {
    // find route (& path params)
    let pathParams
    const route = reducer.getState(store.getState()).routes.array.find((r) => {
      pathParams = r.href.regexp.exec(window.location.pathname)
      return !!pathParams
    })

    // attach names to path params
    pathParams = route.href.parsed
      .map(part => part.name)
      .filter(Boolean)
      .reduce(
        (acc, curr, index) => Object.assign({ [curr]: pathParams[index + 1] }, acc),
        {},
      )

    store.dispatch(routeFound({
      route,
      params: {
        path: pathParams,
        query: queryToObject(),
      },
    }))
  }
}

const mapActionFactory = reducer => store => (action) => {
  const { type, payload } = action

  switch (type) {
    case '@@router/GO_BACK': {
      window.history.go(payload * -1)
      return undefined
    }
    case '@@router/REPLACE':
    case '@@router/PUSH': {
      const { code, params } = payload

      // find route
      const route = reducer.getState(store.getState()).routes.map[code]

      // update history API
      if (route) {
        const { href } = route
        let queryPart = ''

        let toPush = href.base
        if (href.compiled) toPush = href.compiled(params.path)
        if (params.query) queryPart = `?${toQueryString(params.query)}`

        toPush = `${toPush}${queryPart}`
        if (type === '@@router/PUSH') window.history.pushState(undefined, undefined, toPush)
        else window.history.replaceState(undefined, undefined, toPush)
      }

      // TODO: if no route, find the closest `notFound` to push it in `result`

      // update state
      return routeFound({
        route,
        params,
      })
    }
    // default is undefined so we avoid infinite loop
    default: return undefined
  }
}

export default (routes, options, reducer) => {
  let initialized = false
  const dispatchResult = dispatchResultFactory(reducer)
  const mapAction = mapActionFactory(reducer)

  // redux middleware
  return store => next => (action) => {
    // these action are not catched by the middleware and are used as it is
    if (!action.type || !action.type.startsWith('@@router/')) return next(action)

    // dispatch base action so other lib and reducer can plug to it
    const res = next(action)

    // init watchers (location/INIT)
    // - this is done here because we can't dispatch when middlewares tree is initialized by redux
    // - so we make sure that the dispatch are done when we are initialized
    if (action.type === '@@router/INIT') {
      dispatchResult(store) // TODO: move to store.dispatch pattern

      if (initialized) {
        console.warn('[k-redux-router] initialized twice') // eslint-disable-line no-console
      } else {
        initialized = true

        // watcher (location)
        window.onpopstate = () => { dispatchResult(store) } // TODO: move to store.dispatch pattern
      }
    }

    if (!initialized && action.type !== '@@router/ROUTE_FOUND') console.warn('[k-redux-router] router should be initialized') // eslint-disable-line no-console

    // router actions can found a new route
    const newAction = mapAction(store)(action)
    if (newAction) store.dispatch(newAction)

    return res
  }
}
