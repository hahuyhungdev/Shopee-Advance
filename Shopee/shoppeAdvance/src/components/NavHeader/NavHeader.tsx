import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from 'src/contexts/app.context'
import path from 'src/constants/path'
import Popover from '../Popover'
import authApi from 'src/apis/auth.api'
import { toast } from 'react-toastify'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { purchasesStatus } from 'src/constants/purchase'

function NavHeader() {
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  console.log('isAuthenticated', isAuthenticated)
  const queryClient = useQueryClient()
  const logoutMutation = useMutation({
    mutationFn: () => {
      return authApi.logoutAccount()
    },
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      toast.success('Logout success')
      // case : when logout then remove all queries. if not, although logout but still have data in cache at the Cart
      // The removeQueries method can be used to remove queries from the cache based on their query keys or any other functionally accessible property/state of the query.
      queryClient.removeQueries(['purchases', { status: purchasesStatus.inCart }])
    }
  })
  // handle logout mutate
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex justify-start gap-x-3'>
        <p>Seller Cente</p>
        <p>Download</p>
        <div className='flex'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='mx-1'>Vietnamese</span>
        </div>
      </div>
      <div className='flex justify-end'>
        <Popover
          as={'span'}
          className='relative flex cursor-pointer items-center py-1 hover:text-gray-300'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <div className='flex flex-col py-2 pl-3 pr-28'>
                <button className='py-2 px-3 text-left hover:text-orange'>Vietnamese</button>
                <button className='py-2 px-3 text-left hover:text-orange'>English</button>
              </div>
            </div>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
            />
          </svg>
          <span className='mx-1'>Vietnamese</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
          </svg>
        </Popover>
        {isAuthenticated && (
          <Popover
            className='ml-6 flex cursor-pointer items-center py-1 hover:text-gray-300'
            renderPopover={
              <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                <Link to={path.profile} className='block w-full bg-white py-3 px-4 text-left hover:text-cyan-500'>
                  My Account
                </Link>
                <Link to='' className='block w-full bg-white py-3 px-4 text-left hover:text-cyan-500'>
                  My Purchase
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full bg-white py-3 px-4 text-left hover:text-cyan-500'
                >
                  Logout
                </button>
              </div>
            }
          >
            <div className='mr-2 h-5 w-5 flex-shrink-0'>
              <img
                src='https://cf.shopee.vn/file/3338b44837eeaa51d47863a1bf236286_tn'
                alt='avatar'
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <p>{profile?.email}</p>
          </Popover>
        )}
        {!isAuthenticated && (
          <div className='flex items-center'>
            <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
              Register
            </Link>
            <div className='h-4 border-r-[1px] border-white/40' />
            <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavHeader
