import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import registerBg from '../assets/short-cute-kitten.png';
import pawLogo from '../assets/paw-logo.png';
import pawLetter from '../assets/PawLetter.png';
import Loading from '../components/Loading';
import '../styles/RegisterPage.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Tên phải có ít nhất 3 ký tự').required('Bắt buộc'),
  email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
  password: Yup.string().min(6, 'Mật khẩu ít nhất 6 ký tự').required('Bắt buộc'),
  phone: Yup.string().matches(/^\d{9,11}$/, 'Số điện thoại không hợp lệ').required('Bắt buộc'),
  address: Yup.string().min(10, 'Địa chỉ quá ngắn').max(100, 'Địa chỉ quá dài').required('Bắt buộc'),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập thời gian tải
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (loading) {
    return <Loading />;
  }

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
        <Formik
          initialValues={{
            username: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            avatar: '',
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError('');
            setSuccessMessage('');
            try {
              const formDataWithAvatar = {
                ...values,
                avatar: values.avatar || 'https://ik.imagekit.io/nguyenn120404/avatars/images.jpg?updatedAt=1747396770898'
              };
              const response = await fetch('http://103.28.32.101:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formDataWithAvatar)
              });
              const data = await response.json();
              if (!response.ok) throw new Error(data.message || 'Registration failed');
              setSuccessMessage('Hãy xác nhận email của bạn');
              resetForm();
            } catch (err) {
              setError(err.message || 'An error occurred during registration');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="register-form">
              <div className="form-group">
                <label htmlFor="username">Tên người dùng</label>
                <Field type="text" id="username" name="username" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="password-input-container">
                  <Field type={showPassword ? 'text' : 'password'} id="password" name="password" />
                  <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                    {showPassword ? '\u{1F441}' : '\u{1F441}\u{200D}\u{1F5E8}\u{FE0F}'}
                  </span>
                </div>
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <Field type="tel" id="phone" name="phone" />
                <ErrorMessage name="phone" component="div" className="error-message" />
              </div>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <Field as="textarea" id="address" name="address" />
                <ErrorMessage name="address" component="div" className="error-message" />
              </div>
              <button type="submit" className="register-button" disabled={isSubmitting}>
                {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="has-account-text">Đã có tài khoản? <Link to="/login-form">Đăng nhập</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
