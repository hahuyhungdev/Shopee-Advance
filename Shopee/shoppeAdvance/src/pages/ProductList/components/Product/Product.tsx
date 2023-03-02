import React from 'react'
import { Link } from 'react-router-dom'
import { IconStar } from 'src/components/Icons'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/utils/utils'

interface Props {
  product: ProductType
}
export default function Product({ product }: Props) {
  return (
    <Link to='/'>
      <div
        className='overflow-hidden rounded-sm bg-white shadow transition-transform
      duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'
      >
        {/* Explain: why used pt-100% ? Because we want to make image have ratio 1:1. And set absolute with top, left, right, bottom is 0. And set width, height is 100%. */}
        <div className='relative w-full pt-[100%]'>
          <img src={product.image} alt={product.name} className='absolute inset-0 h-full w-full object-cover' />
        </div>
        <div className='overflow-hidden p-2'>
          {/* Because property(class) truncate just handle one line, but we need 2 lines or mutiple lines. It's used line-clamp */}
          <div className='min-h-[2.4rem] line-clamp-2'>
            <span className='text-xs font-semibold'>{product.name}</span>
          </div>
          <div className='mt-2 flex justify-start gap-2'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{product.price_before_discount}</span>
            </div>
            <div className='max-w-[50%] truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-2 flex items-center justify-end'>
            <ProductRating rating={product.rating} />
            <div className='ml-2'>
              <span className='text-xs'>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1 text-xs'>sold</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
