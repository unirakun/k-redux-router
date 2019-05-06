import { selectors, actions } from '@k-redux-router/core'
import { connect } from 'react-redux'
import Component from './link'

// copied from redux-little-router
// - this part is about letting user make CTRL+CLICK (example)
// - but keep the push-history-api available when we do a simple click
const LEFT_MOUSE_BUTTON = 0
const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON
const hasModifier = e => !!(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)
const shouldIgnoreClick = e => hasModifier(e) || isNotLeftClick(e) || e.defaultPrevented

const mapState = (
  state,
  {
    code,
    getState = currentState => currentState.ui.router,
  },
) => {
  const { getRoute } = selectors(getState)

  return {
    href: getRoute(code)(state).href,
  }
}

const mapDispatch = (
  dispatch,
  {
    onClick,
    code,
    query,
    ...params
  },
) => ({
  onClick: (e) => {
    // parent onClick callback
    if (onClick) onClick(e)

    // sometimes we want to ignore click
    if (shouldIgnoreClick(e)) return

    // dispatch the push
    dispatch(actions.push(code, params, query))

    // prevent default behaviour
    e.preventDefault()
  },
})

export default connect(mapState, mapDispatch)(Component)
