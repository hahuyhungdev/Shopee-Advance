import { User } from 'src/types/user.type'

export const localStorageEventTarget = new EventTarget()

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}
export const setRefreshTokenToLS = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken)
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('profile')
  const clearLSEvent = new Event('clearLS')
  localStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('accessToken') || ''
}
export const getRefreshTokenFromLS = () => {
  return localStorage.getItem('refreshToken') || ''
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  // because result is json, so we need to parse it to object
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  // because profile is object, so we need to converts a js value stringify it to json
  localStorage.setItem('profile', JSON.stringify(profile))
}
