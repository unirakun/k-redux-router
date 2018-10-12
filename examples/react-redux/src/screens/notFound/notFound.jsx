import React from 'react'
import { Link } from '@k-redux-router/react-redux'

const First = () => (
  <div>
    Not found
    <span role="img" aria-label="not-found">😱</span>

    <Link code="first">go to first</Link>
  </div>
)

export default First
