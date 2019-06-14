'use strict'

import Fonts from '../../src/Fonts'
import Options from '../../src/Options'

test('Creates request url with default settings', () => {
  const fonts = new Fonts(Options.defaultOptions)
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext'])
})

test('Does not create request url with empty settings', () => {
  const fonts = new Fonts({})
  expect(fonts.createRequestUrls()).toEqual(undefined)
})

test('Does not create request strong from missing family', () => {
  const fonts = new Fonts({
    fonts: [{}]
  })
  expect(fonts.createRequestUrls()).toEqual([undefined])
})

test('Does create request url with 1 variant', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto',
        variants: [
          '400'
        ]
      }
    ]
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400'])
})

test('Does create request url with multiple variants', () => {
  const fonts = new Fonts({
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
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto:400,700,900'])
})

test('Does create request url with 1 subset', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto',
        subsets: [
          'latin-ext'
        ]
      }
    ]
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&subset=latin-ext'])
})

test('Does create request url with multiple subsets', () => {
  const fonts = new Fonts({
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
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&subset=greek-ext,latin-ext,vietnamese'])
})

test('Does create request url with text specified and ignores subsets', () => {
  const fonts = new Fonts({
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
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&text=asdf'])
})

test('Does create request url with text specified', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto',
        text: 'asdf'
      }
    ]
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&text=asdf'])
})

test('Does create request url without font-display with encoding enabled', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto'
      }
    ],
    encode: true,
    fontDisplay: 'swap'
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto'])
})

test('Does create request url with font-display when encoding is disabled', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto'
      }
    ],
    encode: false,
    fontDisplay: 'swap'
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&display=swap'])
})

test('Does create request url with custom font-display when encoding is disabled', () => {
  const fonts = new Fonts({
    fonts: [
      {
        family: 'Roboto'
      }
    ],
    encode: false,
    fontDisplay: 'asdf'
  })
  expect(fonts.createRequestUrls()).toEqual(['https://fonts.googleapis.com/css?family=Roboto&display=asdf'])
})

test('Does create multiple request urls', () => {
  const fonts = new Fonts({
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
  expect(fonts.createRequestUrls()).toEqual([
    'https://fonts.googleapis.com/css?family=Roboto:400,700,900&subset=greek-ext,latin-ext,vietnamese',
    'https://fonts.googleapis.com/css?family=Open+Sans:400,700,900&subset=greek-ext,latin-ext,vietnamese'
  ])
})
