/* eslint-env jest */
import dispatchResult from './dispatchResult'

const match = res => () => expect(res).toMatchSnapshot()

describe('dispatchResult', () => {
  const reducer = {
    getState: state => state.router,
  }

  const store = {
    getState: () => ({
      router: {
        routes: {
          array: [
            {
              href: {
                regexp: /\/some\/(.*)\/name/,
                parsed: [{ name: 'id' }]
              },
            },
          ],
        },
      },
    }),
    dispatch: jest.fn(),
  }

  const options = {
    window: {
      location: {
        pathname: '/some/102/name',
        search: '?query=param',
      },
    },
  }

  beforeEach(() => {
    store.dispatch.mockClear()
  })

  it('should dispatch nothing when no location is given', () => {
    dispatchResult({ ...options, window: {} }, reducer)(store)

    expect(store.dispatch.mock.calls.length).toBe(0)
  })

  it('should dispatch nothing when no pathname is given', () => {
    dispatchResult({ ...options, window: { location: {} } }, reducer)(store)

    expect(store.dispatch.mock.calls.length).toBe(0)
  })

  it('should dispatch nothing if no route is found', () => {
    dispatchResult({ ...options, window: { location: { pathname: 'not-found' } } }, reducer)(store)

    expect(store.dispatch.mock.calls.length).toBe(0)
  })

  it('should dispatch ROUTE_FOUND action with path and query params', () => {
    dispatchResult(options, reducer)(store)

    const { calls } = store.dispatch.mock
    expect(calls.length).toBe(1)
    match(calls[0])()
  })
})
