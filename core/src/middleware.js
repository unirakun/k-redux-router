// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const toQueryString = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')

// https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
const queryToObject = () => {
  if (location.search.length < 2) return {}

  const search = location.search.substring(1)
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}

const routeFound = result => ({ type: '@@router/ROUTE_FOUND', payload: Object.assign({ found: true }, result) })

const dispatchResultFactory = reducer => store => {
  let result = { found: false }
  if (window && window.location && window.location.pathname) {
    // find route (& path params)
    let pathParams
    const route = reducer.getState(store.getState()).routes.array.find((route) => {
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
    case '@@router/PUSH': {
      const { code, params } = payload

      // find route
      const route = reducer.getState(store.getState()).routes.map[code]

      // update history API
      if (route) {
        let { href } = route
        let queryPart = ''

        let toPush = href.base
        if (href.compiled) toPush = href.compiled(params.path)
        if (params.query) queryPart = `?${toQueryString(params.query)}`

        history.pushState(undefined, undefined, `${toPush}${queryPart}`)
      }

      // TODO: if no route, find the closest `notFound` to push it in `result`

      // update state
      return routeFound({
        route,
        params,
      })
    }
    default: return action
  }
}

export default (routes, options, reducer) => {
  let initialized = false
  const dispatchResult = dispatchResultFactory(reducer)
  const mapAction = mapActionFactory(reducer)

  // redux middleware
  return store => next => action => {
    // init watchers (location/INIT)
    // - this is done here because we can't dispatch when middlewares tree is initialized by redux
    // - so we make sure that the dispatch are done when we are initialized
    // - we hope to pass there at the beginin thanks to the `@@INIT` from redux :)
    if (!initialized) {
      initialized = true

      // INIT
      dispatchResult(store)

      // watcher (location)
      window.onpopstate = () => { dispatchResult(store) }
    }

    // these action are not catched by the middleware and are used as it is
    if (
      // action without type
      !action.type
      // action that are not related to this lib
      || !action.type.startsWith('@@router/')
      // `@@router/ROUTE_FOUND` to avoid infinite loop
      || action.type === '@@router/ROUTE_FOUND'
    ) return next(action)

    // dispatch base action so other lib and reducer can plug to it
    const res = next(action)

    // router actions can found a new route
    store.dispatch(mapAction(store)(action))

    return res
  }
}
