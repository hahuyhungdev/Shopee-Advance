import { Student, StudentList } from 'types/common'
import http from 'utils/http'

export const getStudents = (page: number | string = 1, limit: number | string = 10) => {
  return http.get<StudentList>('students', {
    params: {
      _page: page,
      _limit: limit
    }
  })
}
export const addStudent = (student: Omit<Student, 'id'>) => {
  // add type later http.post beacuse it is not returning anything, it is just adding a new student response
  return http.post<Student>('students', student)
}
