import React from 'react';
import { Link } from 'react-router-dom';
import registerBg from '../assets/short-cute-kitten.png'; 
import pawLogo from '../assets/paw-logo.png'; 
import '../styles/RegisterPage.css'; // Corresponding CSS file

const RegisterPage = () => {
  return (
    <div className="register-container">
      {/* Background Image / Design Element (styled in CSS) */}
      {/* The kitten image will be used as a background */}

      {/* Central Form Card / Area */}
      <div className="register-card">
        {/* Logo */}
        <div className="register-logo">
          <img src={pawLogo} alt="Pawmily Logo" />
        </div>

        {/* Title and Subtitle */}
        <div className="register-tagline">
          <h2>Tạo tài khoản mới</h2>
          <p>Tham gia cộng đồng yêu thú cưng của chúng tôi!</p>
        </div>

        {/* Registration Form Fields */}
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Tên người dùng</label>
            <input type="text" id="username" name="username" />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" name="password" />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input type="tel" id="phone" name="phone" />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea id="address" name="address"></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="register-button">Đăng ký</button>
        </form>

        {/* Link to Login Page */}
        <p className="has-account-text">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
