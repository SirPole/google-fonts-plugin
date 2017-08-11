'use strict'

import GoogleFontsWebpackPlugin from '../index'

test('Can initialize with default options', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})

test('Can overwrite default options object', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts        : [],
    formats      : [],
    formatAgents : {}
  })
  expect(googleFonts.options).toEqual({
    fonts        : [],
    formats      : [],
    formatAgents : {}
  })
})

test('Can load configuration from json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/options.json')
  expect(googleFonts.options).toEqual({
    fonts        : [],
    formats      : [],
    formatAgents : {}
  })
})

test('Can load nested configuration from json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/optionsNested.json')
  expect(googleFonts.options).toEqual({
    fonts        : [],
    formats      : [],
    formatAgents : {}
  })
})

test('Will fallback to default options if it\'s not present in json file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/optionsMissing.json')
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})

test('Can load configuration from neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/options.neon')
  expect(googleFonts.options).toEqual({
    fonts        : {},
    formats      : {},
    formatAgents : {}
  })
})

test('Can load configuration from nested neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/optionsNested.neon')
  expect(googleFonts.options).toEqual({
    fonts        : {},
    formats      : {},
    formatAgents : {}
  })
})

test('Will fallback to default options if it\'s not present in neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/optionsMissing.neon')
  expect(googleFonts.options).toEqual(GoogleFontsWebpackPlugin.defaultOptions)
})