import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

	const fetchUserProfile = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get('http://localhost:8000/api/users/profile/', {
				headers: { Authorization: `Bearer ${token}` }
			});
			setUser(response.data);
			setLoading(false);
			return response.data;
		} catch (error) {
			if (error.response?.status === 401) {
				localStorage.removeItem('token');
				setUser(null);
			}
			setLoading(false);
			return null;
		}
	};

	const logout = async () => {
		try {
			const refreshToken = localStorage.getItem('refresh_token');
			await axios.post('http://localhost:8000/api/users/logout/', {
				refresh_token: refreshToken
			});
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			localStorage.removeItem('token');
			localStorage.removeItem('refresh_token');
			setIsAuthenticated(false);
			setUser(null);
		}
	};
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    return (
        <UserContext.Provider 
            value={{ 
                user, 
                loading, 
                isAuthenticated, 
                setIsAuthenticated,
                fetchUserProfile,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);