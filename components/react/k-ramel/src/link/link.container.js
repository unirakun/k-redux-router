import { inject, listen } from '@k-ramel/react'
import Component from './link'

// copied from redux-little-router
// - this part is about letting user make CTRL+CLICK (example)
// - but keep the push-history-api available when we do a simple click
const LEFT_MOUSE_BUTTON = 0
const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON
const hasModifier = e => !!(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)
const shouldIgnoreClick = e => hasModifier(e) || isNotLeftClick(e) || e.defaultPrevented

// map store
const mapStore = (store, { onClick }, { router }) => ({
  routes: store.getState().router.routes,
  onClick: href => (e) => {
    if (onClick) onClick(e)

    if (shouldIgnoreClick(e)) return

    router.push(href)
    e.preventDefault()
  },
})

export default inject(mapStore)(Component)
