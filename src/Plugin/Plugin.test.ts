import webpackConfig from '../__mocks__/webpack.config'
import Plugin from './Plugin'
import * as webpack from 'webpack'

test('Should apply to webpack 4', (): void => {
  const googleFonts = new Plugin()
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), (): void => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})

test('Should apply with config file', (): void => {
  const googleFonts = new Plugin('src/__mocks__/options.json')
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), (): void => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})

test('Should apply with config object', (): void => {
  const googleFonts = new Plugin({
    fonts: [],
  })
  const compiler = webpack(webpackConfig)
  const environment = jest.spyOn(compiler.hooks.environment, 'tap')
  const make = jest.spyOn(compiler.hooks.make, 'tapAsync')
  const emit = jest.spyOn(compiler.hooks.emit, 'tap')
  const afterCompile = jest.spyOn(compiler.hooks.afterCompile, 'tap')
  googleFonts.apply(compiler)
  compiler.emitAssets(compiler.createCompilation(), (): void => {})
  expect(environment).toBeCalled()
  expect(make).toBeCalled()
  expect(emit).toBeCalled()
  expect(afterCompile).toBeCalled()
})

test('Should generate basic filename', (): void => {
  const googleFonts = new Plugin({
    filename: 'test.css',
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe(
    'test.css'
  )
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe(
    'test.css'
  )
})

test('Should replace [name] in filename', (): void => {
  const googleFonts = new Plugin({
    filename: '[name].css',
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe(
    'woff2.css'
  )
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe(
    'woff.css'
  )
})

test('Should replace [hash] in filename', (): void => {
  const googleFonts = new Plugin({
    filename: '[hash].css',
  })
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  compilation.hash = 'asdf'

  expect(googleFonts.getFilename('woff2', compilation)).toBe('asdf.css')
  expect(googleFonts.getFilename('woff', compilation)).toBe('asdf.css')
})

test('Should replace [chunkhash] in filename', (): void => {
  const googleFonts = new Plugin({
    filename: '[chunkhash].css',
  })
  const compiler = webpack(webpackConfig)

  expect(googleFonts.getFilename('woff2', compiler.createCompilation())).toBe(
    '7c0074b72d0b522f8fdb7c14819a957aba78759f.css'
  )
  expect(googleFonts.getFilename('woff', compiler.createCompilation())).toBe(
    '7c0074b72d0b522f8fdb7c14819a957aba78759f.css'
  )
})

test('Should replace [name], [hash] and [chunkhash]', (): void => {
  const googleFonts = new Plugin({
    filename: '[name].[hash].[chunkhash].css',
  })
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  compilation.hash = 'asdf'

  expect(googleFonts.getFilename('woff2', compilation)).toBe(
    'woff2.asdf.ea518415821b9a21f60c0e3731bc1e6c0b7cfabc.css'
  )
  expect(googleFonts.getFilename('woff', compilation)).toBe(
    'woff.asdf.ea518415821b9a21f60c0e3731bc1e6c0b7cfabc.css'
  )
})
