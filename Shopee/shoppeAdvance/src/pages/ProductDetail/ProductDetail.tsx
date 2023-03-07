import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import productApi from 'src/apis/product.api'
import ProductRating from 'src/components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import { CiCircleQuestion } from 'react-icons/ci'
import Popover from 'src/components/Popover'
import InputNumber from 'src/components/InputNumber'
import DOMPurify from 'dompurify'
import { Product as ProductType, ProductListConfig } from 'src/types/product.type'
import Product from '../ProductList/components/Product'
export default function ProductDetail() {
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')

  // get productId from url
  const { productId } = useParams()
  const id = getIdFromNameId(productId as string)
  // Product flow id use query to get data from server
  const { data: ProductDetailData } = useQuery({
    queryKey: ['ProductDetail', id],
    queryFn: () => {
      return productApi.getProductDetail(id)
    }
  })
  const imageRef = useRef<HTMLImageElement>(null)
  const product = ProductDetailData?.data.data

  // get products by category same product
  const queryConfig: ProductListConfig = {
    limit: 20,
    page: 1,
    category: product?.category._id
  }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    // when product have dave then query call
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })
  console.log('productsData', productsData?.data.data.products)
  // set current images
  const currentImages = useMemo(() => {
    if (!product) return []
    return product ? product.images.slice(...currentIndexImages) : []
  }, [currentIndexImages, product])

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  const chooseActive = (img: string) => {
    setActiveImage(img)
  }
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const react = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // now here, we have 2 ways to calculate the position of the image
    // 1. use the offset(offsetX, offsetY to event.navtiveEvent) of the mouse to the component. When we did handle "bubble event"
    // const { offsetX, offsetY } = event.nativeEvent
    // 2. get offsetX, offsetY when we not handle "bubble event". Now, we dont need to use "pointer-events: none" to identify the image
    const offsetX = event.pageX - (react.x + window.scrollX)
    const offsetY = event.pageY - (react.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / react.height)
    const left = offsetX * (1 - naturalWidth / react.width)
    console.log(top, left)
    image.style.width = `${naturalWidth}px`
    image.style.height = `${naturalHeight}px`
    image.style.top = `${top}px`
    image.style.left = `${left}px`
    image.style.maxWidth = 'unset'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <title>{product.name} | Shopee Clone</title>
      <div className='container max-w-[1200px]'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5 cursor-pointer'>
              {/* The "pointer-events" CSS property sets under what circumstances (if any) a particular graphic element can
              become the target of pointer events. */}
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className=' absolute inset-0 h-full w-full object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={prev}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((image) => {
                  const isActive = activeImage === image
                  return (
                    <div
                      className='relative w-full pt-[100%] shadow'
                      key={image}
                      onMouseEnter={() => chooseActive(image)}
                    >
                      <img
                        src={image}
                        alt={image}
                        className='absolute inset-0 h-full w-full cursor-pointer object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-red-500' />}
                    </div>
                  )
                })}
                <button
                  onClick={next}
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-3 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='h-4 w-4 fill-orange text-yellow-300'
                    nonActiveClassname='h-4 w-4 stroke-current text-[#ee4d2d] fill-white'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className='flex'>
                  <span>{formatNumberToSocialStyle(product.view)}</span>
                  <span className='ml-1 text-gray-500'>Ratings</span>
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div className='flex'>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Sold</span>
                </div>

                <Popover
                  className='relative flex cursor-pointer items-center py-1 hover:text-gray-300'
                  renderPopover={
                    <div className='relative rounded-sm border border-gray-200 bg-white p-6 text-gray-500 shadow-md'>
                      <div className='break-words text-left text-sm '>{product.sold} sold in Vietnam</div>
                      <div className='break-words text-left text-sm '>{product.sold} sold globally *</div>
                      <p>This product is also sold in other regions on Shopee platform.</p>
                    </div>
                  }
                  placement='bottom'
                >
                  Info
                  {/* <CiCircleQuestion className='ml-2 h-5 w-5 fill-gray-500' /> */}
                </Popover>
              </div>
              <div className='mt-3 flex items-center bg-gray-50 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold text-white'>
                  {rateSale(product.price_before_discount, product.price)} OFF
                </div>
              </div>
              <div className='mt-3 flex items-center gap-x-4'>
                <div className='capitalize text-gray-500'>Quantity</div>
                <div className='flex items-center'>
                  <div className='flex items-center '>
                    <button className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
                      </svg>
                    </button>
                    <InputNumber
                      className=''
                      value={1}
                      classNameError='hidden'
                      classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
                    />
                    <button className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1.5}
                        stroke='currentColor'
                        className='h-4 w-4'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
                      </svg>
                    </button>
                  </div>
                  <div className='ml-5 text-sm text-gray-500'>{product.quantity} pieces available</div>
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <button className='flex h-12 cursor-pointer items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'>
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Add to cart
                </button>
                <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                  Buy now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container max-w-[1200px]'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounder-sm bg-gray-50 p-2 text-lg capitalize text-slate-700'>Description</div>
          <div className='mx-4 mt-4 mb-4 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          </div>
        </div>
        <div className='mt-8'>
          <div className='uppercase text-gray-400'>MAYBE YOU ALSO LIKE</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-3 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
