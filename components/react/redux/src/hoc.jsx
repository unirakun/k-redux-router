import React from 'react'
import { selectors } from '@k-redux-router/core'

const getDisplayName = Component => `router(${
  Component.displayName
  || Component.name
  || (Component.constructor && Component.constructor.name)
  || 'Unknown'
})`

const hoc = (code, options = {}) => (Component) => {
  const {
    getState = (state => state.ui.router),
    absolute = false,
  } = options

  const {
    getResult,
    getRoute,
    getCurrentRoute,
    isFound,
  } = selectors(getState)

  return class extends React.Component {
    static displayName = getDisplayName(Component)

    static contextTypes = {
      store: () => null, // this is to avoid importing prop-types
    }

    constructor(props, context) {
      super(props, context)

      this.state = { show: false }
    }

    componentWillMount() {
      const { store } = this.context
      // subscribe
      this.unsubscribe = store.subscribe(() => {
        this.toShow()
      })

      // run in once
      this.toShow()
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    toShow = () => {
      const { store } = this.context
      const state = store.getState()

      if (!getState(state) || !getResult(state)) {
        // eslint-disable-next-line no-console
        console.error('[k-redux-router] | There is no route found in `state.ui.router.result`')
        return
      }

      // The route is not found
      // we can show the wrapped component if `notFound` is given into options
      if (!isFound(state)) {
        const show = (options && options.notFound)
        this.setState(innerState => ({ ...innerState, show }))

        return
      }

      // Absolute mode, we are looking in top level only
      const codes = [].concat(code)
      let currentRoute = getCurrentRoute(state)
      if (absolute) {
        const show = codes.includes(currentRoute.code)
        if (show !== this.state.show) { // eslint-disable-line react/destructuring-assignment
          this.setState(innerState => ({ ...innerState, show }))
        }

        return
      }

      // Either way we are looking top down the result tree
      let show = codes.includes(currentRoute.code)
      while (currentRoute && currentRoute.parent && !show) {
        currentRoute = getRoute(currentRoute.parent)(state)
        show = codes.includes(currentRoute.code)
      }

      if (show !== this.state.show) { // eslint-disable-line react/destructuring-assignment
        this.setState(innerState => ({ ...innerState, show }))
      }
    }

    render() {
      const { show } = this.state
      if (!show) return null

      return <Component {...this.props} />
    }
  }
}

hoc.absolute = (code, options) => hoc(code, { ...options, absolute: true })
hoc.notFound = options => hoc(undefined, { ...options, notFound: true })

export default hoc
