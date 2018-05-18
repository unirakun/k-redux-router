import { createStore } from 'k-ramel'
import { router } from '@k-redux-router/react-kramel'

const routes = {
  '/': {
    code: 'first',
    public: true,
    '/:id/second': {
      code: 'second',
    },
    '/third': {
      code: 'third',
      public: false,
    },
  },
}

export default createStore(
  {
    ui: {},
  },
  {
    drivers: {
      router: router({ routes }),
    },
  },
)
