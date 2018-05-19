/* eslint-env jest */
import routeFound from './routeFound'

describe('routeFound', () => {
  const match = res => () => expect(res).toMatchSnapshot()
  it('should returns the type', match(routeFound.type))
  it('should returns found: true', match(routeFound({ result: 'payload' })))
  it('should returns found: false (overrided)', match(routeFound({ result: 'payload', found: false })))
})
