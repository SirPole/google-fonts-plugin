'use strict'

import GoogleFontsWebpackPlugin from '../src'
import path from 'path'

jest.mock('fs')

test('Should save file to file system', () => {
  const googleFonts = new GoogleFontsWebpackPlugin({})
  expect(googleFonts.pushToFile('css', 'woff2')).toEqual({
    file: path.join(googleFonts.options.outputDir, 'woff2.css'),
    content: 'css'
  })
})
