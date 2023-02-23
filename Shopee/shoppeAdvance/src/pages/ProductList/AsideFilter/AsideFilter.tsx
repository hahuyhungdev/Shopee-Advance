import React from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { TfiMenuAlt } from 'react-icons/tfi'
import { CiFilter } from 'react-icons/ci'
import Input from 'src/components/Input'
import Button from 'src/components/Button'
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'

export default function AsideFilter() {
  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <TfiMenuAlt className='mr-3 h-4 w-3 fill-current' />
        <span>All Products</span>
      </Link>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <ul>
        <li className='py-2 pl-2'>
          <Link to={path.home} className='relative flex items-center px-2 font-semibold text-orange'>
            <svg viewBox='0 0 4 7' className='tp[-1 absolute left-[-10px] mr-2 h-2 w-2 fill-orange'>
              <polygon points='4 3.5 0 0 0 7' />
            </svg>
            <span>Men Fashion</span>
          </Link>
        </li>
        <li className='pl-2'>
          <Link to={path.home} className='relative flex items-center px-2 text-orange'>
            <span>Telephone</span>
          </Link>
        </li>
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold'>
        <CiFilter className='mr-3 h-4 w-3 fill-current' />
        <span>Filter</span>
      </Link>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <div className='my-4'>
        <div className='mb-2 text-sm'>Range Price</div>
        <form className='m2-2'>
          <div className='flex items-start'>
            <Input
              type='text'
              className='grow'
              name='from'
              placeholder='₫ MIN'
              classNameInput='p-1 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
            />
            <div className='mx-2 mt-1 shrink-0'>-</div>
            <Input
              type='text'
              className='grow'
              name='from'
              placeholder='₫ MAX'
              classNameInput='p-1 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
            />
          </div>
          <Button className='w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white hover:bg-orange/90'>
            Apply
          </Button>
        </form>
      </div>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <div className='my-4'>
        <div className='text-sm'>Review</div>
        <ul className='my-1'>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <li className='py-1 px-1' key={index}>
                <Link to={path.home} className='flex items-center'>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <AiFillStar key={index} className='mr-[3px] h-4 w-4 fill-[#ffad27]' />
                    ))}
                  <span>UP</span>
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <Button className='w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white hover:bg-orange/90'>
        Delete All
      </Button>
    </div>
  )
}
