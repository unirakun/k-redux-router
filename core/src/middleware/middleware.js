/* eslint-env browser */
import dispatchResultFactory from './dispatchResult'
import mapActionFactory from './mapAction'
import routeFound from './routeFound'

export default (routes, options, reducer) => {
  let initialized = false
  const dispatchResult = dispatchResultFactory(options, reducer)
  const mapAction = mapActionFactory(options, reducer)

  // redux middleware
  return store => next => (action) => {
    // these action are not catched by the middleware and are used as it is
    if (!action.type || !action.type.startsWith('@@router/')) return next(action)

    // dispatch base action so other lib and reducer can plug to it
    const res = next(action)

    // init watchers (location/INIT)
    // - this is done here because we can't dispatch when middlewares tree is initialized by redux
    // - so we make sure that the dispatch are done when we are initialized
    if (action.type === '@@router/INIT') { // TODO: do like routeFound.type
      dispatchResult(store) // TODO: move to store.dispatch pattern

      if (initialized) {
        console.warn('[k-redux-router] initialized twice') // eslint-disable-line no-console
      } else {
        initialized = true

        // watcher (location)
        // TODO: make it pure
        if (window) window.onpopstate = () => { dispatchResult(store) } // TODO: move to store.dispatch pattern
      }
    }

    if (!initialized && action.type !== routeFound.type) console.warn('[k-redux-router] router should be initialized') // eslint-disable-line no-console

    // router actions can found a new route
    const newAction = mapAction(store)(action)
    if (newAction) store.dispatch(newAction)

    return res
  }
}
