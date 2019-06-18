'use strict'

import webpack from 'webpack'
import webpackConfig from '../../__mocks__/webpack.config'

const Plugin = require('../../src/Plugin')

test('Should generate basic filename', () => {
  const googleFonts = new Plugin({
    filename: 'test.css'
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe('test.css')
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe('test.css')
})

test('Should replace [name] in filename', () => {
  const googleFonts = new Plugin({
    filename: '[name].css'
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe('woff2.css')
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe('woff.css')
})

test('Should replace [hash] in filename', () => {
  const googleFonts = new Plugin({
    filename: '[hash].css'
  })
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  compilation.hash = 'asdf'

  expect(googleFonts.getFilename('woff2', compilation)).toBe('asdf.css')
  expect(googleFonts.getFilename('woff', compilation)).toBe('asdf.css')
})

test('Should replace [chunkhash] in filename', () => {
  const googleFonts = new Plugin({
    filename: '[chunkhash].css'
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe('5fc53cdeb1981b54f5ed1284fac0c8d31cf4e412.css')
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe('5fc53cdeb1981b54f5ed1284fac0c8d31cf4e412.css')
})

test('Should replace [name], [hash] and [chunkhash]', () => {
  const googleFonts = new Plugin({
    filename: '[name].[hash].[chunkhash].css'
  })
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  compilation.hash = 'asdf'

  expect(googleFonts.getFilename('woff2', compilation)).toBe('woff2.asdf.5f6714f284a170e7e326baa428de7f0c1c41b0a8.css')
  expect(googleFonts.getFilename('woff', compilation)).toBe('woff.asdf.5f6714f284a170e7e326baa428de7f0c1c41b0a8.css')
})
