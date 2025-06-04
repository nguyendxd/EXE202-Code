import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerBg from '../assets/short-cute-kitten.png'; 
import pawLogo from '../assets/paw-logo.png';
import pawLetter from '../assets/PawLetter.png';
import '../styles/RegisterPage.css'; // Corresponding CSS file

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    avatar:'',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error
    setSuccessMessage(''); // Reset success message

    try {
      const formDataWithAvatar = {
        ...formData,
        avatar: formData.avatar || 'https://ik.imagekit.io/nguyenn120404/default-avatar.jpg' // Default avatar URL
      };
      // Log data being sent to backend for debugging
      console.log("Sending data to backend:", formData);

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      // Log response data for debugging
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccessMessage('Hãy xác nhận email của bạn');
      setFormData({
        username: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        avatar:''
      });

    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message || 'An error occurred during registration');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-logo">
          <img src={pawLetter} alt="Pawmily Letter" className="paw-letter" />
        </div>

        <div className="register-tagline">
          <h2>Tạo tài khoản mới</h2>
          <p>Tham gia cộng đồng yêu thú cưng của chúng tôi!</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên người dùng</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input-container">
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span 
                className="password-toggle-icon"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '\u{1F441}' : '\u{1F441}\u{200D}\u{1F5E8}\u{FE0F}'} {/* Eye icon */}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea 
              id="address" 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="register-button">Đăng ký</button>
        </form>

        <p className="has-account-text">Đã có tài khoản? <Link to="/login-form">Đăng nhập</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
