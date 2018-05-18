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

  const { getResult, getRoute, getCurrentRoute } = selectors(getState)

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
      // subscribe
      this.unsubscribe = this.context.store.subscribe(() => {
        this.toShow()
      })

      // run in once
      this.toShow()
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    toShow = () => {
      const state = this.context.store.getState()

      if (!getState(state) || !getResult(state)) {
        // eslint-disable-next-line no-console
        console.error('[k-redux-router] | There is no route found in `state.ui.router.result`')
        return
      }

      // Absolute mode, we are looking in top level only
      let currentRoute = getCurrentRoute(state)
      if (absolute) {
        const show = (code === currentRoute.code)
        if (show !== this.state.show) {
          this.setState(innerState => ({ ...innerState, show }))
        }

        return
      }

      // Either way we are looking top down the result tree
      let show = (code === currentRoute.code)
      while (currentRoute && currentRoute.parent && !show) {
        currentRoute = getRoute(currentRoute.parent)(state)
        show = (code === currentRoute.code)
      }

      if (show !== this.state.show) {
        this.setState(innerState => ({ ...innerState, show }))
      }
    }

    render() {
      if (!this.state.show) return null

      return <Component {...this.props} />
    }
  }
}

hoc.absolute = (code, options) => hoc(code, { ...options, absolute: true })

export default hoc
