import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import Input from 'src/components/Input'
import { ISchema, schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'

export default function Register() {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors }
  } = useForm<ISchema>({
    resolver: yupResolver(schema)
  })

  // const rules = getRulse(getValues)

  // handle submit
  const onSubmit = handleSubmit(
    (data) => {
      console.log('data', data)
    },
    (error) => {
      console.log('error', error)
      const password = getValues('password')
      console.log('password', password)
    }
  )
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='md:col-span-2 md:col-start-4'>
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
                type='password'
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
              <button className='w-full bg-red-500 py-4 px-2 text-center text-sm uppercase text-white hover:bg-red-600'>
                Đăng ký
              </button>
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
