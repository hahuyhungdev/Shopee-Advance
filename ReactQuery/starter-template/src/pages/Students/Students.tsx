import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'api/students.api'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Student } from 'types/common'
import { useQueryString } from 'utils/utils'
const LIMIT = 10
export default function Students() {
  const queryString = useQueryString()
  const page = Number(queryString.page) || 1
  const studentsQuery = useQuery({
    queryKey: ['students', page],
    // query signal for cancel request manual
    // queryFn: ({ signal }) => getStudents(page, LIMIT, signal),
    // query signal for cancel request automation
    // however retry 3 times when request fail
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 3000)
      return getStudents(page, LIMIT, controller.signal)
    },
    // default is 3 times when request fail. feature of tanstack/react-query
    retry: 1,
    //save data in cache and better for ux pagination
    keepPreviousData: true
  })

  const queryClient = useQueryClient()

  // delete student mutation
  const deleteStudentMutation = useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: (_, id) => {
      // refetch data
      // exact: true để xác định queryKey cụ thể
      /*
      This means that if you have multiple queries related to the students resource, only the query with the exact ['students', page] key will be removed from the cache (with exact: true )
       If exact were set to false, all queries with keys that partially match ['students', page] would be removed from the cache.
      */
      queryClient.invalidateQueries({ queryKey: ['students', page], exact: true })
      toast.success(`Delete student ${id} successfully`)
    }
  })

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id)
  }

  // trong useQuery có options là onSuccess, nếu muốn dùng thì thay vì dùng useEffect thì dùng onSuccess (tùy case)
  // useEffect(() => {
  //   if (dataStudents) {
  //     setStudents(dataStudents.data)
  //   }
  // }, [dataStudents])
  const totalStudentsCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)

  // handle prefetch student when hover on show info student (howerver on save cache with staleTime and use Effect to get data with useState)
  const handlePrefetch = (id: number) => {
    // queryClient.prefetchQuery(['student', String(id)], {
    //   queryFn: () => getStudent(id),
    //   // used for cache data
    //   staleTime: 10 * 1000 // 10s
    // })
  }

  const fetchStudent = (second: number) => {
    const id = '6'
    queryClient.prefetchQuery(['student', id], {
      queryFn: () => getStudent(id),
      staleTime: second * 1000 // 10s
    })
  }

  const refetchStudents = () => {
    studentsQuery.refetch()
  }

  // cancel request manual with queryClient.cancelQueries
  const cancelRequest = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
    // although cancel request, howerver axios still send request to server with status 200
    // should handle in server, us can use axios cancel with queryFn and pass signal to axios
    // at api student.api.ts . i wil add parameter signal and when call api, i will pass argument signal
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <button className='mt-6 rounded bg-blue-500 px-5 py-2' onClick={() => fetchStudent(5)}>
        click 10s
      </button>
      <button className='mt-6 rounded bg-blue-500 px-5 py-2' onClick={() => fetchStudent(3)}>
        click 2s
      </button>
      <button onClick={() => refetchStudents()} className='mt-6 rounded bg-pink-700 px-5 py-2'>
        refetch students
      </button>
      <button onClick={() => cancelRequest()} className='mt-6 rounded bg-pink-700 px-5 py-2'>
        Cancel request students
      </button>
      <div className='mt-6'>
        <Link
          to='/students/add'
          className='rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300'
        >
          Add Student
        </Link>
      </div>

      {studentsQuery.isLoading ? (
        <div>
          <div role='status' className='mt-6 animate-pulse'>
            <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
            <span className='sr-only'>Loading...</span>
          </div>
        </div>
      ) : (
        <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  #
                </th>
                <th scope='col' className='py-3 px-6'>
                  Avatar
                </th>
                <th scope='col' className='py-3 px-6'>
                  Name
                </th>
                <th scope='col' className='py-3 px-6'>
                  Email
                </th>
                <th scope='col' className='py-3 px-6'>
                  <span className='sr-only'>Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsQuery.data?.data.map((student) => (
                <tr
                  key={student.id}
                  className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                  onMouseEnter={() => handlePrefetch(student.id)}
                >
                  <td className='py-4 px-6'>{student.id}</td>
                  <td className='py-4 px-6'>
                    <img src={student.avatar} alt='student' className='h-5 w-5' />
                  </td>
                  <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                    {student.last_name}
                  </th>
                  <td className='py-4 px-6'> {student.email}</td>
                  <td className='py-4 px-6 text-right'>
                    <Link
                      to={`/students/${student.id}`}
                      className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className='font-medium text-red-600 dark:text-red-500'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className='mt-6 flex justify-center'>
        <nav aria-label='Page navigation example'>
          <ul className='inline-flex -space-x-px'>
            <li>
              {page === 1 ? (
                <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Previous
                </span>
              ) : (
                <Link
                  to={`/students?page=${page - 1}`}
                  className='rounded-l-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Previous
                </Link>
              )}
            </li>
            {Array.from({ length: totalPage }, (_, index) => {
              const currentPage = index + 1
              return (
                <li key={currentPage}>
                  <Link
                    to={`/students?page=${currentPage}`}
                    className={`${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    } border border-gray-300  bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:text-gray-700`}
                  >
                    {currentPage}
                  </Link>
                </li>
              )
            })}
            <li>
              {/* <a
                className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                href='/students?page=1'
              >
                Next
              </a> */}
              {page === totalPage ? (
                <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
                  Next
                </span>
              ) : (
                <Link
                  to={`/students?page=${page + 1}`}
                  className='rounded-r-lg border border-gray-300 bg-white py-2 px-3 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                >
                  Next
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
