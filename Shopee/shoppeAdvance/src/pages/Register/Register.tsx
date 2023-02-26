import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { omit } from 'lodash'
import { Schema, schema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { SuccessResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'

type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
export const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export default function Register() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  // registerMutations
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<Schema, 'confirm_password'>) => {
      return authApi.registerAccount(body)
    }
  })
  // handle submit
  const onSubmit = handleSubmit((data) => {
    console.log('data', data)
    console.log('errors', errors)
    const body = omit(data, ['confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        console.log('dataRegister Mutation', data)
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<SuccessResponse<Omit<Schema, 'confirm_password'>>>(error)) {
          const formError = error.response?.data?.data
          // case 1
          // if (formError?.email) {
          //   // after setError, the error will be show in the input of error response from server
          //   setError('email', {
          //     type: 'Server',
          //     message: formError.email
          //   })
          // }

          // but in case have many error, we can use Object.keys to loop all error
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                type: 'Server',
                message: formError[key as keyof Omit<FormData, 'confirm_password'>]
              })
            })
          }
        } else {
          console.log('error', error)
        }
      }
    })
  })
  return (
    <div className='h-[600px] bg-orange'>
      <div className='container bg-shopee bg-contain bg-center bg-no-repeat'>
        <div className='grid grid-cols-1 py-12 lg:h-[470px] lg:grid-cols-5 lg:pr-10'>
          <div className='md:col-span-2 md:col-start-4 md:mx-8'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Register</div>
              <Input
                className='mt-6'
                type='email'
                placeholder='Email'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-2'
                type='text'
                placeholder='password'
                name='password'
                register={register}
                autoComplete='on'
                errorMessage={errors.password?.message}
              />
              <Input
                className='my-2'
                type='password'
                placeholder='confirm_password'
                name='confirm_password'
                register={register}
                autoComplete='on'
                errorMessage={errors.confirm_password?.message}
              />
              <Button
                isLoading={registerAccountMutation.isLoading}
                disabled={registerAccountMutation.isLoading}
                className='flex w-full justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
              >
                Đăng ký
              </Button>
              <div className='mt-8 flex items-center justify-center gap-1 text-center'>
                <span className='text-gray-400'>Do you have an account?</span>
                <Link to='/login' className='text-red-400'>
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
