import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addStudent, getStudent, updateStudent } from 'api/students.api'
import { isEqual } from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student } from 'types/common'
import { isAxiosError } from 'utils/utils'

type FormStateType = Omit<Student, 'id'> | Student
const initialFormState: FormStateType = {
  avatar: '',
  email: '',
  first_name: '',
  last_name: '',
  gender: 'other',
  country: '',
  btc_address: ''
}
type FormError =
  | {
      [key in keyof FormStateType]?: string[]
    }
  | null
export default function AddStudent() {
  const [formState, setFormState] = useState<FormStateType>(initialFormState)

  const addMatch = useMatch('/students/add')
  const isAddMode = Boolean(addMatch)

  const queryClient = useQueryClient()
  // func add student mutation
  const addStudentMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addStudent(body)
    }
  })

  const { id } = useParams<{ id: string }>()
  const studentsQuery = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudent(id as string),
    enabled: id !== undefined || !isAddMode,
    // nó sẽ lấy data từ cache nếu có, nếu không có thì mới gọi api sau 10s
    staleTime: 10 * 1000
    // cũng chính là staleTime, nếu data trong cache quá 10s thì mới gọi api. Nên nó không chạy
    // queryFn nếu data trong cache vẫn còn đâu, lấy gì mà gọi api getSudent nữa, nên đoạn "onSuccess" không chạy
    // Nên đoạn này có thể sử dụng useEffect để lấy data từ cache và setFormState
    // onSuccess: (data) => {
    //   console.log('dataget', data.data)
    //   setFormState(data.data)
    // }
  })
  useEffect(() => {
    if (studentsQuery.data) {
      setFormState(studentsQuery.data.data)
    }
  }, [studentsQuery.data])

  // update student
  const updateStudentMutation = useMutation({
    mutationFn: (_) => updateStudent(id as string, formState as Student),
    onSuccess: () => {
      // i used test with queryClient.invalidateQueries and i see it just work with useMutation, but not work with mutate
      queryClient.invalidateQueries(['student', id])
    }
  })

  const errorForm: FormError = useMemo(() => {
    const error = isAddMode ? addStudentMutation.error : updateStudentMutation.error
    if (
      isAxiosError<{
        error: FormError
      }>(error) &&
      error.response?.status === 422
    ) {
      return error.response?.data?.error
    }
    return null
  }, [addStudentMutation, updateStudentMutation, isAddMode])
  if (studentsQuery.isLoading && !isAddMode) {
    return <div>Loading...</div>
  }
  if (!studentsQuery.data && !isAddMode) {
    return <div>Student not found</div>
  }

  // Dùng currying
  const handleChange = (key: keyof FormStateType) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [key]: e.target.value }))
    console.log('errorForm', errorForm)
    if (errorForm) {
      addStudentMutation.reset()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // mutate(formState)
    // setFormState(initialFormState)
    // với case ở trên thì khi submit form thì sẽ reset lại formState, nhưng
    // có 1 vấn đề lớn là nếu server bị delay thì trước khi submit xong thì formState đã bị reset
    // và cái mutate nó là async chứ không phải promise nên nó sẽ không chờ mutate xong mới reset. có 2 cách
    // CÁCH 1: dùng đối số thứ 2 của mutate để reset formState
    // mutate(formState, {
    //   onSuccess: () => {
    //     setFormState(initialFormState)
    //   }
    // })
    // CÁCH 2: dùng reset của useMutation
    // try {
    //   await mutateAsync(formState)
    //   setFormState(initialFormState)
    // } catch (error) {
    //   console.log('error', error)
    // }
    if (isAddMode) {
      addStudentMutation.mutate(formState, {
        onSuccess: (data) => {
          toast.success('Add student successfully')
          console.log('data', data)
          setFormState(initialFormState)
        }
      })
      return
    } else {
      if (isEqual(formState, studentsQuery.data?.data)) {
        toast.error('Nothing change')
        return
      }
      updateStudentMutation.mutate(undefined, {
        onSuccess: (data) => {
          toast.success('Update student successfully')
          console.log('data', data.data)
          // setFormState(data.data)
        }
      })
    }
  }

  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add ' : 'Edit'} Student</h1>
      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='floating_email'
            id='floating_email'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.email}
            onChange={handleChange('email')}
            required
          />
          <label
            htmlFor='floating_email'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Email address
          </label>
          {errorForm && (
            <div className='text-sm text-red-500'>
              <span className='font-medium'>Lỗi</span>
              {errorForm.email}
            </div>
          )}
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <div>
            <div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-1'
                  type='radio'
                  value='Male'
                  checked={formState.gender === 'Male'}
                  onChange={handleChange('gender')}
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-1' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Male
                </label>
              </div>
              <div className='mb-4 flex items-center'>
                <input
                  id='gender-2'
                  type='radio'
                  value='Female'
                  checked={formState.gender === 'Female'}
                  onChange={handleChange('gender')}
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-2' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Female
                </label>
              </div>
              <div className='flex items-center'>
                <input
                  id='gender-3'
                  type='radio'
                  value='other'
                  checked={formState.gender === 'other'}
                  onChange={handleChange('gender')}
                  name='gender'
                  className='h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600'
                />
                <label htmlFor='gender-3' className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
                  Other
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='country'
            id='country'
            value={formState.country}
            onChange={handleChange('country')}
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            required
          />
          <label
            htmlFor='country'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Country
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='tel'
              name='first_name'
              id='first_name'
              value={formState.first_name}
              onChange={handleChange('first_name')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='first_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              First Name
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='last_name'
              id='last_name'
              value={formState.last_name}
              onChange={handleChange('last_name')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='last_name'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Last Name
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              value={formState.avatar}
              onChange={handleChange('avatar')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='avatar'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Avatar Base64
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='btc_address'
              id='btc_address'
              value={formState.btc_address}
              onChange={handleChange('btc_address')}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              required
            />
            <label
              htmlFor='btc_address'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              BTC Address
            </label>
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
        >
          {isAddMode ? 'Add' : 'Update'}
        </button>
      </form>
    </div>
  )
}
