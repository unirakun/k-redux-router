import { inject } from '@k-ramel/react'
import Component from './link'

// copied from redux-little-router
// - this part is about letting user make CTRL+CLICK (example)
// - but keep the push-history-api available when we do a simple click
const LEFT_MOUSE_BUTTON = 0
const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON
const hasModifier = e => !!(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)
const shouldIgnoreClick = e => hasModifier(e) || isNotLeftClick(e) || e.defaultPrevented

// map store TODO: use driver (since we are in k-ramel)
const mapStore = (
  store,
  {
    onClick,
    code,
    query,
    ...params
  },
  {
    router,
  },
) => ({
  href: params.href || (router.getRoute(code) && router.getRoute(code).href),
  onClick: (e) => {
    // parent onClick callback
    if (onClick) onClick(e)

    // from redux-little-router
    if (shouldIgnoreClick(e)) return

    // dispatch the push
    router.push(code, params, query)

    // prevent default behaviour
    e.preventDefault()
  },
})

export default inject(mapStore)(Component)
