// src/contexts/UserContext.jsx
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
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return null;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/users/profile/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUser(response.data);
            setIsAuthenticated(true);
            setLoading(false);
            return response.data;  // Retourne les données du profil
        } catch (error) {
            console.error('Error fetching user profile:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                setIsAuthenticated(false);
            }
            setLoading(false);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Charger le profil au montage si un token existe
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