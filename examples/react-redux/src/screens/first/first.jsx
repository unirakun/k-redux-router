import React from 'react'
import { Link } from '@k-redux-router/react-redux'

const First = () => (
  <div>
    This is the first screen
    <Link code="second" id="3">test</Link>
  </div>
)

export default First
