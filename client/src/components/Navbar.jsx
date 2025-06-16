import { Link, useNavigate } from 'react-router-dom'
import pawLogo from '../assets/paw-logo.png'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024) // Increased breakpoint to 1024px
    const [showUserMenu, setShowUserMenu] = useState(false)
    const userMenuRef = useRef(null)
    const navRef = useRef(null)
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 1024
            if (newIsMobile !== isMobile) {
                setIsMobile(newIsMobile)
                if (!newIsMobile) {
                    setIsOpen(false)
                }
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isMobile])

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

    // Thêm useEffect để xử lý click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate('/');
    };

    // Thêm hàm handleLinkClick
    const handleLinkClick = () => {
        setIsOpen(false);
    };

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
            <nav className="nav-container" ref={navRef} style={{
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
                    <div style={{
                        display: isMobile && !isOpen ? 'block' : 'none',
                        flexShrink: 0
                    }}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                fontSize: '24px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#333',
                                transition: 'transform 0.3s',
                            }}
                        >
                            ☰
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="nav-links" style={{
                        display: isMobile ? 'flex' : 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '30px' : '20px',
                        fontSize: isMobile ? '18px' : '16px',
                        fontWeight: '400',
                        color: '#333',
                        width: isMobile ? '100%' : 'auto',
                        textAlign: 'center',
                        backgroundColor: isMobile ? '#FFF5E1' : 'transparent',
                        position: isMobile ? 'absolute' : 'static',
                        top: isMobile ? '80px' : 'auto',
                        left: isMobile ? 0 : 'auto',
                        padding: isMobile ? '20px 0 100px 0' : 0,
                        zIndex: '10',
                        transition: isMobile
                            ? 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
                            : 'none',
                        transform: isMobile ? (isOpen ? 'translateY(0)' : 'translateY(-100%)') : 'none',
                        opacity: isMobile ? (isOpen ? 1 : 0) : 1,
                        visibility: isMobile ? (isOpen ? 'visible' : 'hidden') : 'visible',
                        pointerEvents: isMobile ? (isOpen ? 'auto' : 'none') : 'auto',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Link
                            to="/"
                            onClick={handleLinkClick}
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
                            onClick={handleLinkClick}
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
                            to="/rescue-map"
                            onClick={handleLinkClick}
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
                            onClick={handleLinkClick}
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
                            onClick={handleLinkClick}
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
                            onClick={handleLinkClick}
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

                    {/* Auth Buttons */}
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
                        {isAuthenticated ? (
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
                                        minWidth: 200,
                                        background: '#fff',
                                        border: '1.5px solid #E5C299',
                                        borderRadius: 12,
                                        boxShadow: '0 4px 24px rgba(92,64,51,0.10)',
                                        zIndex: 2000,
                                        padding: '8px 0',
                                    }}>
                                        <button style={dropdownButtonStyle} onClick={() => { navigate(`/profile/${userId}`); setShowUserMenu(false); handleLinkClick(); }}> Hồ sơ người dùng </button>
                                        <button style={dropdownButtonStyle} onClick={() => { navigate('/wishlist'); setShowUserMenu(false); handleLinkClick(); }}>Danh sách yêu thích</button>
                                        <button style={dropdownButtonStyle} onClick={() => { navigate('/chat'); setShowUserMenu(false); handleLinkClick(); }}>Tin nhắn</button>
                                        <button style={dropdownButtonStyle} onClick={() => { handleLogout(); handleLinkClick(); }}>Đăng xuất</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link
                                    to="/login"
                                    onClick={handleLinkClick}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#333',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        border: '1px solid #E5C299',
                                        backgroundColor: '#FFF5E1',
                                        transition: 'all 0.3s',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#E8D7A3';
                                        e.target.style.color = '#6B3A0F';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#FFF5E1';
                                        e.target.style.color = '#333';
                                    }}
                                >
                                    ĐĂNG NHẬP
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={handleLinkClick}
                                    style={{
                                        textDecoration: 'none',
                                        color: '#fff',
                                        padding: '8px 16px',
                                        borderRadius: '20px',
                                        backgroundColor: '#E5C299',
                                        transition: 'all 0.3s',
                                        fontSize: '16px',
                                        fontWeight: '500',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = '#D3B17D';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = '#E5C299';
                                    }}
                                >
                                    ĐĂNG KÝ
                                </Link>
                            </div>
                        )}
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
    transition: 'all 0.2s ease',
    borderRadius: 8,
    outline: 'none',
    fontFamily: 'inherit',
    fontWeight: 500,
    margin: 0,
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    ':hover': {
        backgroundColor: '#FFF8E7',
        color: '#6B3A0F',
    }
};

// Thêm style cho các button trong dropdown
const dropdownButtonStyle = {
    ...menuBtnStyle,
    '&:hover': {
        backgroundColor: '#FFF8E7',
        color: '#6B3A0F',
    }
};