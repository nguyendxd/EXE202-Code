import { Link } from 'react-router-dom'
import pawLogo from '../assets/paw-logo.png'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768
            setIsMobile(newIsMobile)
            if (!newIsMobile) {
                setIsOpen(false) // Close menu when switching to larger screen
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <nav style={{
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
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={pawLogo} alt="Pawmily Logo" style={{ height: '50px', marginRight: '10px' }} />
                </Link>

                {/* Hamburger Menu Button (for mobile) */}
                <div style={{ display: isMobile ? 'block' : 'none' }}>
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
                <div style={{
                    display: isMobile ? (isOpen ? 'flex' : 'none') : 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '15px' : '30px',
                    fontSize: '18px',
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
                }}>
                    <Link
                        to="/"
                        style={{
                            textDecoration: 'none',
                            color: '#333',
                            padding: '10px',
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
                            padding: '10px',
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
                            padding: '10px',
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
                            padding: '10px',
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
                            padding: '10px',
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
                            padding: '10px',
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
                            padding: '10px',
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
                <div style={{
                    display: isMobile ? (isOpen ? 'flex' : 'none') : 'flex',
                    gap: isMobile ? '15px' : '20px',
                    alignItems: 'center',
                    justifyContent: isMobile ? 'center' : 'flex-end',
                    marginTop: isMobile ? '20px' : 0,
                    transition: isMobile ? 'all 0.3s ease-in-out' : 'none',
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
                    <Link to="/cart">
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
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </Link>
                </div>
            </div>
        </nav>
    )
}