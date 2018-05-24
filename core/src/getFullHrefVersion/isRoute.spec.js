/* eslint-env jest */
import isRoute from './isRoute'

describe('isRoute', () => {
  it('should not be a route [object without code]', () => {
    expect(isRoute({ an: 'object' })).toBe(false)
  })

  it('should not be a route [not an object]', () => {
    expect(isRoute('string')).toBe(false)
  })

  it('should be a route', () => {
    expect(isRoute({ code: 'code-route' })).toBe(true)
  })
})
