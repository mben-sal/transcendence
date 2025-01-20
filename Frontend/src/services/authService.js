import axios from 'axios';
import { AUTH_CONFIG } from '../config';

const authService = {
    async login(email, password) {
        const response = await axios.post(`${AUTH_CONFIG.VITE_API_URL}/api/users/login/`, {
            email,
            password
        });
        return response.data;
    },

    async refreshToken(refreshToken) {
        const response = await axios.post(`${AUTH_CONFIG.VITE_API_URL}/api/token/refresh/`, {
            refresh: refreshToken
        });
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
    },

    getToken() {
        return localStorage.getItem('token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;