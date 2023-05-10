import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/reset.css'
import useRouteElements from './useRouteElements'
import { useContext, useEffect } from 'react'
import { localStorageEventTarget } from './utils/auth'
import { AppContext, AppProvider } from './contexts/app.context'
import { HelmetProvider } from 'react-helmet-async'
import ErrorBoundary from './components/ErrorBoundary'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      localStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div className='App'>
      <HelmetProvider>
        <ErrorBoundary>{routeElements}</ErrorBoundary>
      </HelmetProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer position='top-right' autoClose={2000} />
    </div>
  )
}

export default App
