/* eslint-env jest */
import toQueryString from './toQueryString'

describe('toQueryString', () => {
  const match = res => () => expect(res).toMatchSnapshot()
  it('should returns the query string', match(toQueryString({ object: 'with', some: 'values' })))
})
