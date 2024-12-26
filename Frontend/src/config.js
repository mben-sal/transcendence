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

export const AUTH_CONFIG = {
    CLIENT_ID: getEnvVariable('42_CLIENT_ID'),
    REDIRECT_URI: getEnvVariable('42_REDIRECT_URI'),
    VITE_API_URL: getEnvVariable('API_URL') || 'http://localhost:8000'
};


export const API_URL = 'http://localhost:8000/api';