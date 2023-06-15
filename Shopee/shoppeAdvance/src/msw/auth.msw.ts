import { HttpStatusCode } from 'axios'
import { rest } from 'msw'
import config from 'src/constants/config'
export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wNFQwMzowMjo0OC43MzlaIiwiaWF0IjoxNjgzMTY5MzY4LCJleHAiOjE2ODMxNjkzNzh9.MQ3UUZtoJ-EySSsbK7lSg02vTQMsN64NrL8zkIhu_B0'
export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wNFQwMzowMjo0OC43MzlaIiwiaWF0IjoxNjgzMTY5MzY4LCJleHAiOjE2ODMxNjkzODh9.GGDnjz_4UrVaDCVgyVOYJk-bIrQTtx1td4essT5XdOw'
export const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wOFQwODoyNjo1MS42MDNaIiwiaWF0IjoxNjgzNTM0NDExLCJleHAiOjE2ODM1MzU0MTF9.tQ4jAJxgCaPjOAdYZWK57rJ4IJCHJb9sVf_dyeceGwM'

const loginRes = {
  message: 'Đăng nhập thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wNFQwMzowMjo0OC43MzlaIiwiaWF0IjoxNjgzMTY5MzY4LCJleHAiOjE2ODMxNjkzNzh9.MQ3UUZtoJ-EySSsbK7lSg02vTQMsN64NrL8zkIhu_B0',
    expires: 999999,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NDIyNDIwNmQ3YzYyMDM0MDg1YjM1NSIsImVtYWlsIjoidHJ1bmd0dXllbmRpbWFAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wNFQwMzowMjo0OC43MzlaIiwiaWF0IjoxNjgzMTY5MzY4LCJleHAiOjE2ODMxNjkzODh9.GGDnjz_4UrVaDCVgyVOYJk-bIrQTtx1td4essT5XdOw',
    expires_refresh_token: 86400000,
    user: {
      _id: '636f935e5fdc5f037e6f68d3',
      roles: ['User'],
      email: 'd3@gmail.com',
      createdAt: '2022-11-12T12:36:46.282Z',
      updatedAt: '2022-12-02T07:57:45.069Z',
      __v: 0,
      avatar: 'a59b50bf-511c-4603-ae90-3ccc63d373a9.png',
      name: 'Dư Thanh Được'
    }
  }
}

const refreshTokenRes = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNmY5MzVlNWZkYzVmMDM3ZTZmNjhkMyIsImVtYWlsIjoiZDNAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyMi0xMi0xOVQwNzozMTowMC4yNTJaIiwiaWF0IjoxNjcxNDM1MDYwLCJleHAiOjE2NzIwMzk4NjB9.vTHglpuxad5h_CPpIaDCUpW0xJPYarJzLFeeul0W61E'
  }
}

const loginRequest = rest.post(`${config.baseUrl}login`, (req, res, ctx) => {
  return res(ctx.status(HttpStatusCode.Ok), ctx.json(loginRes))
})

const refreshToken = rest.post(`${config.baseUrl}refresh-access-token`, (req, res, ctx) => {
  return res(ctx.status(HttpStatusCode.Ok), ctx.json(refreshTokenRes))
})

const authRequests = [loginRequest, refreshToken]

export default authRequests
