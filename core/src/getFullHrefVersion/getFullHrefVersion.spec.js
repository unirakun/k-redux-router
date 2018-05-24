/* eslint-env jest */
import getFullHrefVersion from './getFullHrefVersion'

const match = res => () => expect(res).toMatchSnapshot()

describe('getFullHrefVersion', () => {
  it('should add no route', match(getFullHrefVersion({})))

  it('should add simples routes -nested-', match(getFullHrefVersion({
    '/': {
      code: 'main',
      '/user': {
        code: 'user',
      },
    },
  })))

  it('should add routes with path param', match(getFullHrefVersion({
    '/:id/detail': {
      code: 'user_detail',
    },
  })))

  it('should pass parameters from parent to children', match(getFullHrefVersion({
    '/': {
      code: 'main',
      public: true,
      '/user': {
        code: 'user-list',
        '/:id': {
          code: 'user',
          public: false, // override
        },
      },
    },
  })))
})
