'use strict'

const fs = jest.genMockFromModule('fs')

fs.writeFileSync = (file, content) => {
  return {
    file: file,
    content: content
  }
}

module.exports = fs
