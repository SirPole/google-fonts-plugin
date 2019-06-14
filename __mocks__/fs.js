'use strict'

const fs = jest.genMockFromModule('fs')

fs.writeFileSync = (file, content) => {
  return {
    file: file,
    content: content
  }
}

fs.existsSync = file => file.endsWith('keep')

fs.readFileSync = (file, encoding) => 'asdf'

module.exports = fs
