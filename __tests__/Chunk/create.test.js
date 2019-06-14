'use strict'

import webpack from 'webpack'
import webpackConfig from '../../__mocks__/webpack.config'
import Chunk from '../../src/Chunk'
import Options from '../../src/Options'

test('Should create chunk hash from options', () => {
  const compiler = webpack(webpackConfig)
  const compilation = compiler.createCompilation()
  const chunk = new Chunk(compilation, Options.defaultOptions.chunkName)
  chunk.create()
  expect(typeof compilation.namedChunks.get(Options.defaultOptions.chunkName)).toBe('object')
  expect(compilation.namedChunks.get(Options.defaultOptions.chunkName).name).toBe(Options.defaultOptions.chunkName)
})
