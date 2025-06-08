import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/catdog.jpg'; // Using the same background
import logoImg from '../assets/paw-logo.png'; // Using the same logo
import pawLetter from '../assets/PawLetter.png';
import '../styles/ForgotPasswordPage.css'; // Corresponding CSS file

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    setError(''); // Reset error message
    setSuccessMessage(''); // Reset success message
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send password reset email');
      }

      setSuccessMessage('Hãy kiểm tra email của bạn để đổi lại mật khẩu');
      setEmail(''); // Reset email field after success

    } catch (err) {
      setError(err.message || 'An error occurred during the password reset process');
    }
  };

  return (
    <div className="login-form-container">
      {/* Background image + Back link */}
      <div
        className="login-form-left"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <Link to="/" className="back-link">
          &larr; Quay lại Trang chủ
        </Link>
      </div>

      {/* Right column: form/forgot password box */}
      <div className="login-form-right">
        {/* Logo */}
        <div className="login-form-logo">
          <img src={pawLetter} alt="Pawmily Logo" />
        </div>
        {/* Title */}
        <div className="login-form-title">
          <h2>Quên mật khẩu</h2>
        </div>
        
        {/* Forgot Password Form Fields */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} // Update email in state
              required
            />
          </div>

          {/* Send Request Button */}
          <button type="submit" className="login-button">Gửi yêu cầu</button>
        </form>

        {/* Error or Success Message */}
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {/* Link to Login Page */}
        <p className="register-link-text">Nhớ mật khẩu? <Link to="/login-form">Đăng nhập</Link></p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
