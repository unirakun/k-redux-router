import React from 'react'

// TODO: factorize code with react-redux
const getDisplayName = Component => `router(${
  Component.displayName
  || Component.name
  || (Component.constructor && Component.constructor.name)
  || 'Unknown'
})`

const hoc = (code, options) => Component => class extends React.Component {
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
    const { router } = store.drivers

    // TODO: hardcoded path (state.ui)
    if (!router.getState() || !router.getResult()) {
      // eslint-disable-next-line no-console
      console.error('[k-redux-router] | There is no route found in `state.ui.router.result`')
      return
    }

    // Absolute mode, we are looking in top level only
    const codes = [].concat(code)
    let currentRoute = router.getCurrentRoute()
    if (options && options.absolute) {
      const show = codes.includes(currentRoute.code)
      if (show !== this.state.show) { // eslint-disable-line react/destructuring-assignment
        this.setState(innerState => ({ ...innerState, show }))
      }

      return
    }

    // Either way we are looking top down the result tree
    let show = codes.includes(currentRoute.code)
    while (currentRoute && currentRoute.parent && !show) {
      currentRoute = router.getRoute(currentRoute.parent)
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

hoc.absolute = (code, options) => hoc(code, { ...options, absolute: true })

export default hoc
