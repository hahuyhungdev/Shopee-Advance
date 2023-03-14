import React, { forwardRef } from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
const InputNumber = forwardRef<HTMLInputElement, Props>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600 text-center',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = React.useState(value)
  const handleChane = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    // console.log('value', value)
    // This code checks if the value is a number or an empty string, and if it is,
    // it calls the onChange function with the event parameter.
    if (/^\d+$/.test(value) || value === '') {
      onChange && onChange(event)
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} value={localValue} {...rest} onChange={handleChane} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber

// export const InputNumber = ({
//   errorMessage,
//   className,
//   classNameInput = 'w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm',
//   classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
//   onChange,
//   ...rest
// }: Props) => {
//   const handleChane = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = event.target
//     if ((/^\d+$/.test(value) || value === '') && onChange) {
//       onChange(event)
//     }
//   }
//   return (
//     <div className={className}>
//       <input className={classNameInput} {...rest} onChange={handleChane} />
//       <div className={classNameError}>{errorMessage}</div>
//     </div>
//   )
// }
