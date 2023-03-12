import React from 'react'
import InputNumber from '../InputNumber'
import { InputNumberProps } from '../InputNumber/InputNumber'

interface Props extends InputNumberProps {
  value: number
  max?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onType?: (value: number) => void
  classNameWrapper?: string
}

function QuantityController({
  value,
  max,
  onIncrease,
  onDecrease,
  onType,
  classNameWrapper = 'ml-10',
  ...rest
}: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // here, i want to convert event. target. value to number should i used Number()
    let _value = Number(event.target.value)
    if (max !== undefined && Number(_value) > max) {
      _value = max
    }
    onType && onType(_value)
  }
  const increase = () => {
    let _value = Number(value) + 1
    if (max !== undefined && Number(_value) > max) {
      _value = max
    }
    onIncrease && onIncrease(_value)
  }
  const decrease = () => {
    let _value = Number(value) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
  }
  return (
    <div className={`flex  items-center ${classNameWrapper}`}>
      <button
        onClick={decrease}
        className='flex h-8 w-8 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600
      '
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 12h-15' />
        </svg>
      </button>
      <InputNumber
        onChange={handleChange}
        value={value}
        classNameError='hidden'
        classNameInput='h-8 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        {...rest}
      />
      <button
        onClick={increase}
        className='flex h-8 w-8 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-4 w-4'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
        </svg>
      </button>
    </div>
  )
}

export default QuantityController
