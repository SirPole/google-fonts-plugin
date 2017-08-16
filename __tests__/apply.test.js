'use strict'

import path from 'path'
import webpack from 'webpack'
import GoogleFontsWebpackPlugin from '../src'

test.skip('Should apply to webpack', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  const compiler    = webpack({
    bail   : true,
    cache  : false,
    entry  : path.join(__dirname, '__mocks__', 'entry.js'),
    output : {
      path     : path.join(__dirname, '__mocks__', 'dist'),
      filename : '[name].[hash].js'
    }
  })
  const plugin = jest.spyOn(compiler, 'plugin')
  const make = jest.spyOn(googleFonts, 'make').mockImplementation(() => 'called!')
  googleFonts.apply(compiler)
  expect(plugin).toBeCalled()
  expect(make).toBeCalled()
})
