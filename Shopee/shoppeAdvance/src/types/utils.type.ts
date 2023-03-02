export interface ErrorResponse<Data> {
  message: string
  data?: Data
}
export interface SuccessResponse<Data> {
  message: string
  data: Data
}

// syntax '-?' will remove property undefined of key optional
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
