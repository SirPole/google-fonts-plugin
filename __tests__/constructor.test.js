'use strict'

import GoogleFontsWebpackPlugin from '../src'

test('Can initialize with default options', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})

test('Can overwrite default options object', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false
  })
  expect(googleFonts.options).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Can load configuration from json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/options.json')
  expect(googleFonts.options).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Can load nested configuration from json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsNested.json')
  expect(googleFonts.options).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Can load nested configuration from json file while not being the first', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsNestedButNotFirst.json')
  expect(googleFonts.options).toEqual({
    fonts: [],
    formats: [],
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Will fallback to default options if it\'s not present in json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsMissing.json')
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})

test('Can load configuration from neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/options.neon')
  expect(googleFonts.options).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Can load configuration from nested neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsNested.neon')
  expect(googleFonts.options).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Can load nested configuration from json file while not being the first', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsNestedButNotFirst.neon')
  expect(googleFonts.options).toEqual({
    fonts: {},
    formats: {},
    formatAgents: {},
    chunkName: '',
    encode: false
  })
})

test('Will fallback to default options if it\'s not present in neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/optionsMissing.neon')
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})
