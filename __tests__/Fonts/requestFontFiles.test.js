'use strict'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Fonts from '../../src/Fonts'

const mock = new AxiosMockAdapter(axios)

test('Should encode font file to base64', async () => {
  const fonts = new Fonts()
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  await expect(fonts.requestFontFile('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2')).resolves.toBe('"data:application/x-font-woff2;base64,YXNkZg=="')
})

test('Should encode array of font files to base64', async () => {
  const fonts = new Fonts()
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2').reply(200, 'fdsa')
  await expect(fonts.requestFontFiles([
    'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2',
    'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2'
  ])).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])
})

test('Should ignore already encoded files', async () => {
  const fonts = new Fonts()
  await expect(fonts.requestFontFiles([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])
})
