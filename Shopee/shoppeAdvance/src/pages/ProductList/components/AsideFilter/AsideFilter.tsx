import clsx from 'clsx'
import { useForm, Controller } from 'react-hook-form'
import { AiFillStar } from 'react-icons/ai'
import { CiFilter } from 'react-icons/ci'
import { TfiMenuAlt } from 'react-icons/tfi'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import path from 'src/constants/path'
import { Category } from 'src/types/category.type'

import { schema } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from 'src/types/utils.type'
import RatingStars from '../RatingStars/RatingStarts'
import omit from 'lodash/omit'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}
/*
 * Rules validate for form
 * If have price_min and price_max, price_min must be less than price_max
 * If have price min can haven't price max and vice versa
 */
// type FormData = {
//   price_min: string
//   price_max: string
// }
type FormData = NoUndefinedField<Pick<QueryConfig, 'price_min' | 'price_max'>>
/*
 * 1. pick only price_min and price_max
 * 2. use yupResolver to validate
 * 3. use shouldFocusError: false to prevent focus on error
 * 4. use trigger to trigger validation
 * 5. use handleSubmit to handle submit
 * 6. use navigate to navigate to new url with new query params
 * 7. use createSearchParams to create new query params
 * 8. use path.home to get home path
 * 9. use queryConfig to get current query params
 */
const priceSchema = schema.pick(['price_min', 'price_max'])
export default function AsideFilter({ categories, queryConfig }: Props) {
  const { category } = queryConfig
  const {
    control,
    trigger,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })
  const navigate = useNavigate()
  // console.log('errors', errors)
  // console.log('categories', category, categories)
  // handle submit
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })
  // demo error
  // (error: any) => {
  //   console.log('error', error)
  //   error.price_max?.ref?.focus()
  // })

  const handleRemoveAll = () => {
    // on reset to reset form
    reset()
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }
  return (
    <div className='sticky top-[8rem] rounded-sm border-2 py-4'>
      <Link to={path.home} className=' flex items-center font-bold'>
        <TfiMenuAlt className='mr-3 h-4 w-3 fill-current' />
        <span>All Products</span>
      </Link>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <ul className='pl-2'>
        {categories.map((categoryItem) => {
          const isActive = categoryItem._id === category
          return (
            <li key={categoryItem._id} className='py-2'>
              <Link
                to={{
                  pathname: path.home,
                  // when we use searchParams, we need to convert it to string and
                  // spread properties of queryConfig( it have query params exits)
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={clsx('relative flex items-center px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='tp[-1 absolute left-[-10px] mr-2 h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}
                <span>{categoryItem.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='mt-4 flex items-center font-bold'>
        <CiFilter className='mr-3 h-4 w-3 fill-current' />
        <span>Filter</span>
      </Link>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <div className='my-4'>
        <div className='mb-2 text-sm'>Range Price</div>
        <form className='m2-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='from'
                    classNameError='hidden'
                    placeholder='₫ MIN'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_max')
                    }}
                    value={field.value}
                    // because we use react-hook-form, we need to use ref
                    // however, we can't pass ref of InputNumber, so we must convert component to -- forwardRef -- should pass ref
                    ref={field.ref}
                    classNameInput='p-1 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                    // take note: here, we can use {...field} to pass all properties of field to InputNumber ( you can click to see properties of field)
                  />
                )
              }}
            />
            <div className='mx-2 mt-1 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='from'
                    placeholder='₫ MAX'
                    classNameError='hidden'
                    onChange={(e) => {
                      field.onChange(e)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameInput='p-1 w-full rounded-sm border border-gray-300 outline-none focus:border-gray-500 focus:shadow-sm'
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.5rem] text-sm text-red-600'>{errors.price_min?.message}</div>
          <Button className='w-full items-center justify-center rounded-sm bg-orange p-2 text-sm uppercase text-white hover:bg-orange/90'>
            Apply
          </Button>
        </form>
      </div>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <div className='my-4'>
        <div className='text-sm'>Review</div>
        <RatingStars queryConfig={queryConfig} />
      </div>
      <div className='mt-4 mb-2 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
