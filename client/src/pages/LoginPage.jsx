// src/pages/LoginPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // dùng để quay về trang chủ ("/")
import bgImage from '../assets/catdog.jpg';
import logoImg from '../assets/paw-logo.png';
import pawLetter from '../assets/PawLetter.png';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      {/* background image + nút "Quay lại Trang chủ" */}
      <div
        className="login-left"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <Link to="/" className="back-link">
          &larr; Quay lại Trang chủ
        </Link>
      </div>

      {/* =====================
           Phần cột bên phải: form/login box
           ===================== */}
      <div className="login-right">
        {/* Logo and PawLetter */}
        <div className="login-logo">
          <img src={logoImg} alt="Pawmily Logo" /> 
        </div>
          
        {/* Tagline */}
        <div className="login-tagline">
          <p>Gia nhập cộng đồng</p>
          <p>Giúp mỗi bé tìm thấy mái ấm!</p>
        </div>
        {/* Nút đăng ký */}
        <div className="signup-buttons">
          <button className="btn-google" onClick={handleGoogleSignup}>Đăng ký với Google</button>
        </div>
        {/* Text điều khoản */}
        <p className="terms-text">
          Bằng cách đăng ký, bạn đồng ý với&nbsp;
          <a href="#">Điều khoản Dịch vụ</a>&nbsp;và&nbsp;
          <a href="#">Chính sách Quyền riêng tư</a>, bao gồm việc sử dụng cookie.
        </p>
        {/* Phần chuyển sang login nếu đã có tài khoản */}
        <div className="already-login">
          <span>Đã có tài khoản?</span>
          <button className="btn-login" onClick={() => navigate('/login-form')}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
