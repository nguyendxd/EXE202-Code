import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LoginForm() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add login logic here
    console.log('Login submitted:', { emailOrUsername, password });
  };

  return (
    <div style={{ padding: '20px' }}> {/* Add some padding */}
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="emailOrUsername">Email hoặc Tên đăng nhập:</label>
          <input
            type="text"
            id="emailOrUsername"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label htmlFor="password">Mật khẩu:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: '15px' }}>Đăng nhập</button>
      </form>
      <p style={{ marginTop: '15px' }}>
        Quên mật khẩu? <Link to="/forgot-password">Đặt lại mật khẩu</Link>
      </p>
      <p>
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
       <p>
        <Link to="/">Quay về trang chủ</Link>
      </p>
       <p>
        <Link to="/rescue-map">Đi đến bản đồ trạm cứu hộ</Link> {/* Thêm link tạm đến trang bản đồ */}
      </p>
    </div>
  );
}

// Export component using named export
export { LoginForm };
