/* eslint-env jest */
import {
  push,
  replace,
  goBack,
  goForward,
} from './actions'

describe('actions', () => {
  const match = result => () => expect(result).toMatchSnapshot()

  describe('push', () => {
    it('should push the user route with no param', match(push('user')))
    it('should push the user route with path params', match(push('user', { id: 2, name: 'Delphine' })))
    it('should push the user route with path and query params', match(push('user', { id: 3 }, { query: 'param', token: 'dzejfzeoif' })))
  })

  describe('replace', () => {
    it('should replace with user route with no param', match(replace('user')))
    it('should replace with user route with path params', match(replace('user', { id: 2, name: 'Delphine' })))
    it('should replace with user route with path and query params', match(replace('user', { id: 3 }, { query: 'param', token: 'dezijfeziofz' })))
  })

  describe('goBack', () => {
    it('should go to one step back', match(goBack()))
    it('shuld go to 3 steps back', match(goBack(3)))
  })

  describe('goForward', () => {
    it('should go to one step forward', match(goForward()))
    it('should go to 3 steps forward', match(goForward(3)))
  })
})
