
import './App.css'
import Login from './component/login'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import ForgotPassword from './component/forgotPassword'

const App = () => {
	const routing  = createBrowserRouter ([
		{path: '/', element: <Login />},
		{path: '/login', element: <Login />},
		{path: '/forgot-password', element: <ForgotPassword />},
	])
  return (
    <>
	<RouterProvider router={routing}>
		  <div className="login">
			<Login />
		</div>
	</RouterProvider>
    </>
  )
}

export default App
