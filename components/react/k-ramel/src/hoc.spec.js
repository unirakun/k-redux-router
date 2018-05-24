/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import { createStore } from 'k-ramel'
import { provider } from '@k-ramel/react'
import driver from './driver'
import hoc from './hoc'

const matchApp = code => () => {
  const store = createStore(
    {
      dummy: (state = 'nothing') => state, // dummy reducer to get rid of error from redux
    },
    {
      drivers: {
        router: {
          getDriver: () => ({
            getState: () => 'state',
            getResult: () => 'result',
            getRoute: () => ({
              code: code.split('_')[0],
            }),
            getCurrentRoute: () => ({
              code, // current route is the root parameter
              parent: code.split('_')[0], // either relative or absolute or undefined
            })
          })
        }
      }
    }
  )

  const RelativeDecoratedComponent = hoc('relative')(() => <div>Relative component</div>)
  const AbsoluteDecoratedComponent = hoc.absolute('absolute')(() => <div>Absolute component</div>)
  const App = provider(store)(() => (
    <div>
      <RelativeDecoratedComponent />
      <AbsoluteDecoratedComponent />
    </div>
  ))

  expect(renderer.create(<App />)).toMatchSnapshot()
}

describe('hoc', () => {
  it('should print relative route -strict equality-', matchApp('relative'))
  it('should print relative route -child-', matchApp('relative_child'))
  it('should print absolute route -strict equality-', matchApp('absolute'))
  it('should not print absolute route -child-', matchApp('absolute_child'))
})
