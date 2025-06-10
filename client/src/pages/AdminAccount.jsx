"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import pawLetter from "../assets/PawLetter.png"
import AdminLayout from "../components/AdminLayout"

export default function AdminAccount() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterRole, setFilterRole] = useState("all")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0,
    newUsersThisMonth: 0,
  })

  // Đường dẫn avatar mặc định
  const DEFAULT_AVATAR_URL = 'https://ik.imagekit.io/nguyenn120404/default-pet-image/download.png';

  useEffect(() => {
    // Fetch all user data from backend (bao gồm cả bị cấm)
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        // Hiển thị user chưa bị cấm
        setUsers(data.filter(u => !u.isDeleted));
        setFilteredUsers(data.filter(u => !u.isDeleted));

        // Thống kê
        const totalUsers = data.length;
        const bannedUsers = data.filter(u => u.isDeleted === true).length;
        const newUsersThisMonth = data.filter((u) => {
          const userDate = new Date(u.createdAt);
          const now = new Date();
          return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
        }).length;
        setStats({ totalUsers, bannedUsers, newUsersThisMonth });
      } catch (err) {
        setUsers([]);
        setFilteredUsers([]);
        setStats({ totalUsers: 0, bannedUsers: 0, newUsersThisMonth: 0 });
      }
    };
    fetchUsers();
  }, [])

  // Filter and search users
  useEffect(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || user.status === filterStatus
      const matchesRole = filterRole === "all" || user.role === filterRole

      return matchesSearch && matchesStatus && matchesRole
    })

    // Sort users
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdAt" || sortBy === "lastLogin") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm, filterStatus, filterRole, sortBy, sortOrder])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "linear-gradient(135deg, #4CAF50, #45a049)"
      case "inactive":
        return "linear-gradient(135deg, #FF9800, #f57c00)"
      case "banned":
        return "linear-gradient(135deg, #F44336, #d32f2f)"
      default:
        return "linear-gradient(135deg, #9E9E9E, #757575)"
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "linear-gradient(135deg, #9C27B0, #7b1fa2)"
      case "moderator":
        return "linear-gradient(135deg, #2196F3, #1976d2)"
      case "user":
        return "linear-gradient(135deg, #607D8B, #455a64)"
      default:
        return "linear-gradient(135deg, #9E9E9E, #757575)"
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleDeleteUser = async (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userToDelete._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userToDelete._id));
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        alert('Cấm thất bại!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
  }

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
  }

  const handleSaveUser = async (updatedFields) => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const newUser = await res.json();
        setUsers(users.map((u) => u._id === newUser._id ? newUser : u));
        setShowUserModal(false);
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (err) {
      alert('Lỗi kết nối server!');
    }
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <AdminLayout>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -200px 0;
            }
            100% {
              background-position: calc(200px + 100%) 0;
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

          @keyframes glow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
            }
          }

          .fade-in {
            animation: fadeInUp 0.6s ease-out;
          }

          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            background-size: 200px 100%;
            animation: shimmer 2s infinite;
          }

          .pulse {
            animation: pulse 2s infinite;
          }

          .glow {
            animation: glow 3s ease-in-out infinite;
          }

          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .gradient-text {
            background: linear-gradient(135deg, #D4AF37, #B8860B, #DAA520);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          .modern-input {
            position: relative;
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid transparent;
            background-clip: padding-box;
            transition: all 0.3s ease;
          }

          .modern-input:focus {
            background: rgba(255, 255, 255, 1);
            border-color: #D4AF37;
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
            transform: scale(1.02);
          }

          .modern-button {
            position: relative;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .modern-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          }

          .modern-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            transition: left 0.5s;
          }

          .modern-button:hover::before {
            left: 100%;
          }

          .table-row {
            transition: all 0.3s ease;
          }

          .table-row:hover {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(255, 255, 255, 0.9)) !important;
            transform: scale(1.01);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          }

          .status-badge {
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }

          .status-badge::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .status-badge:hover::before {
            opacity: 1;
          }
        `}
      </style>

      {/* Header */}
      <div className="fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={pawLetter || "/placeholder.svg"}
            alt="Pawmily"
            style={{
              height: "100px",
              objectFit: "contain",
              filter: "drop-shadow(0 4px 20px rgba(212, 175, 55, 0.3))",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "-10px",
              width: "20px",
              height: "20px",
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          ></div>
        </div>
        <h1
          className="gradient-text"
          style={{
            fontSize: "48px",
            margin: "20px 0",
            fontWeight: "800",
            letterSpacing: "-1px",
            textShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
          }}
        >
          Quản lý tài khoản
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#8B7355",
            fontWeight: "500",
            opacity: "0.8",
          }}
        >
          Quản lý và theo dõi tất cả người dùng trong hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto 30px auto",
        }}
      >
        {[
          { title: "Tổng người dùng", value: stats.totalUsers, color: "#2196F3", icon: "👥" },
          { title: "Bị cấm", value: stats.bannedUsers, color: "#F44336", icon: "🚫" },
          { title: "Mới tháng này", value: stats.newUsersThisMonth, color: "#FF9800", icon: "🆕" },
        ].map((stat, index) => (
          <div
            key={index}
            className="glass-card hover-lift fade-in"
            style={{
              background: stat.color,
              padding: "30px",
              borderRadius: "24px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            ></div>

            <div style={{ position: "relative", zIndex: 2 }}>
              <div
                style={{
                  fontSize: "40px",
                  marginBottom: "15px",
                  filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.2))",
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "900",
                  color: "white",
                  marginBottom: "8px",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {stat.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div
        className="glass-card fade-in"
        style={{
          padding: "30px",
          borderRadius: "24px",
          maxWidth: "1400px",
          margin: "0 auto 40px auto",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          animationDelay: "0.4s",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#5D4037",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          🔍 Tìm kiếm và lọc
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "20px",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="modern-input"
              style={{
                width: "100%",
                padding: "16px 20px",
                borderRadius: "16px",
                border: "2px solid rgba(212, 175, 55, 0.3)",
                outline: "none",
                fontSize: "16px",
                fontWeight: "500",
              }}
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="modern-input"
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              outline: "none",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <option value="all">📊 Tất cả trạng thái</option>
            <option value="active">✅ Hoạt động</option>
            <option value="inactive">⏸️ Không hoạt động</option>
            <option value="banned">🚫 Bị cấm</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="modern-input"
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              outline: "none",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <option value="all">👤 Tất cả vai trò</option>
            <option value="admin">👑 Admin</option>
            <option value="moderator">🛡️ Moderator</option>
            <option value="user">👤 User</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-")
              setSortBy(field)
              setSortOrder(order)
            }}
            className="modern-input"
            style={{
              padding: "16px 20px",
              borderRadius: "16px",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              outline: "none",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <option value="createdAt-desc">🆕 Mới nhất</option>
            <option value="createdAt-asc">📅 Cũ nhất</option>
            <option value="lastLogin-desc">🕐 Đăng nhập gần đây</option>
            <option value="username-asc">🔤 Tên A-Z</option>
            <option value="username-desc">🔤 Tên Z-A</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        className="glass-card fade-in"
        style={{
          borderRadius: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
          animationDelay: "0.6s",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #D4AF37, #B8860B)",
            padding: "20px 30px",
            color: "white",
          }}
        >
          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            👥 Danh sách người dùng ({filteredUsers.length})
          </h3>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(255, 255, 255, 0.5))",
                }}
              >
                <th
                  style={{
                    padding: "20px",
                    textAlign: "left",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  👤 Người dùng
                </th>
                <th
                  style={{
                    padding: "20px",
                    textAlign: "left",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  📞 Liên hệ
                </th>
                <th
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  🎭 Vai trò
                </th>
                <th
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  ⚙️ Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className="table-row"
                  style={{
                    borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
                    backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,251,240,0.8)",
                  }}
                >
                  <td style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={user.avatar && user.avatar.startsWith('http') ? user.avatar : DEFAULT_AVATAR_URL}
                          alt={user.username}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            border: "2px solid #D7A86E",
                          }}
                        />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: "700",
                            color: "#5D4037",
                            fontSize: "18px",
                            marginBottom: "4px",
                          }}
                        >
                          {user.username}
                        </div>
                        <div
                          style={{
                            color: "#8B7355",
                            fontSize: "14px",
                            fontWeight: "500",
                          }}
                        >
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px" }}>
                    <div style={{ color: "#5D4037" }}>
                      <div
                        style={{
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        📧 {user.email}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                        }}
                      >
                        📱 {user.phone}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "20px", textAlign: "center" }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="status-badge"
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: "none",
                        background: getRoleColor(user.role),
                        color: "white",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      <option value="user">👤 User</option>
                      <option value="moderator">🛡️ Moderator</option>
                      <option value="admin">👑 Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: "20px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="modern-button"
                        style={{
                          background: "linear-gradient(135deg, #2196F3, #1976d2)",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="modern-button"
                        style={{
                          background: "linear-gradient(135deg, #F44336, #d32f2f)",
                          color: "white",
                          border: "none",
                          borderRadius: "12px",
                          padding: "10px 16px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        🗑️ Cấm
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              padding: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              borderTop: "1px solid rgba(212, 175, 55, 0.2)",
              background: "linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(255, 255, 255, 0.5))",
            }}
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="modern-button"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background:
                  currentPage === 1
                    ? "linear-gradient(135deg, #E0E0E0, #BDBDBD)"
                    : "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: currentPage === 1 ? "#999" : "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className="modern-button"
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    currentPage === number
                      ? "linear-gradient(135deg, #D4AF37, #B8860B)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                  color: currentPage === number ? "white" : "#5D4037",
                  cursor: "pointer",
                  fontWeight: currentPage === number ? "700" : "600",
                  fontSize: "14px",
                  minWidth: "44px",
                }}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="modern-button"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background:
                  currentPage === totalPages
                    ? "linear-gradient(135deg, #E0E0E0, #BDBDBD)"
                    : "linear-gradient(135deg, #D4AF37, #B8860B)",
                color: currentPage === totalPages ? "#999" : "white",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                fontWeight: "700",
                fontSize: "14px",
              }}
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <div
            className="glass-card"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "2px solid rgba(212, 175, 55, 0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              className="gradient-text"
              style={{
                fontSize: "28px",
                marginBottom: "30px",
                textAlign: "center",
                fontWeight: "800",
              }}
            >
              ✏️ Chỉnh sửa thông tin người dùng
            </h3>

            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={selectedUser.avatar && selectedUser.avatar.startsWith('http') ? selectedUser.avatar : DEFAULT_AVATAR_URL}
                  alt={selectedUser.username}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    border: "4px solid #D4AF37",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                    borderRadius: "50%",
                    padding: "8px",
                    cursor: "pointer",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  📷
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  👤 Tên đăng nhập
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser.username}
                  id="edit-username"
                  className="modern-input"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    border: "2px solid rgba(212, 175, 55, 0.3)",
                    outline: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  📧 Email
                </label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  id="edit-email"
                  className="modern-input"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    border: "2px solid rgba(212, 175, 55, 0.3)",
                    outline: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#5D4037",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  📱 Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue={selectedUser.phone}
                  id="edit-phone"
                  className="modern-input"
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    border: "2px solid rgba(212, 175, 55, 0.3)",
                    outline: "none",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "40px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowUserModal(false)}
                className="modern-button"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  border: "2px solid #D4AF37",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                  color: "#D4AF37",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                ❌ Hủy
              </button>
              <button
                onClick={() => {
                  const updatedFields = {
                    username: document.querySelector('#edit-username')?.value || selectedUser.username,
                    email: document.querySelector('#edit-email')?.value || selectedUser.email,
                    phone: document.querySelector('#edit-phone')?.value || selectedUser.phone,
                  };
                  handleSaveUser(updatedFields);
                }}
                className="modern-button"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  border: "none",
                  background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                💾 Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <div
            className="glass-card"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
              borderRadius: "24px",
              padding: "40px",
              maxWidth: "500px",
              width: "90%",
              border: "2px solid rgba(244, 67, 54, 0.3)",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(244, 67, 54, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                marginBottom: "20px",
                filter: "drop-shadow(0 4px 20px rgba(244, 67, 54, 0.3))",
              }}
            >
              ⚠️
            </div>
            <h3
              style={{
                color: "#F44336",
                fontSize: "28px",
                marginBottom: "20px",
                fontWeight: "800",
              }}
            >
              🗑️ Xác nhận cấm
            </h3>
            <p
              style={{
                color: "#5D4037",
                marginBottom: "30px",
                lineHeight: "1.6",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Bạn có chắc chắn muốn cấm tài khoản của{" "}
              <strong style={{ color: "#F44336" }}>{userToDelete.username}</strong>?
              <br />
              <span style={{ color: "#F44336", fontWeight: "700" }}>Hành động này không thể hoàn tác.</span>
            </p>

            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="modern-button"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  border: "2px solid #D4AF37",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
                  color: "#D4AF37",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                ❌ Hủy
              </button>
              <button
                onClick={confirmDeleteUser}
                className="modern-button"
                style={{
                  padding: "16px 32px",
                  borderRadius: "16px",
                  border: "none",
                  background: "linear-gradient(135deg, #F44336, #d32f2f)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                🚫 Cấm tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
