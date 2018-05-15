import { inject } from '@k-ramel/react'
import Component from './link'

// copied from redux-little-router
// - this part is about letting user make CTRL+CLICK (example)
// - but keep the push-history-api available when we do a simple click
const LEFT_MOUSE_BUTTON = 0
const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON
const hasModifier = e => !!(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)
const shouldIgnoreClick = e => hasModifier(e) || isNotLeftClick(e) || e.defaultPrevented

// map store
const mapStore = (store, { onClick, code, query, ...params }, { router }) => ({
  href: store.getState().ui.router.routes.map[code],
  onClick: (e) => {
    // parent onClick callback
    if (onClick) onClick(e)

    // from redux-little-router
    if (shouldIgnoreClick(e)) return

    // dispatch the push
    store.dispatch(store.ui.router.push(code, params, query)) // TODO: path is hardcoded (state.ui)

    // prevent default behaviour
    e.preventDefault()
  },
})

export default inject(mapStore)(Component)
