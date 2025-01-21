import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function OAuthCallback({ setIsAuthenticated }) {  // Ajout de la prop setIsAuthenticated
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AuthCallback mounted");
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        console.log("Tokens received:", { accessToken, refreshToken });

        if (accessToken && refreshToken) {
            console.log("Storing tokens and redirecting...");
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('token', accessToken); // Ajout pour la compatibilité avec App.jsx
            setIsAuthenticated(true); // Mise à jour de l'état d'authentification
            navigate('/'); // Redirection vers la page principale définie dans vos routes
        } else {
            console.log("No tokens found, redirecting to login");
            navigate('/auth/login'); // Correction du chemin de redirection
        }
    }, [searchParams, navigate, setIsAuthenticated]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <h2 className="text-xl mb-4">Authentication en cours...</h2>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
        </div>
    );
}

export default OAuthCallback;