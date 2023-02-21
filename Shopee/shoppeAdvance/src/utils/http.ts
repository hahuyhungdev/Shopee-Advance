import axios, { AxiosError, AxiosInstance, HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import { saveAccessTokenToLS, getAccessTokenFromLS, clearAccessTokenFromLS } from './auth'

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
        console.log('interceptors response', response)
        if (url?.includes('login' || 'register')) {
          console.log('response', response)
          this.accessToken = (response.data as AuthResponse).data.access_token
          console.log('this.accessToken', this.accessToken)
          saveAccessTokenToLS(this.accessToken)
        } else if (url?.includes('logout')) {
          console.log('logout', this)
          this.accessToken = ''
          clearAccessTokenFromLS()
        }
        return response
      },
      function (error: AxiosError) {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any | undefined = error.response?.data
          const message = data?.message || error.message
          toast.error(message)
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
