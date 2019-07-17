import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import Options from '../Options/Options'
import Stats from './Stats'

const mock = new AxiosMockAdapter(axios)

test('should send tracking request', async (): Promise<void> => {
  const stats = new Stats()
  const options = new Options()
  mock.onPost(/collect/).reply(200)
  await expect(stats.track(options)).resolves.toBe(true)
})

test('should fail silently on 500', async (): Promise<void> => {
  const stats = new Stats()
  const options = new Options()
  mock.onPost(/collect/).reply(500)
  await expect(stats.track(options)).resolves.toBe(false)
})

test('should fail silently on timeout', async (): Promise<void> => {
  const stats = new Stats()
  const options = new Options()
  mock.onPost(/collect/).timeout()
  await expect(stats.track(options)).resolves.toBe(false)
})

test('should fail silently on net error', async (): Promise<void> => {
  const stats = new Stats()
  const options = new Options()
  mock.onPost(/collect/).networkError()
  await expect(stats.track(options)).resolves.toBe(false)
})
