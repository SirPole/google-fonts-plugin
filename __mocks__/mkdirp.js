'use strict'

const mkdirp = jest.genMockFromModule('mkdirp')

mkdirp.sync = (dir) => {
  return {
    dir : dir
  }
}

export default mkdirp
