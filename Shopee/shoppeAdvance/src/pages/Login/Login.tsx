import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { loginAccount } from 'src/apis/auth.api'
import Input from 'src/components/Input'
import { ResponseAPI } from 'src/types/utils.type'
import { ILoginSchema, loginSchema } from 'src/utils/rules'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'

export default function Login() {
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors }
  } = useForm<ILoginSchema>({
    resolver: yupResolver(loginSchema)
  })

  // loginAccount Mutation
  const loginAccountMutation = useMutation({
    mutationFn: (body: ILoginSchema) => {
      return loginAccount(body)
    }
  })

  // handle submit
  const onSubmit = handleSubmit(
    (data) => {
      loginAccountMutation.mutate(data, {
        onSuccess: (data) => {
          console.log('data', data.data.data)
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ResponseAPI<ILoginSchema>>(error)) {
            const formError = error.response?.data?.data
            if (formError) {
              Object.keys(formError).forEach((key) => {
                setError(key as keyof ILoginSchema, {
                  type: 'Server',
                  message: formError[key as keyof ILoginSchema]
                })
              })
            }
          }
        }
      })
    },
    (error) => {
      console.log('error', error)
    }
  )

  return (
    <div className='h-[600px] bg-orange'>
      <div className='container bg-shopee bg-contain bg-center bg-no-repeat'>
        <div className='grid grid-cols-1 py-12 lg:h-[470px] lg:grid-cols-5 lg:pr-10'>
          <div className='md:col-span-2 md:col-start-4 md:mx-8'>
            <form className='rounded bg-white p-10 shadow-sm' onSubmit={onSubmit}>
              <div className='text-2xl'>Login</div>
              <Input
                className='mt-6'
                type='email'
                placeholder='Email'
                name='email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                className='my-2'
                type='password'
                placeholder='password'
                name='password'
                register={register}
                errorMessage={errors.password?.message}
              />
              <button className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'>
                Login
              </button>
              <div className='mt-9 flex items-center justify-center gap-1 text-center'>
                <span className='text-gray-400'>Do not have an account?</span>
                <Link to='/register' className='text-red-400'>
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
