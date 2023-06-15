import { rest } from 'msw'
import config from 'src/constants/config'

import { access_token_1s } from './auth.msw'
import { HttpStatusCode } from 'axios'

const meRes = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '644224206d7c62034085b355',
    roles: ['User'],
    email: 'trungtuyendima@gmail.com',
    createdAt: '2023-04-21T05:50:24.838Z',
    updatedAt: '2023-04-23T06:55:16.865Z',
    address: 'bình thuận',
    date_of_birth: '2001-03-24T17:00:00.000Z',
    name: 'Huy Hùng',
    phone: '03351288670',
    avatar: 'b97bb0a5-6dff-45e7-a5d1-023827d96013.jpg'
  }
}

const meRequest = rest.get(`${config.baseUrl}me`, (req, res, ctx) => {
  const access_token = req.headers.get('authorization')
  if (access_token === access_token_1s) {
    return res(
      ctx.status(HttpStatusCode.Unauthorized),
      ctx.json({
        message: 'Lỗi',
        data: {
          message: 'Token hết hạn',
          name: 'EXPIRED_TOKEN'
        }
      })
    )
  }
  return res(ctx.status(HttpStatusCode.Ok), ctx.json(meRes))
})

const userRequests = [meRequest]

export default userRequests
