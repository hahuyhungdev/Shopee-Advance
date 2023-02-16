import { Student, StudentList } from 'types/common'
import http from 'utils/http'

export const getStudents = (page: number | string = 1, limit: number | string = 10, signal?: AbortSignal) => {
  return http.get<StudentList>('students', {
    params: {
      _page: page,
      _limit: limit
    },
    signal
  })
}
// get one student
export const getStudent = (id: string | number) => {
  return http.get<Student>(`students/${id}`)
}

// add new student
export const addStudent = (student: Omit<Student, 'id'>) => {
  // add type later http.post beacuse it is not returning anything, it is just adding a new student response
  return http.post<Student>('students', student)
}

// update student
export const updateStudent = (id: string | number, student: Student) => {
  return http.put<Student>(`students/${id}`, student)
}

// delete student
export const deleteStudent = (id: string | number) => {
  return http.delete<{}>(`students/${id}`)
}
