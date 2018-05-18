/* eslint-env jest */
jest.mock('./actions', () => ({
  action: 'I am an action',
}))
jest.mock('./selectors', () => getState => ({
  selector: {
    getState,
    test: 'I am a selector',
  },
}))

const factory = require('./reducer').default

describe('reducer', () => {
  describe('default options', () => {
    const routes = { here: 'are routes' }
    const reducer = factory(routes)

    it('should returns default state', () => {
      expect(reducer()).toEqual({
        routes,
        result: { found: false },
      })
    })

    it('should returns same state', () => {
      const state = { sub: 'state' }
      expect(reducer(state)).toBe(state)
    })

    it('should set the result', () => {
      const state = { sub: { inner: 'state' }, result: { something: true } }
      const payload = { newResult: 'is set' }

      const newState = reducer(state, { type: '@@router/ROUTE_FOUND', payload })
      expect(newState.sub).toBe(state.sub)
      expect(newState.result).toBe(payload)
    })

    it('should have actions in it', () => {
      expect(reducer.action).toEqual('I am an action')
    })

    it('should have selectors in it', () => {
      const router = 'I am the router state'
      const state = {
        ui: {
          router,
        },
      }

      expect(reducer.selector.test).toEqual('I am a selector')
      expect(reducer.selector.getState(state)).toEqual(router)
    })
  })

  it('should override getState', () => {
    const wrongRouter = 'I am the WRONG router state'
    const router = 'I am the router state'
    const state = {
      ui: {
        router: wrongRouter,
      },
      new: {
        path: {
          router,
        },
      },
    }

    const reducer = factory({ here: 'are routes' }, { getState: s => s.new.path.router })

    expect(reducer.selector.test).toEqual('I am a selector')
    expect(reducer.selector.getState(state)).toEqual(router)
  })
})
