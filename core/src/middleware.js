// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const toQueryString = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')

// https://stackoverflow.com/questions/8648892/convert-url-parameters-to-a-javascript-object
const queryToObject = () => {
  if (location.search.length < 2) return {}

  const search = location.search.substring(1)
  return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
}

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

    store.dispatch({
      type: '@@router/ROUTE_FOUND',
      payload: {
        found: true,
        route,
        params: {
          path: pathParams,
          query: queryToObject(),
        },
      },
    })
  }
}

export default (routes, options, reducer) => {
  let initialized = false
  const dispatchResult = dispatchResultFactory(reducer)

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

    console.log('avant', store.getState())

    let res
    if (action.type === 'BLA') store.dispatch({ type: 'test-avant' })

    // exemple replacing an action per an other
    if (action.type === 'youpi') res = next({ type: 'something else' })
    else res = next(action)

    console.log('apres', store.getState())

    if (action.type === 'BLA') store.dispatch({ type: 'test-apres' })
    console.log({ res })

    return res
  }
}
