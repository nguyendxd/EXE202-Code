import React from 'react';
import pawLogo from '../assets/paw-logo.png'; // Logo Pawmily

function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#5A2E0A', // Màu nền đậm hơn để khớp với hình
                color: '#FFF',
                padding: '40px 20px',
                fontFamily: '"Varela Round", sans-serif',
            }}
        >
            <div
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
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={pawLogo} alt="Pawmily Logo" style={{ height: '80px', marginRight: '10px' }} /> {/* Tăng kích thước logo */}
                        <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#FFD700' }}>PAWMILY</h3> {/* Màu vàng cho logo text */}
                    </div>
                    <p style={{ fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase' }}>
                        Đại học FPT Hồ Chí Minh
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        pawmily@gmail.com
                    </p>
                </div>

                {/* Cột 2: Link */}
                <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                        Link
                    </h4>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                            FAQs
                        </a>
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                            Donate
                        </a>
                    </p>
                    <p style={{ fontSize: '14px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'uppercase' }}>
                            Blog
                        </a>
                    </p>
                </div>

                {/* Cột 3: Mạng xã hội */}
                <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                        Mạng Xã Hội
                    </h4>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                            Facebook
                        </a>
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                            Tiktok
                        </a>
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                            Instagram
                        </a>
                    </p>
                </div>

                {/* Cột 4: Thông tin */}
                <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', textTransform: 'uppercase' }}>
                        Thông Tin
                    </h4>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                            Pet Care Tips
                        </a>
                    </p>
                    <p style={{ fontSize: '14px' }}>
                        <a href="#" style={{ color: '#FFF', textDecoration: 'none', textTransform: 'capitalize' }}>
                            Success Stories
                        </a>
                    </p>
                </div>
            </div>

            {/* Đường viền phân cách */}
            <div style={{ borderTop: '1px solid #FFF', margin: '20px 0' }}></div>

            {/* Bản quyền */}
            <div style={{ textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
                Copyright by Pawmily
            </div>
        </footer>
    );
}

export default Footer;