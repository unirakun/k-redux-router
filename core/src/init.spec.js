/* eslint-env jest */
import init from './init'

describe('init', () => {
  it('should create an init action', () => {
    expect(init()).toMatchSnapshot()
  })
})
