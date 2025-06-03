import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/catdog.jpg'; // Using the same background
import logoImg from '../assets/paw-logo.png'; // Using the same logo
import pawLetter from '../assets/pawLetter.png';
import '../styles/ForgotPasswordPage.css'; // Corresponding CSS file

const ForgotPasswordPage = () => {
  return (
    <div className="login-form-container">
      {/* background image + Back link */}
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
          <img src={logoImg} alt="Pawmily Logo" />
        </div>
        {/* Title */}
        <div className="login-form-title">
          <h2>Quên mật khẩu</h2>
        </div>
        
        {/* Forgot Password Form Fields */}
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" name="email" />
          </div>

          {/* Send Request Button */}
          <button type="submit" className="login-button">Gửi yêu cầu</button>
        </form>

        {/* Link to Login Page */}
        <p className="register-link-text">Nhớ mật khẩu? <Link to="/login-form">Đăng nhập</Link></p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 