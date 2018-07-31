'use strict'

import GoogleFontsWebpackPlugin from '../src'

test('Should minify provided css', async () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  await expect(googleFonts.minifyFonts(
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url("data:application/x-font-woff2;base64,YXNkZg==") format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold\'), local(\'Roboto-Bold\'), url("data:application/x-font-woff2;base64,ZmRzYQ==") format(\'woff2\');\n' +
    '}\n')).resolves.toEqual('@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:local("Roboto"),local("Roboto-Regular"),url("data:application/x-font-woff2;base64,YXNkZg==") format("woff2")}@font-face{font-family:Roboto;font-style:normal;font-weight:700;src:local("Roboto Bold"),local("Roboto-Bold"),url("data:application/x-font-woff2;base64,ZmRzYQ==") format("woff2")}')
})

test('Should not minify provided css', async () => {
  const googleFonts = new GoogleFontsWebpackPlugin({minify: false})
  await expect(googleFonts.minifyFonts(
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url("data:application/x-font-woff2;base64,YXNkZg==") format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold\'), local(\'Roboto-Bold\'), url("data:application/x-font-woff2;base64,ZmRzYQ==") format(\'woff2\');\n' +
    '}\n')).resolves.toEqual(
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 400;\n' +
    '  src: local(\'Roboto\'), local(\'Roboto-Regular\'), url("data:application/x-font-woff2;base64,YXNkZg==") format(\'woff2\');\n' +
    '}\n' +
    '@font-face {\n' +
    '  font-family: \'Roboto\';\n' +
    '  font-style: normal;\n' +
    '  font-weight: 700;\n' +
    '  src: local(\'Roboto Bold\'), local(\'Roboto-Bold\'), url("data:application/x-font-woff2;base64,ZmRzYQ==") format(\'woff2\');\n' +
    '}\n')
})
