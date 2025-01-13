import './App.css'
import Login from './component/login'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import AuthLayout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout'; 
import Home from './pages/Home';
import Game from './pages/Game';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import TwoFactor from './component/two_factor';
import ForgotPassword from './component/forgotPassword';
import Profile from './pages/Profile';

const App = () => {
 const [isAuthenticated, setIsAuthenticated] = useState(() => {
//    return !!localStorage.getItem('token');
   return true;
 });
 //modifier for active normal user
 const [is2FAVerified, setIs2FAVerified] = useState(true);

 const handleLogout = () => {
   localStorage.removeItem('token'); // Suppression du token
   setIsAuthenticated(false); // Mise à jour de l'état
   setIs2FAVerified(false); // Réinitialisation de la vérification 2FA
 };

// 2. Composant de protection des routes
 const ProtectedRoute = ({ children }) => {
   if (!isAuthenticated) {
     return <Navigate to="/auth/login" replace />;
   }
   
   if (isAuthenticated && !is2FAVerified) {
     return <Navigate to="/auth/two-factor" replace />;
   }

   return children;
 };

 return (
   <div className='w-full h-dvh overflow-hidden'>
     <Router>
       <Routes>
         <Route element={<AuthLayout />}>
           <Route path="/auth/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
		   <Route path="/auth/forgot-password" element={<ForgotPassword />} />           <Route 
             path="/auth/two-factor" 
             element={
               isAuthenticated ? 
               <TwoFactor setIs2FAVerified={setIs2FAVerified} /> : 
               <Navigate to="/auth/login" replace />
             } 
           />
         </Route>

         <Route
           element={
             <ProtectedRoute>
               <DashboardLayout onLogout={handleLogout} />
             </ProtectedRoute>
           }
         >
           <Route path="/" element={<Home />} />
           <Route path="/game" element={<Game />} />
           <Route path="/chat" element={<Chat />} />
           <Route path="/settings" element={<Settings />} />
		   <Route path="/profile" element={<Profile />} />
         </Route>

         <Route path="*" element={<Navigate to="/" replace />} />
       </Routes>
     </Router>
   </div>
 );
};


// const App = () => {

// 	const url = import.meta.env.VITE_API_KEY;
// 		console.log("Backend API URL:", url);

// 	axios.get(`${url}/api/some-endpoint`)
//     .then(response => {
//         console.log('Backend Response:', response.data);
//     })
//     .catch(error => {
//         console.error('Error calling the backend:', error);
//     });
// 	const routing  = createBrowserRouter ([
// 		{path: '/login', element: <Login />},
// 		{path: '/', element: <AppLayout />},
// 		// {path: '/two_factor', element: <Two_Factor />},
// 		{path: '/forgot-password', element: <ForgotPassword />},
// 	])
//   return (
//     <>
// 	<RouterProvider router={routing}>
// 		  <div className="login">
// 			<Layout/>
// 		</div>
// 	</RouterProvider>
//     </>
//   )
// }

export default App
