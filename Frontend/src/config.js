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
    CLIENT_ID: 'u-s4t2ud-f6b5224609bea14ccd78911f1dbaad1708f2a5856009b937005dba1fcedc66f5',
    REDIRECT_URI: 'http://localhost:8000/callback/',
    VITE_API_URL: 'http://localhost:8000'
};
export const API_URL = 'http://localhost:8000/api';