'use strict'

import GoogleFontsWebpackPlugin from '../src'

test('Should create chunk hash from options', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  expect(googleFonts.createHash()).toEqual('53284abe5dfffdcdabb63d76951547607c7339c8')
})
