import React, { Suspense } from 'react'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  return (
    <Suspense>
      <RegisterHeader />
      {children}
      <Footer />
    </Suspense>
  )
}
