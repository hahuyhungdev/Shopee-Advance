import { useState } from 'react'
import useRouteElements from './hooks/useRouteElements'

function App() {
  const routeElements = useRouteElements()
  return <div className='App'>{routeElements}</div>
}

export default App
