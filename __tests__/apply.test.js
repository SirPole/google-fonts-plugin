'use strict'

import path from 'path'
import webpack from 'webpack'
import webpackConfig from '../__mocks__/webpack.config.js'
import GoogleFontsWebpackPlugin from '../src'

test('Should apply to webpack 4', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), () => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})

test('Should apply with config file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin(path.resolve('__mocks__', 'options.json'))
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), () => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})

test('Should apply with config object', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: []
  })
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), () => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})
