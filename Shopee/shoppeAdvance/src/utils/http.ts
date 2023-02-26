import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import path from 'src/constants/path'
import { setAccessTokenToLS, getAccessTokenFromLS, clearLS, setProfileToLS } from './auth'
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from 'src/apis/auth.api'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    // why do we need to use this.accessToken = getAccessTokenFromLS() here?
    // because when getdata from localstorage(hard drive) ALWAYS SLOWER than get accessToken from (Ram)
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    // Add a request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken

          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        console.log('url', url, URL_LOGIN, URL_LOGOUT, URL_REGISTER)
        if (url?.includes(URL_LOGIN) || url?.includes(URL_REGISTER)) {
          console.log('response', response)
          const dataResponse = response.data as AuthResponse
          this.accessToken = dataResponse.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(dataResponse.data.user)
        } else if (url?.includes(path.logout)) {
          console.log('did logout')
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          console.log('error', data?.message, error.message)
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
