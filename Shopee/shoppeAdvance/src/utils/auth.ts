import { User } from 'src/types/user.type'

export const setAccessTokenToLS = (accessToken: string) => {
  localStorage.setItem('accessToken', accessToken)
}

export const clearLS = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('accessToken') || ''
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
