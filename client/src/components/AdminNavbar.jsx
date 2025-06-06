"use client"

import { Link, useNavigate } from "react-router-dom"
import pawLogo from "../assets/paw-logo.png"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 1024
      setIsMobile(newIsMobile)
      if (!newIsMobile) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          .admin-nav-container {
            background: linear-gradient(135deg, #FFF5E1 0%, #F5E8C7 100%);
            backdrop-filter: blur(10px);
            border-bottom: 3px solid transparent;
            border-image: linear-gradient(90deg, #D7A86E, #E5C299, #D7A86E) 1;
            box-shadow: 0 4px 20px rgba(215, 168, 110, 0.3);
          }

          .admin-nav-logo {
            filter: drop-shadow(0 2px 4px rgba(164, 113, 72, 0.3));
            transition: all 0.3s ease;
          }

          .admin-nav-logo:hover {
            transform: scale(1.05);
            filter: drop-shadow(0 4px 8px rgba(164, 113, 72, 0.4));
          }

          .admin-panel-text {
            background: linear-gradient(135deg, #A47148, #8B4513);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 4px rgba(164, 113, 72, 0.2);
          }

          .admin-nav-link {
            position: relative;
            overflow: hidden;
            border-radius: 25px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .admin-nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(232, 215, 163, 0.4), transparent);
            transition: left 0.5s;
          }

          .admin-nav-link:hover::before {
            left: 100%;
          }

          .admin-badge {
            background: linear-gradient(135deg, #9C27B0, #673AB7);
            box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
            animation: pulse 2s infinite;
          }

          .admin-dropdown {
            animation: fadeIn 0.3s ease-out;
            background: linear-gradient(135deg, #FFFFFF 0%, #FFFBF0 100%);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(215, 168, 110, 0.3);
            box-shadow: 0 20px 40px rgba(92, 64, 51, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }

          .admin-menu-item {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .admin-menu-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 248, 231, 0.8), transparent);
            transition: left 0.3s;
          }

          .admin-menu-item:hover::before {
            left: 100%;
          }

          .hamburger-btn {
            position: relative;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #E8D7A3, #D7A86E);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(215, 168, 110, 0.3);
          }

          .hamburger-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(215, 168, 110, 0.4);
          }

          @media (min-width: 1025px) {
            .admin-nav-links {
              gap: 15px;
              font-size: 14px;
            }
            .admin-nav-icons {
              gap: 15px;
              min-width: 280px;
            }
            .admin-nav-container {
              padding: 15px 20px;
            }
            .admin-nav-logo {
              height: 45px;
            }
          }
        `}
      </style>
      <nav
        className="admin-nav-container"
        style={{
          padding: "20px 25px",
          fontFamily: '"Varela Round", Arial, sans-serif',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
          }}
        >
          {/* Enhanced Logo Section */}
          <Link
            to="/admin"
            style={{
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
          >
            <div style={{ position: "relative" }}>
              <img
                src={pawLogo || "/placeholder.svg"}
                alt="Pawmily Admin"
                className="admin-nav-logo"
                style={{ height: "50px", marginRight: "15px" }}
              />
              <div
                style={{
                  position: "absolute",
                  top: -5,
                  right: 10,
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#4CAF50",
                  borderRadius: "50%",
                  border: "2px solid white",
                  boxShadow: "0 0 0 2px rgba(76, 175, 80, 0.3)",
                }}
              />
            </div>
            <div>
              <span
                className="admin-panel-text"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  display: "block",
                  lineHeight: "1.2",
                }}
              >
                Admin Panel
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "#A47148",
                  opacity: 0.8,
                  fontWeight: "500",
                }}
              >
                Management Dashboard
              </span>
            </div>
          </Link>

          {/* Enhanced Hamburger Menu */}
          <div style={{ display: isMobile ? "block" : "none", flexShrink: 0 }}>
            <button
              className="hamburger-btn"
              onClick={() => setIsOpen(!isOpen)}
              style={{
                border: "none",
                cursor: "pointer",
                color: "#6B3A0F",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* Enhanced Navigation Links */}
          <div
            className="admin-nav-links"
            style={{
              display: isMobile ? (isOpen ? "flex" : "none") : "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "20px" : "15px",
              fontSize: isMobile ? "18px" : "15px",
              fontWeight: "500",
              color: "#333",
              width: isMobile ? "100%" : "auto",
              textAlign: isMobile ? "center" : "left",
              backgroundColor: isMobile ? "rgba(255, 245, 225, 0.95)" : "transparent",
              position: isMobile ? "absolute" : "static",
              top: isMobile ? "85px" : "auto",
              left: isMobile ? 0 : "auto",
              padding: isMobile ? "25px" : 0,
              zIndex: "10",
              transition: isMobile ? "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
              transform: isMobile ? (isOpen ? "translateY(0)" : "translateY(-20px)") : "none",
              opacity: isMobile ? (isOpen ? 1 : 0) : 1,
              flexShrink: 0,
              whiteSpace: "nowrap",
              borderRadius: isMobile ? "0 0 20px 20px" : "0",
              boxShadow: isMobile ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {[
              { to: "/admin", icon: "🏠", text: "DASHBOARD" },
              { to: "/admin/account", icon: "👥", text: "QUẢN LÝ TÀI KHOẢN" },
              { to: "/admin/blog", icon: "📝", text: "QUẢN LÝ BLOG" },
              { to: "/admin/adoption", icon: "🐾", text: "QUẢN LÝ NHẬN NUÔI" },
            ].map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="admin-nav-link"
                style={{
                  textDecoration: "none",
                  color: "#333",
                  padding: isMobile ? "15px 20px" : "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, transparent, rgba(232, 215, 163, 0.1))",
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#6B3A0F"
                  e.target.style.background = "linear-gradient(135deg, #E8D7A3, #F5E8C7)"
                  e.target.style.transform = "translateY(-2px) scale(1.02)"
                  e.target.style.boxShadow = "0 8px 25px rgba(107, 58, 15, 0.2)"
                  e.target.style.border = "1px solid rgba(215, 168, 110, 0.3)"
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#333"
                  e.target.style.background = "linear-gradient(135deg, transparent, rgba(232, 215, 163, 0.1))"
                  e.target.style.transform = "translateY(0) scale(1)"
                  e.target.style.boxShadow = "none"
                  e.target.style.border = "1px solid transparent"
                }}
              >
                <span style={{ fontSize: "16px" }}>{link.icon}</span>
                {link.text}
              </Link>
            ))}
          </div>

          {/* Enhanced Admin Account Section */}
          <div
            className="admin-nav-icons"
            style={{
              display: isMobile ? (isOpen ? "flex" : "none") : "flex",
              gap: isMobile ? "20px" : "15px",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-end",
              marginTop: isMobile ? "25px" : 0,
              transition: isMobile ? "all 0.4s ease-in-out" : "none",
              flexShrink: 0,
              position: "relative",
              minWidth: "fit-content",
            }}
          >
            {isAuthenticated && (
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                {/* Enhanced Admin Badge */}
                <div
                  className="admin-badge"
                  style={{
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "25px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>✨ ADMIN</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}
