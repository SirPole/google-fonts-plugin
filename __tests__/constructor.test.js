'use strict'

import GoogleFontswebpackPlugin from '../index'

test('Can initialize with default options', () => {
  const googleFonts = new GoogleFontswebpackPlugin()
  expect(googleFonts.options).toEqual(GoogleFontswebpackPlugin.defaultOptions)
})

test('Can overwrite default options object', () => {
  const googleFonts = new GoogleFontswebpackPlugin({
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
  const googleFonts = new GoogleFontswebpackPlugin('__tests__/__mocks__/options.json')
  expect(googleFonts.options).toEqual({
    fonts        : [],
    formats      : [],
    formatAgents : {}
  })
})

test('Can load configuration from neon file', () => {
  const googleFonts = new GoogleFontswebpackPlugin('__tests__/__mocks__/options.neon')
  expect(googleFonts.options).toEqual({
    fonts        : {},
    formats      : {},
    formatAgents : {}
  })
})
