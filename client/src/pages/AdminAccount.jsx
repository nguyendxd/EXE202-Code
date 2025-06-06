"use client"

import React, { useState, useEffect } from "react"
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
    activeUsers: 0,
    bannedUsers: 0,
    newUsersThisMonth: 0,
  })

  // Sample user data - replace with actual API call
  const sampleUsers = [
    {
      _id: "1",
      username: "john_doe",
      email: "john@example.com",
      fullName: "John Doe",
      phone: "+84123456789",
      avatar: "https://via.placeholder.com/60x60?text=JD",
      role: "user",
      status: "active",
      createdAt: "2024-01-15T00:00:00Z",
      lastLogin: "2024-12-15T10:30:00Z",
      totalPosts: 5,
      totalChats: 12,
    },
    {
      _id: "2",
      username: "jane_smith",
      email: "jane@example.com",
      fullName: "Jane Smith",
      phone: "+84987654321",
      avatar: "https://via.placeholder.com/60x60?text=JS",
      role: "moderator",
      status: "active",
      createdAt: "2024-02-20T00:00:00Z",
      lastLogin: "2024-12-14T15:45:00Z",
      totalPosts: 8,
      totalChats: 25,
    },
    {
      _id: "3",
      username: "mike_wilson",
      email: "mike@example.com",
      fullName: "Mike Wilson",
      phone: "+84555666777",
      avatar: "https://via.placeholder.com/60x60?text=MW",
      role: "user",
      status: "banned",
      createdAt: "2024-03-10T00:00:00Z",
      lastLogin: "2024-12-10T08:20:00Z",
      totalPosts: 2,
      totalChats: 3,
    },
    {
      _id: "4",
      username: "sarah_johnson",
      email: "sarah@example.com",
      fullName: "Sarah Johnson",
      phone: "+84111222333",
      avatar: "https://via.placeholder.com/60x60?text=SJ",
      role: "user",
      status: "inactive",
      createdAt: "2024-04-05T00:00:00Z",
      lastLogin: "2024-11-20T12:15:00Z",
      totalPosts: 15,
      totalChats: 8,
    },
    {
      _id: "5",
      username: "admin_user",
      email: "admin@pawmily.com",
      fullName: "Admin User",
      phone: "+84999888777",
      avatar: "https://via.placeholder.com/60x60?text=AU",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: "2024-12-15T16:00:00Z",
      totalPosts: 0,
      totalChats: 50,
    },
  ]

  useEffect(() => {
    // Simulate API call
    setUsers(sampleUsers)
    setFilteredUsers(sampleUsers)

    // Calculate stats
    const totalUsers = sampleUsers.length
    const activeUsers = sampleUsers.filter((u) => u.status === "active").length
    const bannedUsers = sampleUsers.filter((u) => u.status === "banned").length
    const newUsersThisMonth = sampleUsers.filter((u) => {
      const userDate = new Date(u.createdAt)
      const now = new Date()
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
    }).length

    setStats({ totalUsers, activeUsers, bannedUsers, newUsersThisMonth })
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
        return "#4CAF50"
      case "inactive":
        return "#FF9800"
      case "banned":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "#9C27B0"
      case "moderator":
        return "#2196F3"
      case "user":
        return "#607D8B"
      default:
        return "#9E9E9E"
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleStatusChange = (userId, newStatus) => {
    setUsers(users.map((user) => (user._id === userId ? { ...user, status: newStatus } : user)))
  }

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
  }

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <img src={pawLetter || "/placeholder.svg"} alt="Pawmily" style={{ height: "80px", objectFit: "contain" }} />
        <h1
          style={{
            fontSize: "36px",
            color: "#A47148",
            margin: "10px 0",
            fontWeight: "bold",
          }}
        >
          Quản lý tài khoản
        </h1>
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
          { title: "Đang hoạt động", value: stats.activeUsers, color: "#4CAF50", icon: "✅" },
          { title: "Bị cấm", value: stats.bannedUsers, color: "#F44336", icon: "🚫" },
          { title: "Mới tháng này", value: stats.newUsersThisMonth, color: "#FF9800", icon: "🆕" },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#FFFFFF",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              border: "2px solid #D7A86E",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "30px", marginBottom: "10px" }}>{stat.icon}</div>
            <div
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: stat.color,
                marginBottom: "5px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ color: "#6D4C41", fontSize: "16px" }}>{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "2px solid #D7A86E",
          maxWidth: "1200px",
          margin: "0 auto 30px auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "15px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 15px",
              borderRadius: "25px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "16px",
            }}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "12px 15px",
              borderRadius: "25px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "16px",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Bị cấm</option>
          </select>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={{
              padding: "12px 15px",
              borderRadius: "25px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "16px",
            }}
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-")
              setSortBy(field)
              setSortOrder(order)
            }}
            style={{
              padding: "12px 15px",
              borderRadius: "25px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "16px",
            }}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="lastLogin-desc">Đăng nhập gần đây</option>
            <option value="username-asc">Tên A-Z</option>
            <option value="username-desc">Tên Z-A</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "15px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          border: "2px solid #D7A86E",
          maxWidth: "1200px",
          margin: "0 auto",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#F5E8C7" }}>
                <th style={{ padding: "15px", textAlign: "left", color: "#A47148", fontWeight: "bold" }}>Người dùng</th>
                <th style={{ padding: "15px", textAlign: "left", color: "#A47148", fontWeight: "bold" }}>Liên hệ</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#A47148", fontWeight: "bold" }}>Vai trò</th>
                <th style={{ padding: "15px", textAlign: "center", color: "#A47148", fontWeight: "bold" }}>
                  Trạng thái
                </th>
                <th style={{ padding: "15px", textAlign: "center", color: "#A47148", fontWeight: "bold" }}>
                  Hoạt động
                </th>
                <th style={{ padding: "15px", textAlign: "center", color: "#A47148", fontWeight: "bold" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr
                  key={user._id}
                  style={{
                    borderBottom: "1px solid #F5E8C7",
                    backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FFFBF0",
                  }}
                >
                  <td style={{ padding: "15px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                          border: "2px solid #D7A86E",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: "bold", color: "#5D4037", fontSize: "16px" }}>{user.fullName}</div>
                        <div style={{ color: "#8B4513", fontSize: "14px" }}>@{user.username}</div>
                      </div>
                    </div>
                  </td>

                  <td style={{ padding: "15px" }}>
                    <div style={{ color: "#5D4037" }}>
                      <div style={{ marginBottom: "5px" }}>📧 {user.email}</div>
                      <div>📱 {user.phone}</div>
                    </div>
                  </td>

                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "15px",
                        border: "1px solid #D7A86E",
                        backgroundColor: getRoleColor(user.role),
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "15px",
                        border: "1px solid #D7A86E",
                        backgroundColor: getStatusColor(user.status),
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="banned">Bị cấm</option>
                    </select>
                  </td>

                  <td style={{ padding: "15px", textAlign: "center", color: "#6D4C41" }}>
                    <div style={{ fontSize: "14px", marginBottom: "5px" }}>📝 {user.totalPosts} bài viết</div>
                    <div style={{ fontSize: "14px", marginBottom: "5px" }}>💬 {user.totalChats} tin nhắn</div>
                    <div style={{ fontSize: "12px", color: "#A47148" }}>{formatDate(user.lastLogin)}</div>
                  </td>

                  <td style={{ padding: "15px", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                      <button
                        onClick={() => handleEditUser(user)}
                        style={{
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        style={{
                          backgroundColor: "#F44336",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        🗑️ Xóa
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
              padding: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              borderTop: "1px solid #F5E8C7",
            }}
          >
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D7A86E",
                backgroundColor: currentPage === 1 ? "#E0E0E0" : "#D7A86E",
                color: currentPage === 1 ? "#999" : "white",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
            >
              ← Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #D7A86E",
                  backgroundColor: currentPage === number ? "#A47148" : "#FFFFFF",
                  color: currentPage === number ? "white" : "#A47148",
                  cursor: "pointer",
                  fontWeight: currentPage === number ? "bold" : "normal",
                }}
              >
                {number}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #D7A86E",
                backgroundColor: currentPage === totalPages ? "#E0E0E0" : "#D7A86E",
                color: currentPage === totalPages ? "#999" : "white",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
              padding: "30px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              border: "3px solid #D7A86E",
            }}
          >
            <h3
              style={{
                color: "#A47148",
                fontSize: "24px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Chỉnh sửa thông tin người dùng
            </h3>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={selectedUser.avatar || "/placeholder.svg"}
                alt={selectedUser.username}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  border: "3px solid #D7A86E",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Tên đầy đủ
                </label>
                <input
                  type="text"
                  defaultValue={selectedUser.fullName}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  defaultValue={selectedUser.phone}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "25px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "2px solid #D7A86E",
                  backgroundColor: "#FFFFFF",
                  color: "#A47148",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  setShowUserModal(false)
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#D7A86E",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Lưu thay đổi
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
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              border: "3px solid #F44336",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚠️</div>
            <h3
              style={{
                color: "#F44336",
                fontSize: "24px",
                marginBottom: "15px",
              }}
            >
              Xác nhận xóa
            </h3>
            <p style={{ color: "#5D4037", marginBottom: "25px", lineHeight: "1.5" }}>
              Bạn có chắc chắn muốn xóa tài khoản của <strong>{userToDelete.fullName}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "2px solid #D7A86E",
                  backgroundColor: "#FFFFFF",
                  color: "#A47148",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Handle delete logic here
                  setUsers(users.filter((u) => u._id !== userToDelete._id))
                  setShowDeleteModal(false)
                  setUserToDelete(null)
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#F44336",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
