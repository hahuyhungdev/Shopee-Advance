import { User } from './user.type'
import { ResponseAPI } from './utils.type'

export type AuthResponse = ResponseAPI<{
  access_token: string
  refresh_token: string
  expires: number
  expires_refresh_token: number
  user: User[]
}>
