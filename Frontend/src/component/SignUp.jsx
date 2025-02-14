import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';

export default function SignUp() {
    const navigate = useNavigate();
    const { setIsAuthenticated } = useUser();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        intraId: '',
        displayName: '',
        loginName: '',
        two_factor_enabled: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.loginName.trim()) {
            newErrors.loginName = 'Login name is required';
        } else if (formData.loginName.length < 3) {
			newErrors.loginName = 'Login name must be at least 3 characters';
		}

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
	
		const payload = {
			email: formData.email,
			password: formData.password,
			first_name: formData.firstName,
			last_name: formData.lastName,
			login_name: formData.loginName
		};
		
		console.log('Payload:', payload);
	
		setIsLoading(true);
		try {
			const response = await axios.post('http://localhost:8000/api/users/signup/', payload);
			
			localStorage.setItem('token', response.data.token);
			localStorage.setItem('refresh_token', response.data.refresh_token);
			setIsAuthenticated(true);
			navigate('/');
		} catch (error) {
			console.error("Signup error:", error.response?.data);
			setErrors(error.response?.data?.errors || { submit: 'Erreur d\'inscription' });
		} finally {
			setIsLoading(false);
		}
	};

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2">CREATE ACCOUNT</h2>
                <p className="text-center text-gray-600 mb-6">Please enter your details to create an account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                            />
                            {errors.firstName && (
                                <span className="text-red-500 text-sm">{errors.firstName}</span>
                            )}
                        </div>
                        <div>
                            <label className="block mb-1 text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                            />
                            {errors.lastName && (
                                <span className="text-red-500 text-sm">{errors.lastName}</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Login Name</label>
                        <input
                            type="text"
                            name="loginName"
                            value={formData.loginName}
                            onChange={handleChange}
                            placeholder="Choose your login name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                        />
                        {errors.loginName && (
                            <span className="text-red-500 text-sm">{errors.loginName}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">{errors.password}</span>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-black text-white"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {errors.submit && (
                        <div className="text-red-500 text-sm text-center">{errors.submit}</div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium mt-6 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}