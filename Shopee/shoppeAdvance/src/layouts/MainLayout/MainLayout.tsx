import React, { Suspense } from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <Suspense>
      <Header />
      {children}
      <Footer />
    </Suspense>
  )
}
