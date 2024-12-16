import { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import logoimage from '../assets/Right.svg';
import './two_factor.css';

export default function Two_Factor() {
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=code-${index + 1}]`);
        if (nextInput) nextInput.focus();
      }
    }
  };
  const clearCode = () => {
    setCode(['', '', '', '', '', '']);
    // Focus first input after clearing
    const firstInput = document.querySelector('input[name=code-0]');
    if (firstInput) firstInput.focus();
  };

  return (
    <div className="page">
      <div className="login-wrapper">
        <div className="login-form">
          <h2>WE&apos;VE EMAILED YOU A CODE</h2>
          <p>to continue account step, enter the code</p>
          <p>we&apos;ve sent to: example@email.com</p>
          
          <div className="form-group">
            {code.map((digit, index) => (
              <input
                type="text"
                key={index}
                name={`code-${index}`}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                className="code-input"
				placeholder='-'
              />
            ))}
			<button onClick={clearCode} className="clear-button">
              ×
            </button>
          </div>

          <button className="verify-button">
            Verify
          </button>

          <div className="links">
            <p>
              Didn&apos;t get the code?{' '}
              <Link to="#" className="resend-link">Resend Code</Link>
            </p>
            <Link to="./login" className="back-link">Back to Login</Link>
          </div>
        </div>
      </div>
      
      <div className = "image">
		<img src = {logoimage}></img>
	</div>
    </div>
  );
}