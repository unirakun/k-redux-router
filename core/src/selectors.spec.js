/* eslint-env jest */
import selectors from './selectors'

describe('selectors', () => {
  const getState = emptyParams => ({
    otherPath: {
      result: {
        found: true,
        route: {
          code: 'other-path',
        },
      },
    },
    notFound: {
      result: {
        found: false,
      },
    },
    router: {
      routes: {
        map: {
          socials: {
            code: 'socials',
            custom: 'custom-socials-value',
          },
        },
      },
      result: {
        found: true,
        route: {
          param: 'route-param-value',
          code: 'current-code',
          custom: 'custom-param-value',
          alone: 'route-alone-value',
        },
        params: emptyParams ? {} : {
          path: {
            param: 'path-param-value',
            common: 'path-value',
            other: 'path-other-value',
          },
          query: {
            param: 'query-param-value',
            common: 'query-value',
            next: 'query-next-value',
          },
        },
      },
    },
  })

  describe('factory', () => {
    const match = (callback, emptyParams) => () => expect(callback(getState(emptyParams))).toMatchSnapshot()

    // test selector
    it('should select to otherPath', match(selectors(state => state.otherPath).getCurrentCode))

    // all the next tests are from the same selector
    const s = selectors(state => state.router)
    it('should get route code (current-code)', match(s.getCurrentCode))
    it('should get param from path (path-value)', match(s.getParam('common')))
    it('should get param from query (query-next-value)', match(s.getParam('next')))
    it('should get query param (query-next-value)', match(s.getQueryParam('next')))
    it('should get path param (path-value)', match(s.getPathParam('common')))
    it('should get all the query params', match(s.getQueryParams))
    it('should get all the path params', match(s.getPathParams))
    it('should get all the params', match(s.getParams))
    it('should found the route', match(s.isFound))
    it('should get the current route definition', match(s.getCurrentRoute))
    it('should get the result', match(s.getResult))
    it('should get the route -socials-', match(s.getRoute('socials')))
    it('should get the result route params', match(s.getResultParam('alone')))
    it('should get undefined where there is no param', match(s.getParam('next'), true))
  })
})
