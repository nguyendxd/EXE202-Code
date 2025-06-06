import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImage from '../assets/catdog.jpg'; // Using the same background
import logoImg from '../assets/paw-logo.png'; // Using the same logo
import pawLetter from '../assets/pawLetter.png';
import '../styles/LoginForm.css'; // Corresponding CSS file

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
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
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      localStorage.setItem('token', data.token);
      // Store userId (MongoDB _id) nếu có
      if (data.user && (data.user._id || data.user.id)) {
        localStorage.setItem('userId', data.user._id || data.user.id);
      } else if (data.user && data.user.uid) {
        // Nếu chỉ có uid (firebaseUID), fetch danh sách user để lấy _id MongoDB
        fetch('http://localhost:3000/api/users', {
          headers: { Authorization: 'Bearer ' + data.token }
        })
          .then(res => res.json())
          .then(users => {
            // Tìm user có uid hoặc email trùng với user vừa đăng nhập
            const user = users.find(u => u.uid === data.user.uid || u.email === data.user.email);
            if (user && user._id) {
              localStorage.setItem('userId', user._id);
            }
          });
      }
      // Redirect to home page on successful login
      navigate('/');
    } catch (err) {
      const errorMessage = err.message || 'An error occurred during login';
      if (errorMessage === 'Invalid email or password') {
        setError('Bạn đã nhập sai tài khoản hoặc mật khẩu, vui lòng thử lại');
      } else {
        setError(errorMessage);
      }
    }
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

        {error && <div className="error-message">{error}</div>}

        {/* Login Form Fields */}
        <form className="login-form" onSubmit={handleSubmit}>
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
            <Link to="/forgot-password">Quên mật khẩu?</Link>
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
export default LoginForm;
