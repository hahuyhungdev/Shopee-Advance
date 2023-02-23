import { useQuery } from '@tanstack/react-query'
import React from 'react'
import productApi from 'src/apis/product.api'
import useQueryParam from 'src/hooks/useQueryParam'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import SortProductList from './SortProductList'

export default function ProductList() {
  const queryParam = useQueryParam()
  const productsQuery = useQuery({
    queryKey: ['products', queryParam],
    queryFn: () => {
      return productApi.getProducts(queryParam)
    }
  })
  console.log('data', productsQuery.data)
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter />
          </div>
          <div className='col-span-9'>
            <SortProductList />
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {productsQuery.data?.data?.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
