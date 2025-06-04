import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../assets/catdog.jpg'; // Using the same background
import logoImg from '../assets/paw-logo.png'; // Using the same logo
import pawLetter from '../assets/pawLetter.png';
import '../styles/LoginForm.css'; // Corresponding CSS file

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

      {/* Right column: form/login box */}
      <div className="login-form-right">
        {/* Logo */}
        <div className="login-form-logo">
          <img src={logoImg} alt="Pawmily Logo" />
        </div>
        {/* Title */}
        <div className="login-form-title">
          <h2>Đăng nhập</h2>
        </div>
        
        {/* Login Form Fields */}
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="emailOrPhone"> Email</label>
            <input type="text" id="emailOrPhone" name="emailOrPhone" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                name="password" 
              />
              <span 
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '\u{1F441}' : '\u{1F441}\u{200D}\u{1F5E8}\u{FE0F}'}
              </span>
            </div>
          </div>

          {/* Remember me / Forgot password */}
          <div className="login-form-options">
              <div>
                  <input type="checkbox" id="rememberMe" name="rememberMe" />
                  <label htmlFor="rememberMe">Ghi nhớ mật khẩu</label>
              </div>
              <a href="forgot-password">Quên mật khẩu?</a>
          </div>

          {/* Login Button */}
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>

        {/* Link to Register Page */}
        <p className="register-link-text">Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
      </div>
    </div>
  );
};

// Export component using named export
export { LoginForm };
