import axios from 'axios';  
import logo42 from '../assets/42_.svg'; 
import './login.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoimage from '../assets/Right.svg';
// import Two_Factor from './two_factor';


export default function Login() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		rememberMe: false,
	  });
	const [errors, setErrors] = useState({});
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
		setFormData((prevData) => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value,
		}));
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('42 Sign in');
		if (validateForm()) {
			try{
				const response = await axios.post(
					'http://localhost:8000/api/users/login/', 
					{ email: formData.email, password: formData.password },
					{ withCredentials: true } // Cela envoie des cookies sécurisés
				);			
				if (response.data.status === 'success') {
					console.log('Login successful:', response.data.message);
					window.location.href = '/two-factor'; // valider le login
				} else {
					setErrors({ submit: response.data.message });
				}
				// console.log('form submitted', formData);
			} catch (err) {
				console.error('Authentication failed', err);
				setErrors({ submit: 'Authentication failed. Please try again.' });
			}

		}

	};

	const handle42Login = () => {
		// const CLIENT_ID = '******';
		// const REDIRECT_URI = '*****';
		window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=VOTRE_CLIENT_ID&redirect_uri=VOTRE_REDIRECT_URI&response_type=code';
	}
	return(
		<div className ="page">
			<div className='login-wrapper'>

			<h2>WELCOME BACK</h2>
			<h6>Welcome back! Please enter your details</h6>
			<form  onSubmit={handleSubmit} className="w-[30rem]">
				<p>Email</p>
				<input 
					id='email'
					name='email'
					className={`shared-input email-input ${errors.email ? 'error' : ''}`}
					type="email" 
					placeholder="Enter your email"
					// value={formData.email}
					onChange={(e) => handleChange(e)}
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
							className='checkbox'
							/>
						<span>Remember me</span>
					</label>
					
					{/* <a href="./forgot-password" className="forgot-password"> */}
					<Link to="/forgot-password">Forgot password?</Link>
					{/* </a> */}
				</div>
				{errors.submit && <span className="error">{errors.submit}</span>}
				<button type="submit" className="sign-in-btn">
					Sign in
				</button>
				
				<h5>OR</h5>
				
				<button 
				type="button" 
				className="ft-sign-in-btn"
				onClick={handle42Login}>
				<img src={logo42} alt="42 logo" />
					 Sign in
				</button>
					<hr className="bar" ></hr>
				<div className="sign-up-prompt">
					<span> Don&apos;t have an account? </span>
					<button 
					type="button" 
					className="ft-sign-in-btn"
					onClick={()=>{ console.log('Sign up'); }}>
					<img src={logo42} alt="42 logo" />
					 Sign up
				</button>
				</div>
				</form>
			</div>
			<div className = "image">
				<img src = {logoimage}></img>
			</div>
		</div>
	);
}