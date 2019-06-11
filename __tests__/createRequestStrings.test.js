'use strict'

import GoogleFontsWebpackPlugin from '../src'

test('Creates request string with default settings', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext'])
})

test('Does not create request string with empty settings', () => {
  const googleFonts = new GoogleFontsWebpackPlugin('__mocks__/options.json')
  expect(googleFonts.createRequestStrings()).toEqual([])
})

test('Does not create request strong from missing family', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [{}]
  })
  expect(googleFonts.createRequestStrings()).toEqual([null])
})

test('Does create request string with 1 variant', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        variants: [
          '400'
        ]
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400'])
})

test('Does create request string with multiple variants', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        variants: [
          '400',
          '700',
          '900'
        ]
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400,700,900'])
})

test('Does create request string with 1 subset', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        subsets: [
          'latin-ext'
        ]
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&subset=latin-ext'])
})

test('Does create request string with multiple subsets', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        subsets: [
          'greek-ext',
          'latin-ext',
          'vietnamese'
        ]
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&subset=greek-ext,latin-ext,vietnamese'])
})

test('Does create request string with text specified', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        subsets: [
          'greek-ext',
          'latin-ext',
          'vietnamese'
        ],
        text: 'asdf'
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&text=asdf'])
})

test('Does create request string with text specified and ignores subsets', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        text: 'asdf'
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&text=asdf'])
})

test('Does create multiple request strings', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({
    fonts: [
      {
        family: 'Roboto',
        variants: [
          '400',
          '700',
          '900'
        ],
        subsets: [
          'greek-ext',
          'latin-ext',
          'vietnamese'
        ]
      },
      {
        family: 'Open Sans',
        variants: [
          '400',
          '700',
          '900'
        ],
        subsets: [
          'greek-ext',
          'latin-ext',
          'vietnamese'
        ]
      }
    ]
  })
  expect(googleFonts.createRequestStrings()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400,700,900&subset=greek-ext,latin-ext,vietnamese',
    'https://fonts.googleapis.com/css?family=Open+Sans:400,700,900&subset=greek-ext,latin-ext,vietnamese'
  ])
})
