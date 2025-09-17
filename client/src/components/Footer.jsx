import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import pawLogo from '../assets/paw-logo.png'; // Logo Pawmily

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();
    const [feedback, setFeedback] = useState({
        email: '',
        message: ''
    });

    const handleFooterNav = (hash) => {
        if (location.pathname === '/about') {
            const el = document.getElementById(hash);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/about#${hash}`);
        }
    };

    const handleFeedbackChange = (e) => {
        setFeedback({
            ...feedback,
            [e.target.name]: e.target.value
        });
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra form
        if (!feedback.email || !feedback.message) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Xử lý gửi feedback ở đây
        console.log('Feedback submitted:', feedback);
        toast.success('Cảm ơn bạn đã gửi phản hồi!');

        // Reset form
        setFeedback({
            email: '',
            message: ''
        });
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <style>
                {`
                @media (max-width: 600px) {
                  .footer-grid {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 10px !important;
                    text-align: center !important;
                    padding-left: 0 !important;
                  }
                  .footer-col {
                    width: 100% !important;
                    max-width: 250px !important;
                    margin: 0 auto 5px auto !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
                    padding-left: 0 !important;
                  }
                  .footer-logo {
                    margin: 0 auto 5px auto !important;
                    display: block !important;
                    height: 40px !important;
                  }
                  .footer-brand {
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
                  }
                  .footer-col h4 {
                    font-size: 15px !important;
                    margin-bottom: 8px !important;
                  }
                  .footer-col p, .footer-col button {
                    font-size: 12px !important;
                    margin-bottom: 6px !important;
                  }
                  footer {
                    padding: 15px 0 !important;
                  }
                  .footer-grid {
                    gap: 5px !important;
                  }
                }
                
                .feedback-form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .feedback-form input,
                .feedback-form textarea {
                    padding: 8px;
                    border: 1px solid #FFD700;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFF;
                }
                
                .feedback-form input::placeholder,
                .feedback-form textarea::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .feedback-form button {
                    background: #FFD700;
                    color: #5A2E0A;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .feedback-form button:hover {
                    background: #FFC107;
                }
                
                @media (max-width: 600px) {
                    .feedback-form {
                        width: 100%;
                        max-width: 250px;
                        margin: 0 auto;
                    }
                }
                `}
            </style>
            <footer
                style={{
                    backgroundColor: '#5A2E0A', // Màu nền đậm hơn để khớp với hình
                    color: '#FFF',
                    padding: '30px 10px',
                    fontFamily: '"Varela Round", sans-serif',
                    textAlign: 'center',
                }}
            >
                <div
                    className="footer-grid"
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '30px', // Tăng khoảng cách giữa các cột
                        textAlign: 'left',
                    }}
                >


                    {/* Cột 2: Thông tin liên hệ */}
                    <div className="footer-col">
                        <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                            <img src={pawLogo} alt="Pawmily Logo" className="footer-logo" style={{ height: '80px', marginRight: '10px' }} />
                            <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#FFD700', margin: 0 }}>PAWMILY</h3>
                        </div>
                        <p style={{ fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>
                            Đại học FPT Hồ Chí Minh
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            pawmily.pet@gmail.com
                        </p>
                    </div>
                    {/* Cột 1: Liên hệ */}
                    <div className="footer-col" style={{ paddingLeft: '60px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Liên hệ
                        </h4>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <span role="img" aria-label="email">📧</span> <a href="mailto:pawmily.pet@gmail.com" style={{ color: '#FFF', textDecoration: 'none' }}>pawmily.pet@gmail.com</a>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <span role="img" aria-label="phone">📞</span> <a href="tel:0369545795" style={{ color: '#FFF', textDecoration: 'none' }}>0369545795</a>
                        </p>
                    </div>



                    {/* Cột 3: Mạng xã hội */}
                    <div className="footer-col" style={{ paddingLeft: '40px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Mạng Xã Hội
                        </h4>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <a href="https://www.facebook.com/profile.php?id=61576932205703" target="_blank" rel="noopener noreferrer" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                                FACEBOOK
                            </a>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <a href="https://www.tiktok.com/@pawmily.pet" target="_blank" rel="noopener noreferrer" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                                TIKTOK
                            </a>
                        </p>
                    </div>

                    {/* Cột 2: Link */}
                    <div className="footer-col" style={{ paddingLeft: '40px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Về chúng mình
                        </h4>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <button onClick={() => handleFooterNav('ve-pawmily')} style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', padding: 0 }}>
                                Về Pawmily
                            </button>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <button onClick={() => handleFooterNav('su-menh')} style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', padding: 0 }}>
                                Sứ mệnh
                            </button>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <button onClick={() => handleFooterNav('tam-nhin')} style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', padding: 0 }}>
                                Tầm nhìn
                            </button>
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            <button onClick={() => handleFooterNav('gia-tri-cot-loi')} style={{ color: '#FFF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', textTransform: 'uppercase', padding: 0 }}>
                                Giá trị cốt lõi
                            </button>
                        </p>
                    </div>

                    {/* Cột Feedback */}
                    <div className="footer-col" style={{ paddingLeft: '40px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Gửi phản hồi
                        </h4>
                        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email của bạn"
                                value={feedback.email}
                                onChange={handleFeedbackChange}
                            />
                            <textarea
                                name="message"
                                placeholder="Nội dung phản hồi"
                                rows="3"
                                value={feedback.message}
                                onChange={handleFeedbackChange}
                            />
                            <button type="submit">Gửi phản hồi</button>
                        </form>
                    </div>
                </div>

                {/* Đường viền phân cách */}
                <div style={{ borderTop: '1px solid #FFF', margin: '20px 0' }}></div>

                {/* Bản quyền */}
                <div style={{ textAlign: 'center', fontSize: '12px', textTransform: 'uppercase', marginBottom: '-20px' }}>
                    Copyright by Pawmily
                </div>
            </footer>
        </>
    );
}

export default Footer;