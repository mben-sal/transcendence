import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

    const clearUserData = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
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
            clearUserData();
        }
    };

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                clearUserData();
                setLoading(false);
                return null;
            }

            const response = await axios.get('http://localhost:8000/api/users/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userData = response.data;
            if (userData.avatar && userData.avatar.startsWith('/media')) {
                userData.avatar = `http://localhost:8000${userData.avatar}`;
            }
            
            setUser(userData);
            setIsAuthenticated(true);
            return userData;
        } catch (error) {
            if (error.response?.status === 401) {
                clearUserData();
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (newData) => {
        try {
            if (newData.avatar && newData.avatar.startsWith('/media')) {
                newData.avatar = `http://localhost:8000${newData.avatar}`;
            }
            setUser(newData);
            await fetchUserProfile();
        } catch (error) {
            console.error('Error updating user:', error);
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
                setUser,
                updateUser,
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