/* eslint-disable
  react/jsx-filename-extension,
  function-paren-newline,
*/
/* eslint-env jest */
import React from 'react'
import renderer from 'react-test-renderer'
import Link from './link'

describe('Link', () => {
  it('should print the complete link -with path params and query params-', () => {
    const compiled = jest.fn(() => '/full/path/compiled')
    const rendered = renderer.create(
      <Link
        href={{
          base: '/path/:with/some/:params',
          compiled,
        }}
        with="with-value"
        params="params-value"
        query={{
          this: 'is',
          two: 'query-params',
        }}
      />,
    )

    expect({
      rendered,
      compiled: compiled.mock.calls,
    }).toMatchSnapshot()
  })
})
