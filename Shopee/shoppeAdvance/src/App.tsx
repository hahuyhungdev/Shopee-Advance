import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'antd/dist/reset.css'
import useRouteElements from './hooks/useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return (
    <div className='App'>
      {routeElements} <ToastContainer position='top-right' autoClose={2000} />
    </div>
  )
}

export default App
