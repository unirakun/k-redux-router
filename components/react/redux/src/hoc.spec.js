/* eslint-disable
  react/jsx-filename-extension,
*/
/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import hoc from './hoc'

const matchApp = (code, multiple = false, notFound) => () => {
  const store = createStore(
    combineReducers({
      ui: combineReducers({
        router: (state = {}) => state,
      }),
    }),
    {
      ui: {
        router: {
          routes: {
            map: {
              relative: {
                code: 'relative',
              },
              absolute: {
                code: 'absolute',
              },
            },
          },
          result: {
            found: !notFound,
            route: {
              code,
              parent: code.split('_')[0], // either relative or absolute or undefined
            },
          },
        },
      },
    },
  )

  const RelativeDecoratedComponent = hoc(multiple ? ['relative', 'dummy'] : 'relative')(() => <div>Relative component</div>)
  const AbsoluteDecoratedComponent = hoc.absolute(multiple ? ['dummy', 'absolute'] : 'absolute')(() => <div>Absolute component</div>)
  const NotFoundDecoratedComponent = hoc.notFound()(() => <div>Not found component</div>)
  const App = () => (
    <Provider store={store}>
      <div>
        <RelativeDecoratedComponent />
        <AbsoluteDecoratedComponent />
        <NotFoundDecoratedComponent />
      </div>
    </Provider>
  )

  expect(renderer.create(<App />)).toMatchSnapshot()
}

describe('hoc', () => {
  describe('uniq code (string)', () => {
    it('should print relative route -strict equality-', matchApp('relative'))
    it('should print relative route -child-', matchApp('relative_child'))
    it('should print absolute route -strict equality-', matchApp('absolute'))
    it('should not print absolute route -child-', matchApp('absolute_child'))
  })

  describe('array of codes', () => {
    it('should print relative route -strict equality-', matchApp('relative', true))
    it('should print relative route -child-', matchApp('relative_child', true))
    it('should print absolute route -strict equality-', matchApp('absolute', true))
    it('should not print absolute route -child-', matchApp('absolute_child', true))
  })

  describe('not found', () => {
    it('should print the failover component when route is not found', matchApp('notFound', false, true))
  })
})
