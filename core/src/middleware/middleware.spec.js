/* eslint-disable import/first */
/* eslint-env jest */
jest.mock('./dispatchResult')
jest.mock('./routeFound')

import middleware from './middleware'
import dispatchResultFactory from './dispatchResult'

describe('middleware', () => {
  const reducer = {
    getState: state => state.router,
  }

  const options = {
    history: {
      pushState: jest.fn(),
    },
  }

  const state = {
    dummy: { state: 'true' },
    router: {
      routes: {
        map: {
          code: {
            code: 'route-code',
            isRoute: true,
            href: {
              base: '/base/path',
            },
          },
        },
      },
    },
  }
  const store = {
    store: true,
    getState: () => state,
    dispatch: jest.fn(),
  }

  const next = jest.fn(() => 'next result')

  const routes = {
    '/': {
      code: 'main',
      '/users': {
        code: 'users',
        '/:id': {
          code: 'user',
        },
      },
    },
  }

  beforeEach(() => {
    next.mockClear()
    store.dispatch.mockClear()
    options.history.pushState.mockClear()
  })

  const match = action => () => {
    const mockedDispatchResult = jest.fn()
    dispatchResultFactory.mockImplementation(() => mockedDispatchResult)

    const res = middleware(routes, options, reducer)(store)(next)(action)

    expect({
      res,
      next: next.mock.calls,
      dispatch: store.dispatch.mock.calls,
      dispatchResult: mockedDispatchResult.mock.calls,
      pushState: options.history.pushState.mock.calls,
    }).toMatchSnapshot()
  }

  it('should do nothing but call next middleware -action without type-', match({ action: 'without type' }))
  it('should do nothing but call next middlware -action that is not router scope-', match({ type: 'NOT-ROUTER' }))
  it('should init the router', match({ type: '@@router/INIT' }))
  it('should dispatch router action', match({ type: '@@router/PUSH', payload: { code: 'code' } }))
})
