import axios from 'axios';  
import logo42 from '../assets/src/42_.svg'; 
import './login.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logoimage from '../assets/src/Right.svg';
import { AUTH_CONFIG } from '../config';
import PropTypes from 'prop-types';

export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required!';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid!';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required!';
        }
        else if (formData.password.length < 8) {
            newErrors.password = 'Password is too short!';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await authService.login(formData.email, formData.password);
			// Redirection après connexion réussie
			navigate('/dashboard');
		} catch (error) {
			setErrors({ submit: error.message });
		}
	};
	const handle42Login = (type = 'signin') => {
		if (!AUTH_CONFIG.CLIENT_ID || !AUTH_CONFIG.REDIRECT_URI) {
			setErrors({ submit: 'OAuth configuration is missing.' });
			return;
		}
	
		const params = new URLSearchParams({
			client_id: AUTH_CONFIG.CLIENT_ID,
			redirect_uri: AUTH_CONFIG.REDIRECT_URI,
			response_type: 'code',
			scope: 'public',
			state: type
		});
	
		console.log('Redirect URI:', AUTH_CONFIG.REDIRECT_URI); // Pour déboguer
		const authUrl = `https://api.intra.42.fr/oauth/authorize?${params.toString()}`;
		window.location.href = authUrl;
	};


return (
        <div className="page">
            <div className='login-wrapper'>
                <h2>WELCOME BACK</h2>
                <h6>Welcome back! Please enter your details</h6>
                <form onSubmit={handleSubmit} className="w-[30rem]">
                    <p>Email</p>
                    <input 
                        id='email'
                        name='email'
                        className={`shared-input email-input ${errors.email ? 'error' : ''}`}
                        type="email" 
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.email ? 'true' : 'false'}
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}
                    
                    <p>Password</p>
                    <input
                        id='password'
                        name='password'
                        className={`shared-input password-input ${errors.password ? 'error' : ''}`}
                        type="password" 
                        placeholder="********"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isLoading}
                        aria-invalid={errors.password ? 'true' : 'false'}
                        required
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <div className="remember-forgot">
                        <label className="remember-me">
                            <input 
                                type="checkbox"
                                name='rememberMe'
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                disabled={isLoading}
                                className='checkbox'
                            />
                            <span>Remember me</span>
                        </label>
						<Link to="/auth/forgot-password">Forgot password?</Link>
						</div>

                    {errors.submit && <span className="error">{errors.submit}</span>}
                    
                    <button 
                        type="submit" 
                        className="sign-in-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                    
                    <h5>OR</h5>
                    
                    <button 
                        type="button" 
                        className="ft-sign-in-btn"
                        onClick={() => handle42Login('signin')}
                        disabled={isLoading}
                    >
                        <img src={logo42} alt="42 logo" />
                        Sign in 
                    </button>

                    <hr className="bar" />

                    <div className="sign-up-prompt">
                        <span>Don&apos;t have an account? </span>
                        <button 
                            type="button" 
                            className="ft-sign-in-btn"
                            onClick={() => handle42Login('signup')}
                            disabled={isLoading}
                        >
                            <img src={logo42} alt="42 logo" />
                            Sign up 
                        </button>
                    </div>
                </form>
            </div>
            <div className="image">
                <img src={logoimage} alt="Decorative right side image" />
            </div>
        </div>
    );
}

Login.propTypes = {  
    setIsAuthenticated: PropTypes.func.isRequired
};