import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { ILoginSchema, loginSchema } from 'src/utils/rules'

export default function Login() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm<ILoginSchema>({
    resolver: yupResolver(loginSchema)
  })

  // handle submit
  const onSubmit = handleSubmit(
    (data) => {
      console.log('data', data)
    },
    (error) => {
      console.log('error', error)
    }
  )

  return (
    <div className='h-[600px] bg-orange'>
      <div className='container bg-shopee bg-contain bg-center bg-no-repeat'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
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
              <div className='mt-8 flex items-center justify-center gap-1 text-center'>
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
