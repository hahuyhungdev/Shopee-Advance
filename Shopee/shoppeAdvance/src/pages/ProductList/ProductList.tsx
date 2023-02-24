import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { omitBy, isUndefined } from 'lodash'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryParam from 'src/hooks/useQueryParam'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function ProductList() {
  const queryParam: QueryConfig = useQueryParam()

  // Explain: hear, we use lodash to omit undefined value in queryParam. Because we don't want to send undefined value to server
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParam.page || '1',
      limit: queryParam.limit,
      sort_by: queryParam.sort_by,
      order: queryParam.order,
      exclude: queryParam.exclude,
      rating_filter: queryParam.rating_filter,
      price_max: queryParam.price_max,
      price_min: queryParam.price_min,
      name: queryParam.name
    },
    isUndefined
  )

  const productsQuery = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    // keep previous data when refetching not laq when click or change page
    keepPreviousData: true
  })

  console.log(queryConfig)
  // console.log('data', productsQuery.data?.data.data.products)
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>

          {productsQuery.data && (
            <div className='col-span-9'>
              <SortProductList />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsQuery.data.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* note: if notication show Type 'number | undefined' is not assignable to type 'number'.
              Because productsQuery can be undefined, so we need to check it. should give move check "data" to the over of the code
              */}
              <Pagination queryConfig={queryConfig} pageSize={productsQuery.data?.data.data.pagination.page_size} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
