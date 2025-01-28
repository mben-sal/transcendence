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
        loginName: '',
        profileImage: null,
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

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
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.profileImage) {
            newErrors.profileImage = 'Profile image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file' && files[0]) {
            const file = files[0];
            // Vérifier le type de fichier
            const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!acceptedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    profileImage: 'Please upload a JPEG, PNG, or GIF image'
                }));
                return;
            }
            // Vérifier la taille (5MB maximum)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    profileImage: 'Image size should be less than 5MB'
                }));
                return;
            }
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, profileImage: file }));
            setErrors(prev => ({ ...prev, profileImage: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('first_name', formData.firstName);
            formDataToSend.append('last_name', formData.lastName);
            formDataToSend.append('intra_id', formData.loginName);
            formDataToSend.append('display_name', `${formData.firstName} ${formData.lastName}`);
            formDataToSend.append('profile_image', formData.profileImage);

            const response = await axios.post('http://localhost:8000/api/users/signup/', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refresh_token', response.data.refresh_token);
                setIsAuthenticated(true);
                navigate('/login');
            }
        } catch (error) {
            console.error('Signup error:', error.response?.data);
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.detail ||
                               'An error occurred during signup';
            setErrors(prev => ({ 
                ...prev, 
                submit: errorMessage
            }));
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
                    {/* Profile Image */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-28 h-28 mb-3">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="w-full h-full rounded-full object-cover border-4 border-blue-100" />
                            ) : (
                                <div className="w-full h-full rounded-full border-4 border-dashed border-blue-200 flex items-center justify-center bg-blue-50">
                                    <span className="text-sm text-blue-400">Upload Photo</span>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            accept="image/jpeg,image/png,image/gif"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <label htmlFor="profileImage" className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
                            Choose Photo
                        </label>
                        <div className="text-sm text-gray-500 mt-1 text-center">
                            Accepted formats: JPEG, PNG, GIF (max 5MB)
                        </div>
                        {errors.profileImage && (
                            <span className="text-red-500 text-sm mt-1">{errors.profileImage}</span>
                        )}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First name"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.lastName && (
                                <span className="text-red-500 text-sm">{errors.lastName}</span>
                            )}
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        )}
                    </div>

                    {/* Login Name */}
                    <div>
                        <label className="block mb-1 text-gray-700">Login Name</label>
                        <input
                            type="text"
                            name="loginName"
                            value={formData.loginName}
                            onChange={handleChange}
                            placeholder="Choose your login name"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.loginName && (
                            <span className="text-red-500 text-sm">{errors.loginName}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-1 text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block mb-1 text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="text-red-500 text-sm text-center">{errors.submit}</div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium mt-6 disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* Login Link */}
                    <p className="text-center mt-4 text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}