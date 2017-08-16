'use strict'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import GoogleFontsWebpackPlugin from '../src'

const mock = new AxiosMockAdapter(axios)

test('Should get desired font', async () => {
  expect.assertions(1)
  const googleFonts = new GoogleFontsWebpackPlugin()
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext').reply(200,
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold\'), local(\'Roboto-Bold\'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: italic;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto Italic\'), local(\'Roboto-Italic\'), url(https://fonts.gstatic.com/s/roboto/v16/vSzulfKSK0LLjjfeaxcREvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: italic;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold Italic\'), local(\'Roboto-BoldItalic\'), url(https://fonts.gstatic.com/s/roboto/v16/t6Nd4cfPRhZP44Q5QAjcC6g5eI2G47JWe0-AuFtD150.woff2) format(\'woff2\');\n' +
    '}\n')
  await expect(googleFonts.requestFontsCSS('woff2')).resolves.toMatch(/Roboto Bold Italic.*\.woff2/)
})

test('Should get one font css', async () => {
  expect.assertions(1)
  const googleFonts = new GoogleFontsWebpackPlugin()
  mock.onGet('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext').reply(200,
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url(https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold\'), local(\'Roboto-Bold\'), url(https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: italic;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto Italic\'), local(\'Roboto-Italic\'), url(https://fonts.gstatic.com/s/roboto/v16/vSzulfKSK0LLjjfeaxcREvesZW2xOQ-xsNqO47m55DA.woff2) format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: italic;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold Italic\'), local(\'Roboto-BoldItalic\'), url(https://fonts.gstatic.com/s/roboto/v16/t6Nd4cfPRhZP44Q5QAjcC6g5eI2G47JWe0-AuFtD150.woff2) format(\'woff2\');\n' +
    '}\n')
  await expect(googleFonts.requestFont('https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=latin,latin-ext', 'woff2')).resolves.toMatch(/Roboto Bold Italic.*\.woff2/)
})
