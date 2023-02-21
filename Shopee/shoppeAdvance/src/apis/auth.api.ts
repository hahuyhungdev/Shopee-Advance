import { AuthResponse } from 'src/types/auth.type'
import http from 'src/utils/http'

export const registerAccount = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/register', body)
}

// loginAccount is a function
export const loginAccount = (body: { email: string; password: string }) => {
  return http.post<AuthResponse>('/login', body)
}
