import logo42 from '../assets/42_.svg';  // Remove the space before .svg
import './login.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoimage from '../assets/Right.svg';  // Remove the space before .svg

export default function Login() {
	const [formData, setFormData] = useState({  // Changed from FormData to formData (convention)
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
		console.log('handleChange', e.target);
		const { name, value , type, checked } = e.target;
		setFormData({
			...formData,
			[name]: type === 'checkbox' ? checked : value,
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validateForm()) {
			try{
				//add code here
				console.log('form submitted', formData);
			} catch (err) {
				console.error('Authentication failed', err);
				setErrors({ submit: 'Authentication failed' });
			}

		}

	};

	const handleSignIn = () => {
		//add code here
		console.log('42 Sign in');
		console.log('form submitted', formData);
	}

	return(
		<div className ="page">
			<div className='login-wrapper'>

			<h2>WELCOME BACK</h2>
			<h6>Welcome back! Please enter your details</h6>
			<form  onSubmit={handleSubmit}>
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
						placeholder="Enter your password"
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
							checked={FormData.rememberMe}
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
				onClick={handleSignIn}>
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