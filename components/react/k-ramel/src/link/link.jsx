import React from 'react'
import PropTypes from 'prop-types'

const Link = (props) => {
  const {
    className,
    children,
    href,
    onClick,
  } = props

  return (
    <a
      className={className}
      href={href}
      onClick={onClick(href)}
    >
      {children}
    </a>
  )
}

Link.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  href: PropTypes.string,
  onClick: PropTypes.func,
}

Link.defaultProps = {
  className: undefined,
  children: undefined,
  href: undefined,
  onClick: undefined,
}

export default Link
