import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

const pkg = JSON.parse(fs.readFileSync('./package.json'))

export default {
  input: 'src/index.js',
  output: {
    name: pkg.amdName || pkg.name,
    file: pkg.module,
    format: process.env.FORMAT || 'es',
    sourcemap: false,
    globals: {
      react: 'React',
    },
  },
  plugins: [
    babel(),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js', '.jsx'],
    }),
    uglify(),
  ],
  external: [
    'react',
    '@k-redux-router/core',
    'react-redux',
    'prop-types',
  ],
}