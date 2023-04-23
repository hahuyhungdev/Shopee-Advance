import { User } from './user.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  access_token: string
  refresh_token: string
  expires: number
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenRespone = SuccessResponse<{
  access_token: string
}>
