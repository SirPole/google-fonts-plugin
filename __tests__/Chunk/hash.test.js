'use strict'

import Chunk from '../../src/Chunk'
import Options from '../../src/Options'

test('Should create chunk hash from options', () => {
  expect(Chunk.hash(Options.defaultOptions)).toEqual('4bc64614c5df3996a2d8c7bb9f7960248acc04e9')
})
