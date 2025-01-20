const getEnvVariable = (key) => {
    // For Vite
    if (import.meta?.env) {
        return import.meta.env[`VITE_${key}`];
    }
    // For Create React App
    if (window.ENV) {
        return window.ENV[key];
    }
    // Fallback
    return '';
};

// config.js
export const AUTH_CONFIG = {
    CLIENT_ID: import.meta.env.VITE_42_CLIENT_ID?.replace(/-/g, ''), // Enlève les tirets si présents
    REDIRECT_URI: import.meta.env.VITE_42_REDIRECT_URI,
    VITE_API_URL: import.meta.env.VITE_API_URL
};

export const API_URL = 'http://localhost:8000/api';