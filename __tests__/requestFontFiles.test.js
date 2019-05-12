'use strict'

import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import GoogleFontsWebpackPlugin from '../src'

const mock = new AxiosMockAdapter(axios)

test('Should encode font file to base64', async () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  await expect(googleFonts.requestFontFile('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2')).resolves.toBe('"data:application/x-font-woff2;base64,YXNkZg=="')
})

test('Should encode array of font files to base64', async () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2').reply(200, 'asdf')
  mock.onGet('https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2').reply(200, 'fdsa')
  await expect(googleFonts.requestFontFiles([
    'https://fonts.gstatic.com/s/roboto/v16/fIKu7GwZTy_12XzG_jt8eA.woff2',
    'https://fonts.gstatic.com/s/roboto/v16/97uahxiqZRoncBaCEI3aW1tXRa8TVwTICgirnJhmVJw.woff2'
  ])).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])
})

test('Should ignore already encoded files', async () => {
  const googleFonts = new GoogleFontsWebpackPlugin()
  await expect(googleFonts.requestFontFiles([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])).resolves.toEqual([
    '"data:application/x-font-woff2;base64,YXNkZg=="',
    '"data:application/x-font-woff2;base64,ZmRzYQ=="'
  ])
})
