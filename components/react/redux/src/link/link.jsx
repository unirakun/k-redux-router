import React from 'react'
import PropTypes from 'prop-types'

// https://stackoverflow.com/questions/1714786/query-string-encoding-of-a-javascript-object
const toQueryString = obj => Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&')

// TODO: factorize code with react-redux
const Link = (props) => {
  const {
    href,
    onClick,
    ...params
  } = props

  const {
    className,
    children,
  } = params

  if (href === undefined) return null

  // TODO: factorise code from middleware and from here
  let queryPart = ''
  let processedHref = href
  if (href.base) processedHref = href.base
  if (href.compiled) processedHref = href.compiled(params)
  if (params.query) queryPart = `?${toQueryString(params.query)}`
  processedHref = `${processedHref}${queryPart}`

  return (
    <a
      className={className}
      href={processedHref}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      base: PropTypes.string,
      compiled: PropTypes.func,
    }),
  ]),
  onClick: PropTypes.func,
}

Link.defaultProps = {
  className: undefined,
  children: undefined,
  href: undefined,
  onClick: undefined,
}

export default Link
