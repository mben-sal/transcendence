import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';
import { API_BASE_URL } from '../config';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Infos de l'utilisateur
    const [loading, setLoading] = useState(true); // État de chargement
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return !!localStorage.getItem('token'); // Si l'utilisateur est connecté
    });

    // Fonction pour mettre à jour le statut
    const updateStatus = async (status = 'online') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            await api.post('/users/status/', 
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` } //token JWT
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
            await api.post(
                '/users/status/',
                { status: 'offline' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Faire le logout
            if (refreshToken) {
                await api.post(
                    '/users/logout/',
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
				await api.post(
					'/users/status/',
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
			// recuperer token authentification
            const token = localStorage.getItem('token');
			// si non existe pas, deconnecter , free 
            if (!token) {
                clearUserData();
                setLoading(false);
                return null;
            }

            const response = await api.get('/users/profile/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const userData = response.data;
            userData.avatar = userData.avatar && userData.avatar !== '/media/default-avatar.svg' ? 
                (userData.avatar.startsWith('/media') ? `${API_BASE_URL}${userData.avatar}` : userData.avatar) :
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
                newData.avatar = `${API_BASE_URL}${newData.avatar}`;
            }
            setUser(newData);
            await fetchUserProfile();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // garder le statut "online" actif côté serveur tant que l'utilisateur reste connecté.
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
                    '${API_BASE_URL}/users/status/',
                    JSON.stringify({ status: 'offline' })
                );
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isAuthenticated]);

	// Récupération du profil utilisateur
    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

	//Statut online/offline
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