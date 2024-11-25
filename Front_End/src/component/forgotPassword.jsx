export default function ForgotPassword() {
	return(
		<div className ="log">
			<h2>FORGOT PASSWORD</h2>
			<h6>Enter your email to reset your password</h6>
			<form >
				<p>Email</p>
				<input 
					className="email-input"
					type="email" 
					placeholder="Enter your email"
				/>
				<button type="submit" className="reset-btn">
					Reset password
				</button>
			</form>
		</div>
	)
}
