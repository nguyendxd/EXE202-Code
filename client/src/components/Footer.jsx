import React from 'react';
import { Link } from 'react-router-dom';
import pawLogo from '../assets/paw-logo.png'; // Logo Pawmily

function Footer() {
    return (
        <>
            <style>
                {`
                @media (max-width: 600px) {
                  .footer-grid {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    gap: 18px !important;
                    text-align: center !important;
                    padding-left: 0 !important;
                  }
                  .footer-col {
                    width: 100% !important;
                    max-width: 300px !important;
                    margin: 0 auto 10px auto !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
                    padding-left: 0 !important;
                  }
                  .footer-logo {
                    margin: 0 auto 10px auto !important;
                    display: block !important;
                    height: 50px !important;
                  }
                  .footer-brand {
                    flex-direction: column !important;
                    align-items: center !important;
                    justify-content: center !important;
                    text-align: center !important;
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
                    {/* Cột 1: Thông tin liên hệ */}
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

                    {/* Cột 2: Link */}
                    <div className="footer-col" style={{ paddingLeft: '40px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                            Thông Tin
                        </h4>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <Link to="/about" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                                Về Chúng Mình
                            </Link>
                        </p>
                        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                            <Link to="/donate" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                                Quyên Góp
                            </Link>
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            <Link to="/blog" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                                Blog
                            </Link>
                        </p>
                    </div>

                    {/* Cột 3: Mạng xã hội */}
                    <div className="footer-col">
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