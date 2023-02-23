import React from 'react'
import type { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
}
export default function Input({
  autoComplete,
  type,
  errorMessage,
  placeholder,
  className,
  classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
  name,
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  register,
  ...rest
}: Props) {
  const registerResult = register && name ? register(name, rest.rules) : {}
  return (
    <div className={className}>
      <input
        type={type}
        autoComplete={autoComplete}
        className={classNameInput}
        placeholder={placeholder}
        {...registerResult}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
