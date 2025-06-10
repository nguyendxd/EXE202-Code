"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import pawLetter from "../assets/PawLetter.png"

export default function AdminBlog() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [showBlogModal, setShowBlogModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [blogsPerPage] = useState(6)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [stats, setStats] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    newBlogsThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredButtons, setHoveredButtons] = useState({})

  useEffect(() => {
    setLoading(true)
    const token = localStorage.getItem('token');
    fetch('http://103.28.32.101:3000/api/blogs', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async res => {
        // Log status và headers
        console.log("Fetch /api/blogs status:", res.status)
        console.log("Fetch /api/blogs headers:", [...res.headers.entries()])
        if (!res.ok) {
          const text = await res.text()
          console.error("Fetch /api/blogs failed:", text)
          throw new Error(text)
        }
        return res.json()
      })
      .then(data => {
        console.log("Fetch /api/blogs data:", data)
        setBlogs(data)
        setFilteredBlogs(data)

        // Calculate stats
        const totalBlogs = data.length
        const publishedBlogs = data.filter((b) => b.status === "published").length
        const draftBlogs = data.filter((b) => b.status === "draft").length
        const now = new Date()
        const newBlogsThisMonth = data.filter((b) => {
          const blogDate = new Date(b.createdAt)
          return blogDate.getMonth() === now.getMonth() && blogDate.getFullYear() === now.getFullYear()
        }).length

        setStats({ totalBlogs, publishedBlogs, draftBlogs, newBlogsThisMonth })
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err)
        setError("Không thể tải dữ liệu blog. Vui lòng thử lại sau.")
        setLoading(false)
      })
  }, [])

  // Filter and search blogs
  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      if (filterStatus !== "draft" && blog.status === "draft") return false;
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.username.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || blog.status === filterStatus

      return matchesSearch && matchesStatus
    })

    // Sort blogs
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }, [blogs, searchTerm, filterStatus, sortBy, sortOrder])

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
      case "published":
        return "#4CAF50"
      case "draft":
        return "#FF9800"
      default:
        return "#9E9E9E"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return "Đã đăng"
      case "draft":
        return "Bản nháp"
      default:
        return "Không xác định"
    }
  }

  const handleCreateBlog = () => {
    // Navigate to blog creation page or open modal
    navigate("/admin/blog/create")
  }

  const handleEditBlog = (blog) => {
    navigate(`/admin/blog/edit/${blog._id}`)
  }

  const handleViewBlog = (blog) => {
    window.open(`/blog/${blog._id}`, "_blank")
  }

  const handleDeleteBlog = async (blog) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://103.28.32.101:3000/api/blogs/${blog._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "draft" })
      });
      if (!res.ok) throw new Error('Xóa mềm thất bại');
      const updated = await res.json();
      setBlogs(blogs.map((b) => b._id === blog._id ? updated : b));
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (err) {
      alert("Xóa mềm thất bại!");
    }
    setLoading(false)
  }

  const handleStatusChange = async (blogId, newStatus) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://103.28.32.101:3000/api/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      const updated = await res.json()
      setBlogs(blogs.map((blog) => (blog._id === blogId ? updated : blog)))
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!")
    }
    setLoading(false)
  }

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Button styles with hover effect
  const buttonStyle = (type, hovered = false) => {
    const baseStyle = {
      padding: "10px 16px",
      borderRadius: "8px",
      border: "none",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    }

    const styles = {
      create: {
        backgroundColor: hovered ? "#2E7D32" : "#4CAF50",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(76, 175, 80, 0.3)" : "0 3px 6px rgba(76, 175, 80, 0.2)",
      },
      view: {
        backgroundColor: hovered ? "#1565C0" : "#2196F3",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(33, 150, 243, 0.3)" : "0 3px 6px rgba(33, 150, 243, 0.2)",
      },
      edit: {
        backgroundColor: hovered ? "#F57C00" : "#FF9800",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(255, 152, 0, 0.3)" : "0 3px 6px rgba(255, 152, 0, 0.2)",
      },
      delete: {
        backgroundColor: hovered ? "#C62828" : "#F44336",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(244, 67, 54, 0.3)" : "0 3px 6px rgba(244, 67, 54, 0.2)",
      },
      publish: {
        backgroundColor: hovered ? "#2E7D32" : "#4CAF50",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(76, 175, 80, 0.3)" : "0 3px 6px rgba(76, 175, 80, 0.2)",
      },
      unpublish: {
        backgroundColor: hovered ? "#F57C00" : "#FF9800",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(255, 152, 0, 0.3)" : "0 3px 6px rgba(255, 152, 0, 0.2)",
      },
    }

    return { ...baseStyle, ...styles[type] }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                color: "#A47148",
                marginBottom: "20px",
                animation: "pulse 1.5s infinite ease-in-out",
              }}
            >
              Đang tải dữ liệu blog...
            </div>
            <style>{`
              @keyframes pulse {
                0% { opacity: 0.6; }
                50% { opacity: 1; }
                100% { opacity: 0.6; }
              }
            `}</style>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <div
            style={{
              textAlign: "center",
              backgroundColor: "#FFEBEE",
              padding: "30px",
              borderRadius: "12px",
              border: "2px solid #FFCDD2",
              maxWidth: "600px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
            <div
              style={{
                fontSize: "24px",
                color: "#D32F2F",
                marginBottom: "20px",
                fontWeight: "bold",
              }}
            >
              {error}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: "#D32F2F",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

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
          Quản lý Blog
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
          { title: "Tổng số bài viết", value: stats.totalBlogs, color: "#2196F3", icon: "📝" },
          { title: "Đã đăng", value: stats.publishedBlogs, color: "#4CAF50", icon: "✅" },
          { title: "Bản nháp", value: stats.draftBlogs, color: "#FF9800", icon: "📋" },
          { title: "Mới tháng này", value: stats.newBlogsThisMonth, color: "#9C27B0", icon: "🆕" },
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
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)"
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)"
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

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto 20px auto",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <button
          onClick={handleCreateBlog}
          onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, create: true }))}
          onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, create: false }))}
          style={buttonStyle("create", hoveredButtons.create)}
        >
          ✨ Tạo bài viết mới
        </button>

        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "14px",
              backgroundColor: "#FFF8E7",
              color: "#5D4037",
              cursor: "pointer",
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="draft">Bản nháp</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-")
              setSortBy(field)
              setSortOrder(order)
            }}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "2px solid #D7A86E",
              outline: "none",
              fontSize: "14px",
              backgroundColor: "#FFF8E7",
              color: "#5D4037",
              cursor: "pointer",
            }}
          >
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="updatedAt-desc">Cập nhật gần đây</option>
            <option value="title-asc">Tiêu đề A-Z</option>
            <option value="title-desc">Tiêu đề Z-A</option>
            <option value="views-desc">Lượt xem cao nhất</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 30px auto",
        }}
      >
        <input
          type="text"
          placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung hoặc tác giả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "15px 20px",
            borderRadius: "12px",
            border: "2px solid #D7A86E",
            outline: "none",
            fontSize: "16px",
            backgroundColor: "#FFF8E7",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
          }}
        />
      </div>

      {/* Blog Cards */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 30px auto" }}>
        {filteredBlogs.length === 0 ? (
          <div style={{
            backgroundColor: "#FFF8E7",
            padding: "40px",
            borderRadius: "15px",
            textAlign: "center",
            border: "2px dashed #D7A86E",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
            <h3 style={{ color: "#A47148", fontSize: "24px", marginBottom: "10px" }}>Không tìm thấy bài viết nào</h3>
            <p style={{ color: "#6D4C41", fontSize: "16px" }}>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
            gap: "25px",
          }}>
            {currentBlogs.map((blog) => (
              <div key={blog._id} style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                overflow: "hidden",
                border: "2px solid #D7A86E",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)"
              }}>
                {/* Blog Image */}
                <div style={{
                  height: "200px",
                  backgroundImage: `url(${blog.images && blog.images.length > 0 ? blog.images[0] : "https://via.placeholder.com/600x400?text=No+Image"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "relative",
                }}>
                </div>

                {/* Blog Content */}
                <div style={{ padding: "20px" }}>
                  {/* Blog Title */}
                  <h3 style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#5D4037",
                    marginBottom: "10px",
                    lineHeight: "1.4",
                    height: "50px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {blog.title}
                  </h3>

                  {/* Blog Meta */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "15px",
                  }}>
                    <img
                      src={blog.author.avatar || "/placeholder.svg"}
                      alt={blog.author.username}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "2px solid #D7A86E",
                      }}
                    />
                    <div style={{ fontSize: "14px", color: "#8B4513" }}>
                      {blog.author.username} • {formatDate(blog.createdAt)}
                    </div>
                  </div>

                  {/* Blog Content Preview */}
                  <p style={{
                    fontSize: "14px",
                    color: "#6D4C41",
                    marginBottom: "20px",
                    lineHeight: "1.5",
                    height: "63px",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {blog.content.substring(0, 150) + "..."}
                  </p>

                  {/* Action Buttons */}
                  <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}>
                    <button
                      onClick={() => handleEditBlog(blog)}
                      onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, [`edit-${blog._id}`]: true }))}
                      onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, [`edit-${blog._id}`]: false }))}
                      style={buttonStyle("edit", hoveredButtons[`edit-${blog._id}`])}
                    >
                      ✏️ Sửa
                    </button>

                    <button
                      onClick={() => handleDeleteBlog(blog)}
                      onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, [`delete-${blog._id}`]: true }))}
                      onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, [`delete-${blog._id}`]: false }))}
                      style={buttonStyle("delete", hoveredButtons[`delete-${blog._id}`])}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "1px solid #D7A86E",
              backgroundColor: currentPage === 1 ? "#E0E0E0" : "#D7A86E",
              color: currentPage === 1 ? "#999" : "white",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => paginate(number)}
              style={{
                padding: "10px 15px",
                borderRadius: "8px",
                border: "1px solid #D7A86E",
                backgroundColor: currentPage === number ? "#A47148" : "#FFFFFF",
                color: currentPage === number ? "white" : "#A47148",
                cursor: "pointer",
                fontWeight: currentPage === number ? "bold" : "normal",
                transition: "all 0.3s ease",
                minWidth: "40px",
              }}
              onMouseEnter={(e) => {
                if (currentPage !== number) {
                  e.target.style.backgroundColor = "#FFF8E7"
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== number) {
                  e.target.style.backgroundColor = "#FFFFFF"
                }
              }}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "1px solid #D7A86E",
              backgroundColor: currentPage === totalPages ? "#E0E0E0" : "#D7A86E",
              color: currentPage === totalPages ? "#999" : "white",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
          >
            Sau →
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && blogToDelete && (
        <div style={{
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
          backdropFilter: "blur(5px)",
        }}>
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "15px",
            padding: "30px",
            maxWidth: "450px",
            width: "90%",
            border: "3px solid #F44336",
            textAlign: "center",
            animation: "fadeIn 0.3s ease-out",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "15px" }}>⚠️</div>
            <h3 style={{
              color: "#F44336",
              fontSize: "24px",
              marginBottom: "15px",
            }}>
              Xác nhận xóa
            </h3>
            <p style={{ color: "#5D4037", marginBottom: "25px", lineHeight: "1.5" }}>
              Bạn có chắc chắn muốn xóa bài viết <strong>"{blogToDelete.title}"</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>

            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, cancelDelete: true }))}
                onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, cancelDelete: false }))}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  backgroundColor: "#FFFFFF",
                  color: "#A47148",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  transform: hoveredButtons.cancelDelete ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredButtons.cancelDelete ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  setLoading(true)
                  try {
                    const token = localStorage.getItem('token');
                    // Xóa blog trước
                    const res = await fetch(`http://103.28.32.101:3000/api/blogs/${blogToDelete._id}`, {
                      method: "DELETE",
                      headers: {
                        "Authorization": `Bearer ${token}`
                      }
                    });
                    if (!res.ok) throw new Error('Xóa thất bại');
                    const updated = await res.json();
                    setBlogs(blogs.map((b) => b._id === blogToDelete._id ? updated : b));
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                  } catch (err) {
                    alert("Xóa thất bại!");
                  }
                  setLoading(false)
                }}
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  backgroundColor: "#FFFFFF",
                  color: "#A47148",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                  transform: hoveredButtons.cancelDelete ? "translateY(-2px)" : "translateY(0)",
                  boxShadow: hoveredButtons.cancelDelete ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}