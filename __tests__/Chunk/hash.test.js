'use strict'

import Chunk from '../../src/Chunk'
import Options from '../../src/Options'

test('Should create chunk hash from options', () => {
  expect(Chunk.hash(Options.defaultOptions)).toEqual('397b492a2e0d68f611575a272d9ef0b93bf06ce1')
})
