/* eslint-env jest */
import mapAction from './mapAction'

describe('mapAction', () => {
  const options = {
    history: {
      go: jest.fn(),
      pushState: jest.fn(),
      replaceState: jest.fn(),
    },
  }

  const reducer = {
    getState: state => state.router,
  }

  const state = {
    router: {
      routes: {
        map: {
          'found-code': {
            href: {
              base: '/route/:id/with/parameters',
              compiled: jest.fn(() => 'compiled/route/'),
            },
          },
          'found-code-2': {
            href: {
              base: '/route/without/parameters',
            },
          },
        },
      },
    },
  }

  const store = {
    getState: () => state,
  }

  beforeEach(() => {
    options.history.go.mockClear()
    options.history.pushState.mockClear()
    options.history.replaceState.mockClear()
    state.router.routes.map['found-code'].href.compiled.mockClear()
  })

  const match = action => () => expect({
    returns: mapAction(options, reducer)(store)(action),
    go: options.history.go.mock.calls,
    pushState: options.history.pushState.mock.calls,
    replaceState: options.history.replaceState.mock.calls,
    compiled: state.router.routes.map['found-code'].href.compiled.mock.calls,
  }).toMatchSnapshot()

  // !!! TESTS !!!
  it('should return undefined when action is unknown', match({ type: 'UNKNOWN' }))
  it('should go forward and return undefined action', match({ type: '@@router/GO_FORWARD', payload: 3 }))
  it('should go backward and return undefined action', match({ type: '@@router/GO_BACK', payload: 5 }))
  it('should return a ROUTE_FOUND action with compiled params -push-', match({
    type: '@@router/PUSH',
    payload: {
      code: 'found-code',
      params: {
        path: { one: 'path-param' },
        query: { an: 'other-query-param' },
      },
    },
  }))
  it('should return a ROUTE_FOUND action with compiled params -replace-', match({
    type: '@@router/REPLACE',
    payload: {
      code: 'found-code-2',
    },
  }))
})
