import * as actions from './actions'
import selectors from './selectors'

export default (routes, options = {}) => {
  // init redux state
  const initState = Object.assign(
    {},
    {
      routes,
      result: { found: false },
    },
  )

  const reducer = (state = initState, { type, payload } = {}) => {
    switch (type) {
      case '@@router/ROUTE_FOUND': return Object.assign({}, state, { result: payload })
      default: return state
    }
  }

  // selectors
  Object.assign(reducer, selectors(options.getState || (state => state.ui.router)))

  // actions
  Object.assign(reducer, actions)

  return reducer
}
