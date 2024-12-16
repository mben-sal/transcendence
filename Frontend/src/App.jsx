
import './App.css'
import Login from './component/login'
import Two_Factor from './component/two_factor'
import { createBrowserRouter , RouterProvider} from 'react-router-dom'
import ForgotPassword from './component/forgotPassword'
import axios from 'axios'

const App = () => {

	const url = import.meta.env.VITE_API_KEY;
		console.log("Backend API URL:", url);

	axios.get(`${url}/api/some-endpoint`)
    .then(response => {
        console.log('Backend Response:', response.data);
    })
    .catch(error => {
        console.error('Error calling the backend:', error);
    });
	const routing  = createBrowserRouter ([
		{path: '/', element: <Two_Factor />},
		{path: '/login', element: <Login />},
		// {path: '/two_factor', element: <Two_Factor />},
		{path: '/forgot-password', element: <ForgotPassword />},
	])
  return (
    <>
	<RouterProvider router={routing}>
		  <div className="login">
			{/* <Login /> */}
			<Two_Factor />
		</div>
	</RouterProvider>
    </>
  )
}

export default App
