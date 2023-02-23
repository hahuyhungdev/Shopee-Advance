import React from 'react'
import { Link } from 'react-router-dom'

export default function SortProductList() {
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className='h-8 rounded-sm bg-orange px-4 text-center 
              text-sm capitalize text-white hover:bg-orange/80'
          >
            Phổ biến
          </button>
          <button className='h-8 rounded-sm bg-orange px-4 text-center text-sm capitalize text-white hover:bg-orange/80'>
            Mới nhất
          </button>
          <button
            className='h-8 rounded-sm bg-orange px-4 text-center text-sm
              capitalize text-white hover:bg-orange/80'
          >
            Bán chạy
          </button>
          <select
            defaultValue=''
            className='h-8 rounded-sm bg-orange px-4 text-left text-sm  capitalize 
              text-white outline-none hover:bg-orange/80'
          >
            <option value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option className='bg-white text-black'>Giá: Thấp đến cao</option>
            <option className='bg-white text-black'>Giá: Cao đến thấp</option>
          </select>
        </div>

        <div className='flex items-center'>
          <div>
            <span className='text-orange'>1</span>/<span>9</span>
          </div>
          <div className='ml-2 flex'>
            <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </span>

            <Link
              to='s'
              className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
