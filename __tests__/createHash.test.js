'use strict'

import GoogleFontsWebpackPlugin from '../src'

test('Should create chunk hash from options', () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  expect(googleFonts.createHash()).toEqual('397b492a2e0d68f611575a272d9ef0b93bf06ce1')
})
