import React from 'react';
import '../styles/LoginPage.css'; 
import bgImage from '../assets/dog-cat-bg.jpg';
import logoImg from '../assets/paw-logo.png';

const LoginPage: React.FC = () => {
  return (
    <div className="login-container">
      <div className="background-image-container" 
      style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="back-link">
          &lt; Quay lại Trang chủ
        </div>
      </div>
      <div className="login-form-container">
        <div className="logo">
          <img src = {logoImg} alt = "Pawmily Logo"></img>
          <h2>pawmily.</h2>
        </div>
        <div className="tagline">
          <p>Gia nhập cộng đồng</p>
          <p>Giúp mỗi bé tìm thấy mái ấm!</p>
        </div>
        <div className="signup-buttons">
          <button className="google-signup-button">
            Đăng ký với Google
          </button>
          <button className="phone-signup-button">
            Đăng ký với số điện thoại
          </button>
        </div>
        <p className="terms-text">
          Bằng cách đăng ký, bạn đồng ý với <a href="#">Điều khoản Dịch vụ</a> và
          <a href="#">Chính sách Quyền riêng tư</a>, bao gồm việc sử dụng cookie.
        </p>
        <div className="login-section">
          <p>Đã có tài khoản?</p>
          <button className="login-button">
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 