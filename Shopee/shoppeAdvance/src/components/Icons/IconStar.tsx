import React, { useMemo } from 'react'
import clsx from 'clsx'

interface Props {
  fillPercentage: number
  className?: string
}
export function IconStar({ fillPercentage, className }: Props) {
  const size = useMemo(() => `${fillPercentage}%`, [fillPercentage])
  console.log(fillPercentage)
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' className='h-3 w-3'>
      <path
        d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L4.82 21'
        fill='#ffce3d'
        style={{ clipPath: `inset(0 ${size} 0 0)` }}
      />
      <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L4.82 21' fill='gray' />
    </svg>
  )
}
