import { Link } from 'react-router-dom'
import pawLogo from '../assets/paw-logo.png'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024) // Increased breakpoint to 1024px

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
                            to="/shop"
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
                    }}>
                        <Link to="/account">
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
                                    padding: '5px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.stroke = '#6B3A0F';
                                    e.target.style.backgroundColor = '#E8D7A3';
                                    e.target.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.stroke = '#333';
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'scale(1)';
                                }}
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}