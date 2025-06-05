import { Link, useNavigate } from 'react-router-dom'
import pawLogo from '../assets/paw-logo.png'
import { useState, useEffect, useRef } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024) // Increased breakpoint to 1024px
    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef(null)
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 1024
            setIsMobile(newIsMobile)
            if (!newIsMobile) {
                setIsOpen(false) // Close menu when switching to larger screen
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Đóng menu user khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        }
        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    // Giả lập trạng thái đăng nhập (bạn có thể thay bằng context thực tế)
    const isLoggedIn = false;

    return (
        <>
            <style>
                {`
                    @media (min-width: 1025px) {
                        .nav-links {
                            gap: 20px; /* Reduced gap for larger screens to fit everything */
                            font-size: 16px; /* Slightly smaller font size */
                        }
                        .nav-icons {
                            gap: 15px; /* Reduced gap for icons */
                        }
                        .nav-icons svg {
                            width: 24px; /* Slightly smaller icon size */
                            height: 24px;
                        }
                        .nav-container {
                            padding: 15px; /* Reduced padding */
                        }
                        .nav-logo {
                            height: 40px; /* Smaller logo */
                        }
                    }
                `}
            </style>
            <nav className="nav-container" style={{
                backgroundColor: '#FFF5E1',
                padding: '20px',
                fontFamily: '"Varela Round", Arial, sans-serif',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    {/* Logo */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <img src={pawLogo} alt="Pawmily Logo" className="nav-logo" style={{ height: '50px', marginRight: '10px' }} />
                    </Link>

                    {/* Hamburger Menu Button (for mobile) */}
                    <div style={{ display: isMobile ? 'block' : 'none', flexShrink: 0 }}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                fontSize: '24px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#333',
                                transition: 'transform 0.3s',
                                transform: isOpen ? 'rotate(90deg)' : 'none',
                            }}
                        >
                            {isOpen ? '✖' : '☰'}
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links" style={{
                        display: isMobile ? (isOpen ? 'flex' : 'none') : 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '15px' : '20px',
                        fontSize: isMobile ? '18px' : '16px',
                        fontWeight: '400',
                        color: '#333',
                        width: isMobile ? '100%' : 'auto',
                        textAlign: isMobile ? 'center' : 'left',
                        backgroundColor: isMobile ? '#FFF5E1' : 'transparent',
                        position: isMobile ? 'absolute' : 'static',
                        top: isMobile ? '80px' : 'auto',
                        left: isMobile ? 0 : 'auto',
                        padding: isMobile ? '20px' : 0,
                        zIndex: '10',
                        transition: isMobile ? 'all 0.3s ease-in-out' : 'none',
                        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(-100%)') : 'none',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                    }}>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            TRANG CHỦ
                        </Link>
                        <Link
                            to="/adopt"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            NHẬN NUÔI
                        </Link>
                        <Link
                            to="/posts"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            BÀI ĐĂNG
                        </Link>
                        <Link
                            to="/rescue-map"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            BẢN ĐỒ
                        </Link>
                        <Link
                            to="/blog"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            BLOG
                        </Link>
                        <Link
                            to="/donate"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            QUYÊN GÓP
                        </Link>
                        <Link
                            to="/about"
                            style={{
                                textDecoration: 'none',
                                color: '#333',
                                padding: isMobile ? '10px' : '8px',
                                transition: 'color 0.3s, background-color 0.3s, font-weight 0.1s, transform 0.1s',
                                borderRadius: '50px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#6B3A0F';
                                e.target.style.backgroundColor = '#E8D7A3';
                                e.target.style.fontWeight = '600';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#333';
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.fontWeight = '400';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            VỀ CHÚNG MÌNH
                        </Link>
                    </div>

                    {/* Icons */}
                    <div className="nav-icons" style={{
                        display: isMobile ? (isOpen ? 'flex' : 'none') : 'flex',
                        gap: isMobile ? '15px' : '15px',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-end',
                        marginTop: isMobile ? '20px' : 0,
                        transition: isMobile ? 'all 0.3s ease-in-out' : 'none',
                        flexShrink: 0,
                        position: 'relative',
                    }}>
                        <div style={{ position: 'relative' }}>
                            <button
                                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                onClick={() => setShowUserMenu((v) => !v)}
                                aria-label="User menu"
                            >
                                <svg
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        fill: 'none',
                                        stroke: '#333',
                                        strokeWidth: '2',
                                        strokeLinecap: 'round',
                                        strokeLinejoin: 'round',
                                        transition: 'all 0.3s',
                                        borderRadius: '50%',
                                        padding: '5px',
                                        background: showUserMenu ? '#E8D7A3' : 'transparent',
                                    }}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {showUserMenu && (
                                <div ref={userMenuRef} style={{
                                    position: 'absolute',
                                    top: 40,
                                    right: 0,
                                    minWidth: 160,
                                    background: '#fff',
                                    border: '1.5px solid #E5C299',
                                    borderRadius: 12,
                                    boxShadow: '0 4px 24px rgba(92,64,51,0.10)',
                                    zIndex: 2000,
                                    padding: '8px 0',
                                }}>
                                    <button style={menuBtnStyle} onClick={() => { navigate('/account'); setShowUserMenu(false); }}>Xem profile</button>
                                    <button style={menuBtnStyle} onClick={() => { navigate('/setting'); setShowUserMenu(false); }}>Cài đặt</button>
                                    {!isLoggedIn && <button style={menuBtnStyle} onClick={() => { navigate('/login'); setShowUserMenu(false); }}>Đăng nhập</button>}
                                    {!isLoggedIn && <button style={menuBtnStyle} onClick={() => { navigate('/register'); setShowUserMenu(false); }}>Đăng ký</button>}
                                    {isLoggedIn && <button style={menuBtnStyle} onClick={() => { alert('Đã đăng xuất!'); setShowUserMenu(false); }}>Đăng xuất</button>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

const menuBtnStyle = {
    width: '100%',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '10px 20px',
    fontSize: 16,
    color: '#5C4033',
    cursor: 'pointer',
    transition: 'background 0.2s',
    borderRadius: 8,
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 500,
    margin: 0,
    display: 'block',
};