import { useNavigate } from 'react-router-dom';
import './login.css';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add your logic to handle the forgot password functionality here
    console.log('Forgot password button clicked');
    navigate('/auth/reset-password'); // Navigate to the password reset page
  };

  const handleBackToLogin = () => {
    navigate('/auth/login'); // Redirige vers la page de connexion
  };



  return (
    <div className="log">
      <h2>FORGOT PASSWORD</h2>
      <h6>Enter your email to reset your password</h6>
      <form onSubmit={handleForgotPassword}>
        <p>Email</p>
        <input className="email-input" type="email" placeholder="Enter your email" />
		<p>New Password</p>
		<input className="password-input" type="password" placeholder="Enter your new password" />
        <button type="submit" className="sign-in-btn">
          Reset password
        </button>
		<button onClick={handleBackToLogin} className="sign-in-btn">
		🔙 Back to Login
        </button>
      </form>
    </div>
  );
}