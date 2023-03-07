import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { omitBy, isUndefined } from 'lodash'
import productApi from 'src/apis/product.api'

import useQueryParam from 'src/hooks/useQueryParam'
import { ProductListConfig } from 'src/types/product.type'
import AsideFilter from './components/AsideFilter'
import Product from './components/Product/Product'
import SortProductList from './components/SortProductList'
import categoryApi from 'src/apis/categoriest'
import Page from 'src/components/PaginationAnt'
import { Pagination as PaginationAnt } from 'antd'
import Pagination from 'src/components/Pagination'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function ProductList() {
  const DEFAULT_PARAMS = {
    page: 1,
    limit: 10
  }
  const [params, setParams] = useState(DEFAULT_PARAMS)

  const queryParam: QueryConfig = useQueryParam()

  // console.log('queryParam', queryParam)
  // Explain: hear, we use lodash to omit undefined value in queryParam.
  //Because we don't want to send undefined value to server
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
      name: queryParam.name,
      category: queryParam.category
    },
    isUndefined
  )
  // Product list use query to get data from server
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    // queryKey: ['products', params],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
      // return productApi.getProducts(params)
    },
    // keep previous data when refetching not laq when click or change page
    keepPreviousData: true
  })

  // Product list use query to get data from server
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })

  console.log(productsData?.data.data)
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
          </div>

          {productsData && (
            <div className='sticky z-10 col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              {/* note: if notication show Type 'number | undefined' is not assignable to type 'number'.
              Because productsQuery can be undefined, so we need to check it. should give move check "data" to the over of the code
              */}
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              {/* <PaginationAnt
                showSizeChanger
                onChange={(page, pageSize) => {
                  setParams({ page, limit: pageSize })
                }}
                pageSize={params.limit}
                current={params.page}
                total={55}
              /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
