import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    name: pkg.amdName || pkg.name,
    file: `dist/index.${process.env.FORMAT || 'es'}.js`,
    format: process.env.FORMAT || 'es',
    sourcemap: false,
    globals: {
      '@k-redux-router/core': 'kReduxRouterCore',
      'k-ramel': 'kRamel',
      'prop-types': 'PropTypes',
      '@k-ramel/react': 'kRamelReact',
      react: 'React',
    },
  },
  plugins: [
    babel(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    terser(),
  ],
  external: [
    'react',
    '@k-redux-router/core',
    '@k-ramel/react',
    'prop-types',
    'k-ramel',
  ],
}
