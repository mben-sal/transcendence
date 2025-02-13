import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token');
    });

    // Fonction pour mettre à jour le statut
    const updateStatus = async (status = 'online') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await axios.post('http://localhost:8000/api/users/status/', 
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            const refreshToken = localStorage.getItem('refresh_token');
            
            // Mettre le statut à offline
            await axios.post(
                'http://localhost:8000/api/users/status/',
                { status: 'offline' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Faire le logout
            if (refreshToken) {
                await axios.post(
                    'http://localhost:8000/api/users/logout/',
                    { refresh_token: refreshToken },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearUserData();
        }
    };

	const clearUserData = async () => {
		try {
			// Mettre à jour le statut avant de supprimer le token
			const token = localStorage.getItem('token');
			if (token) {
				await axios.post(
					'http://localhost:8000/api/users/status/',
					{ status: 'offline' },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
			}
		} catch (error) {
			console.error('Error updating status during logout:', error);
		} finally {
			setUser(null);
			setIsAuthenticated(false);
			localStorage.removeItem('token');
			localStorage.removeItem('refresh_token');
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
            userData.avatar = userData.avatar && userData.avatar !== '/media/default-avatar.svg' ? 
                (userData.avatar.startsWith('/media') ? `http://localhost:8000${userData.avatar}` : userData.avatar) :
                defaultAvatar;
            
            // Mettre à jour le statut quand on récupère le profil
            if (userData.status !== 'online') {
                await updateStatus('online');
                userData.status = 'online';
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

    // Effet pour gérer le ping périodique du statut
	useEffect(() => {
		let pingInterval;
		
		if (isAuthenticated) {
			pingInterval = setInterval(() => {
				// Vérifier si l'utilisateur est toujours authentifié avant le ping
				if (localStorage.getItem('token')) {
					updateStatus('online');
				} else {
					clearInterval(pingInterval);
				}
			}, 30000);
		}
	
		return () => {
			if (pingInterval) {
				clearInterval(pingInterval);
			}
		};
	}, [isAuthenticated]);

    // Effet pour gérer la déconnexion lors de la fermeture de la fenêtre
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (isAuthenticated) {
                // Synchrone pour s'assurer que c'est fait avant la fermeture
                navigator.sendBeacon(
                    'http://localhost:8000/api/users/status/',
                    JSON.stringify({ status: 'offline' })
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden' && isAuthenticated) {
				// L'utilisateur quitte la page
				updateStatus('offline');
			} else if (document.visibilityState === 'visible' && isAuthenticated) {
				// L'utilisateur revient sur la page
				updateStatus('online');
			}
		};
	
		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
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
                logout,
                updateStatus
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);