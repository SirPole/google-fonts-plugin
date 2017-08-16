'use strict'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import GoogleFontsWebpackPlugin from '../src'

const mock = new AxiosMockAdapter(axios)
jest.mock('fs')
jest.mock('mkdirp')

test('Should run properly', async () => {
  const googleFonts     = new GoogleFontsWebpackPlugin({
    fonts   : [
      {
        family   : 'Roboto',
        variants : [
          '400'
        ],
        subsets  : [
          'latin-ext'
        ]
      }
    ],
    formats : [
      'woff',
      'woff2'
    ]
  })
  const requestFontsCSS = jest.spyOn(googleFonts, 'requestFontsCSS')
  const encodeFonts     = jest.spyOn(googleFonts, 'encodeFonts')
  const minifyFonts     = jest.spyOn(googleFonts, 'minifyFonts').mockImplementation((css) => css + '/*minified*/')
  const pushToFile      = jest.spyOn(googleFonts, 'pushToFile')
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400&subset=latin-ext').reply(200, '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2').reply(200, 'asdf')
  await googleFonts.make()
  expect(requestFontsCSS).toHaveBeenCalledTimes(2)
  expect(encodeFonts).toHaveBeenCalledTimes(2)
  expect(minifyFonts).toHaveBeenCalledTimes(2)
  expect(pushToFile).toHaveBeenCalledTimes(2)
})

test('Should run properly without encoding', async () => {
  const googleFonts     = new GoogleFontsWebpackPlugin({
    fonts   : [
      {
        family   : 'Roboto',
        variants : [
          '400'
        ],
        subsets  : [
          'latin-ext'
        ]
      }
    ],
    formats : [
      'woff',
      'woff2'
    ],
    encode  : false
  })
  const requestFontsCSS = jest.spyOn(googleFonts, 'requestFontsCSS')
  const minifyFonts     = jest.spyOn(googleFonts, 'minifyFonts').mockImplementation((css) => css + '/*minified*/')
  const pushToFile      = jest.spyOn(googleFonts, 'pushToFile')
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400&subset=latin-ext').reply(200, '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2').reply(200, 'asdf')
  await googleFonts.make()
  expect(requestFontsCSS).toHaveBeenCalledTimes(2)
  expect(minifyFonts).toHaveBeenCalledTimes(2)
  expect(pushToFile).toHaveBeenCalledTimes(2)
})

test('Should run properly without minification', async () => {
  const googleFonts     = new GoogleFontsWebpackPlugin({
    fonts   : [
      {
        family   : 'Roboto',
        variants : [
          '400'
        ],
        subsets  : [
          'latin-ext'
        ]
      }
    ],
    formats : [
      'woff',
      'woff2'
    ],
    minify  : false
  })
  const requestFontsCSS = jest.spyOn(googleFonts, 'requestFontsCSS')
  const encodeFonts     = jest.spyOn(googleFonts, 'encodeFonts')
  const pushToFile      = jest.spyOn(googleFonts, 'pushToFile')
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400&subset=latin-ext').reply(200, '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2').reply(200, 'asdf')
  await googleFonts.make()
  expect(requestFontsCSS).toHaveBeenCalledTimes(2)
  expect(encodeFonts).toHaveBeenCalledTimes(2)
  expect(pushToFile).toHaveBeenCalledTimes(2)
})

test('Should run properly without encoding and minification', async () => {
  const googleFonts     = new GoogleFontsWebpackPlugin({
    fonts   : [
      {
        family   : 'Roboto',
        variants : [
          '400'
        ],
        subsets  : [
          'latin-ext'
        ]
      }
    ],
    formats : [
      'woff',
      'woff2'
    ],
    encode  : false,
    minify  : false
  })
  const requestFontsCSS = jest.spyOn(googleFonts, 'requestFontsCSS')
  const pushToFile      = jest.spyOn(googleFonts, 'pushToFile')
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400&subset=latin-ext').reply(200, '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/Fcx7Wwv8OzT71A3E1XOAjvesZW2xOQ-xsNqO47m55DA.woff2').reply(200, 'asdf')
  await googleFonts.make()
  expect(requestFontsCSS).toHaveBeenCalledTimes(2)
  expect(pushToFile).toHaveBeenCalledTimes(2)
})
