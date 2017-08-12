'use strict'

const fs = jest.genMockFromModule('fs')

fs.writeFileSync = (file, content) => {
  return {
    file    : file,
    content : content
  }
}

export default fs
