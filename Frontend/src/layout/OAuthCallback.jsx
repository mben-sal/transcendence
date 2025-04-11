import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const OAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setIsAuthenticated, fetchUserProfile } = useUser();

    useEffect(() => {
        const handleAuth = async () => {
            console.log("AuthCallback mounted - Starting authentication process");
            console.log("URL Search params:", Object.fromEntries([...searchParams]));
                
            // Vérifier d'abord si une redirection 2FA est nécessaire
            const requires2FA = searchParams.get('requires_2fa');
            const tempToken = searchParams.get('temp_token');
            const email = searchParams.get('email');
            
            console.log("2FA check:", { requires2FA, tempToken: tempToken ? "exists" : "missing", email });
                
            if (requires2FA === 'true' && tempToken && email) {
                console.log("2FA required, redirecting to verification page");
                navigate('/auth/two-factor', {
                    state: {
                        email: email,
                        tempToken: tempToken
                    }
                });
                return;
            }
    
            // Connexion normale
            const accessToken = searchParams.get('access_token');
            const refreshToken = searchParams.get('refresh_token');
            
            console.log("Tokens:", { 
                accessToken: accessToken ? "exists" : "missing", 
                refreshToken: refreshToken ? "exists" : "missing" 
            });
    
            if (accessToken && refreshToken) {
                console.log("Tokens found, saving to localStorage");
                localStorage.setItem('access_token', accessToken);
                localStorage.setItem('refresh_token', refreshToken);
                localStorage.setItem('token', accessToken);
                
                console.log("Setting isAuthenticated to true");
                setIsAuthenticated(true);
                
                try {
                    console.log("Attempting to fetch user profile");
                    const userProfile = await fetchUserProfile();
                    console.log("Profile fetch result:", userProfile);
                    
                    if (userProfile) {
                        console.log("Profile fetched successfully, navigating to home");
                        navigate('/');
                        console.log("Navigation to home triggered");
                    } else {
                        console.error("Profile fetch returned empty data");
                        throw new Error("Failed to fetch user profile");
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                    console.log("Redirecting to login due to error");
                    navigate('/auth/login');
                }
            } else {
                console.log("No tokens found, redirecting to login");
                navigate('/auth/login');
            }
        };
    
        handleAuth();
    }, [searchParams, navigate, setIsAuthenticated, fetchUserProfile]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Authentification en cours...
                </h2>
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">
                    Veuillez patienter pendant que nous configurons votre compte.
                </p>
            </div>
        </div>
    );
};

export default OAuthCallback;