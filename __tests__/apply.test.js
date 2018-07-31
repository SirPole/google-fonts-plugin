'use strict'

import path from 'path'
import webpack from 'webpack'
import GoogleFontsWebpackPlugin from '../src'

test('Should apply to webpack 4', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  const compiler = webpack({
    bail: true,
    cache: false,
    entry: path.join(__dirname, '__mocks__', 'entry.js'),
    output: {
      path: path.join(__dirname, '__mocks__', 'dist'),
      filename: '[name].[hash].js'
    }
  })
  const plugin = jest.spyOn(compiler.hooks.emit, 'tapAsync')
  const make = jest.spyOn(googleFonts, 'make').mockImplementation(() => {})
  googleFonts.apply(compiler)
  compiler.emitAssets({}, () => {})
  expect(plugin).toBeCalled()
  expect(make).toBeCalled()
})
