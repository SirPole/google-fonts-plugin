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

test('Can load configuration from neon file', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__tests__/__mocks__/options.neon')
  expect(googleFonts.options).toEqual({
    fonts        : {},
    formats      : {},
    formatAgents : {}
  })
})
