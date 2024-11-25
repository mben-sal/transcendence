import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add your logic to handle the forgot password functionality here
    console.log('Forgot password button clicked');
    navigate('/reset-password'); // Navigate to the password reset page
  };

  return (
    <div className="log">
      <h2>FORGOT PASSWORD</h2>
      <h6>Enter your email to reset your password</h6>
      <form onSubmit={handleForgotPassword}>
        <p>Email</p>
        <input className="email-input" type="email" placeholder="Enter your email" />
        <button type="submit" className="reset-btn">
          Reset password
        </button>
      </form>
    </div>
  );
}