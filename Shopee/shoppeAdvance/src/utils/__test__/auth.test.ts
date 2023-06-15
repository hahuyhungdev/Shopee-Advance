import { describe, it, expect } from 'vitest'
import { isAxiosError, isAxiosUnprocessableEntityError } from '../utils'
import { setAccessTokenToLS, setRefreshTokenToLS, getAccessTokenFromLS, getRefreshTokenFromLS } from '../auth'

const accessToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0yNFQwOToyMzoyOC41NTBaIiwiaWF0IjoxNjgyMzI4MjA4LCJleHAiOjE2ODI5MzMwMDh9.O1j-stwX2puEy6-PIj4EnMhDbkC8sipnozGVXqQj-jU'
const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNC0yNFQwOToyMzoyOC41NTBaIiwiaWF0IjoxNjgyMzI4MjA4LCJleHAiOjE2OTA5NjgyMDh9.JwJu6g_vIXhmjnNGnwou6ZUnqkvflGR3tnBZbYxdAtc'

// write function test setAccessTokenToLS have equal accessToken
describe('setAccessTokenToLS', () => {
  it('should set accessToken to localStorage', () => {
    setAccessTokenToLS(accessToken)
    expect(getAccessTokenFromLS()).toEqual(accessToken)
  })
})
