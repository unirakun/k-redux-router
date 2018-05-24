/* eslint-disable
  react/jsx-filename-extension,
*/
/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import hoc from './hoc'

const matchApp = code => () => {
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
            route: {
              code,
              parent: code.split('_')[0], // either relative or absolute or undefined
            },
          },
        },
      },
    },
  )

  const RelativeDecoratedComponent = hoc('relative')(() => <div>Relative component</div>)
  const AbsoluteDecoratedComponent = hoc.absolute('absolute')(() => <div>Absolute component</div>)
  const App = () => (
    <Provider store={store}>
      <div>
        <RelativeDecoratedComponent />
        <AbsoluteDecoratedComponent />
      </div>
    </Provider>
  )

  expect(renderer.create(<App />)).toMatchSnapshot()
}

describe('hoc', () => {
  it('should print relative route -strict equality-', matchApp('relative'))
  it('should print relative route -child-', matchApp('relative_child'))
  it('should print absolute route -strict equality-', matchApp('absolute'))
  it('should not print absolute route -child-', matchApp('absolute_child'))
})
