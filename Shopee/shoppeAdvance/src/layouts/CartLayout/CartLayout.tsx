import React, { Suspense } from 'react'
import CartHeader from 'src/components/CartHeader'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  return (
    <Suspense>
      <CartHeader />
      {children}
      <Footer />
    </Suspense>
  )
}
