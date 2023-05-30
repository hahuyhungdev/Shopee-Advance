import { yupResolver } from '@hookform/resolvers/yup'
import omit from 'lodash/omit'
import React from 'react'
import { useForm } from 'react-hook-form'
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { SchemaCommon, schemaCommon } from 'src/utils/rules'
import useQueryConfig from './useQueryConfig'

function useSearchProduct() {
  type formData = SchemaCommon
  const nameSchema = schemaCommon
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: queryConfig.name || ''
    },
    resolver: yupResolver(nameSchema)
  })
  const onSubmitSearch = handleSubmit((data: formData) => {
    console.log('data', data)
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by']
        )
      : {
          ...queryConfig,
          name: data.name
        }
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString()
    })
  })
  return { register, onSubmitSearch }
}

export default useSearchProduct
