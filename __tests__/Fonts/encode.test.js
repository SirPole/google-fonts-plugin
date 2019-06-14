'use strict'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Fonts from '../../src/Fonts'

const mock = new AxiosMockAdapter(axios)

test('Should replace urls in css with encoded fonts', async () => {
  const fonts = new Fonts()
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2').reply(200, 'fdsa')
  await expect(fonts.encode(
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
    '}\n')).resolves.toBe(
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

test('Shoule keep as is', async () => {
  const fonts = new Fonts()
  fonts.options.encode = false
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2').reply(200, 'fdsa')
  await expect(fonts.encode(
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
    '}\n')).resolves.toBe(
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
    '}\n')
})
