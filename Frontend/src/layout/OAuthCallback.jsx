import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AUTH_CONFIG } from '../config';
import PropTypes from 'prop-types';
import axios from 'axios';

export default function OAuthCallback({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const processCallback = async () => {
            const code = searchParams.get('code');
            
            if (!code) {
                navigate('/auth/login');
                return;
            }

            try {
                // L'URL est déjà configurée dans votre AUTH_CONFIG
                const response = await axios.get(`${AUTH_CONFIG.VITE_API_URL}/api/auth/42/callback/`, {
                    params: { code }
                });

                if (response.data.status === 'success') {
                    localStorage.setItem('token', response.data.token);
                    setIsAuthenticated(true);
                    navigate('/auth/two-factor');
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('Authentication error:', error);
                navigate('/auth/login');
            }
        };

        processCallback();
    }, [navigate, searchParams, setIsAuthenticated]);

    return (
        <div className="page">
            <div className="bg-white text-cyan-600 p-4 shadow rounded">
                <h2>Authentication en cours...</h2>
            </div>
        </div>
    );
}

OAuthCallback.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired
};