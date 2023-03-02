import React from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}
export default function Input({
  errorMessage,
  className,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  name,
  rules,
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  register,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rules) : {}
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...registerResult} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
