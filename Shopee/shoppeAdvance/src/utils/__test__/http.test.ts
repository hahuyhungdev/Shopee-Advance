import { HttpStatusCode } from 'axios'
import { beforeEach, describe, expect, it } from 'vitest'
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth'
import { Http } from '../http'

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    localStorage.clear()
    http = new Http().instance
  })
  const accessToken_1s =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0yNFQxMToyODozOS4wNzJaIiwiaWF0IjoxNjgyMzM1NzE5LCJleHAiOjE2ODIzMzU3MjB9.GssAvIyHdCjCFE2fFT7J2COHSObTrmJ5u5Vf6Ke4EcM'
  const refreshToken_nerver =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0yNFQxMToyODozOS4wNzJaIiwiaWF0IjoxNjgyMzM1NzE5LCJleHAiOjE2ODQzMzU3MTl9.oAA8b7lZrf6XUAEvWrqsnXP6aFoDWZKJ1pnW9B1SVRA'
  it('goi api thanh cong', async () => {
    const res = await http.get('products')
    expect(res.status).toEqual(HttpStatusCode.Ok)
  })
  it('Auth request', async () => {
    await http.post('login', {
      email: 'trungtuyendima@gmail.com',
      password: 'Hung25032001@'
    })
    const res = await http.get('me')
    expect(res.status).toEqual(HttpStatusCode.Ok)
  })
  it('refresh token', async () => {
    setAccessTokenToLS(accessToken_1s)
    setRefreshTokenToLS(refreshToken_nerver)
    const httpNew = new Http().instance
    const res = await httpNew.get('me')
    expect(res.status).toEqual(HttpStatusCode.Ok)
  })
})
