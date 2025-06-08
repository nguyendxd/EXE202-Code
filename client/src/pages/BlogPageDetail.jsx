"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

export default function BlogDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [hoveredRelated, setHoveredRelated] = useState({})

  useEffect(() => {
    const fetchBlogDetail = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch blog detail
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`)
        const data = response.data
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
          throw new Error('Dữ liệu chi tiết blog không hợp lệ')
        }
        console.log("Chi tiết blog:", data)
        setBlog(data)

        // Fetch related blogs
        const relatedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs`, {
          params: {
            status: "published",
            limit: 3,
          },
        })
        const relatedData = relatedResponse.data
        if (Array.isArray(relatedData)) {
          const filteredRelated = relatedData.filter((b) => b._id !== id).slice(0, 3)
          setRelatedBlogs(filteredRelated)
        } else {
          console.warn("Dữ liệu related blogs không phải là mảng:", relatedData)
          setRelatedBlogs([])
        }
        setLoading(false)
      } catch (err) {
        setError(`Không thể tải bài viết. Vui lòng thử lại sau. Chi tiết: ${err.message}`)
        setLoading(false)
        console.error("Lỗi khi lấy chi tiết blog:", err.response?.data || err.message)
      }
    }

    if (id) {
      fetchBlogDetail()
    } else {
      setError("ID bài viết không hợp lệ")
      setLoading(false)
    }
  }, [id])

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) : "Ngày không xác định"
  }

  const handleBackClick = () => {
    navigate("/blog")
  }

  const handleRelatedClick = (blogId) => {
    navigate(`/blog/${blogId}`)
  }

  const buttonStyle = (hovered) => ({
    backgroundColor: hovered ? "#c69447" : "#D7A86E",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: hovered ? "0 4px 12px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.1)",
  })

  const relatedCardStyle = (hovered) => ({
    backgroundColor: "#FFF8E7",
    borderRadius: "12px",
    boxShadow: hovered ? "0 6px 12px rgba(0,0,0,0.15)" : "0 3px 6px rgba(0,0,0,0.1)",
    overflow: "hidden",
    cursor: "pointer",
    transform: hovered ? "translateY(-4px)" : "translateY(0)",
    transition: "all 0.3s ease",
    border: "2px solid #D7A86E",
  })

  if (loading) {
    return (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#FAF3E0",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#A47148", fontSize: "24px" }}>Đang tải bài viết...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#FAF3E0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <p style={{ color: "#A47148", fontSize: "24px", textAlign: "center" }}>{error}</p>
        <button onClick={handleBackClick} style={buttonStyle(false)}>
          Quay lại danh sách blog
        </button>
      </div>
    )
  }

  if (!blog) {
    return (
      <div
        style={{
          fontFamily: "'Roboto', sans-serif",
          backgroundColor: "#FAF3E0",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <p style={{ color: "#A47148", fontSize: "24px" }}>Không tìm thấy bài viết.</p>
        <button onClick={handleBackClick} style={buttonStyle(false)}>
          Quay lại danh sách blog
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        fontFamily: "'Roboto', sans-serif",
        backgroundColor: "#FAF3E0",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      {/* Back Button */}
      <div style={{ maxWidth: "800px", margin: "0 auto 30px auto" }}>
        <button
          onClick={handleBackClick}
          style={buttonStyle(false)}
          onMouseEnter={(e) => Object.assign(e.target.style, buttonStyle(true))}
          onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle(false))}
        >
          ← Quay lại danh sách blog
        </button>
      </div>

      {/* Main Content */}
      <article style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: "40px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "36px",
              color: "#A47148",
              margin: "0 0 20px 0",
              fontWeight: "bold",
              lineHeight: "1.2",
            }}
          >
            {blog.title}
          </h1>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#6D4C41",
                fontSize: "16px",
              }}
            >
              {blog.author?.avatar && (
                <img
                  src={blog.author.avatar || "/placeholder.svg"}
                  alt={blog.author?.username || "Author"}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <span style={{ fontWeight: "bold" }}>{blog.author?.username || "Pawmily Team"}</span>
            </div>

            <div style={{ color: "#8B4513", fontSize: "16px" }}>{formatDate(blog.createdAt)}</div>
          </div>

          {/* Featured Image */}
          {blog.images && blog.images.length > 0 && (
            <div
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                marginBottom: "40px",
              }}
            >
              <img
                src={blog.images[0] || "/placeholder.svg"}
                alt={blog.title}
                style={{
                  width: "100%",
                  height: "auto", // Thay đổi từ 400px cố định để responsive
                  maxHeight: "400px",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </header>

        {/* Content */}
        <div
          style={{
            backgroundColor: "#FFF8E7",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            marginBottom: "60px",
            border: "2px solid #D7A86E",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#5D4037",
              whiteSpace: "pre-wrap",
            }}
            dangerouslySetInnerHTML={{ __html: blog.content || '' }} // Thêm fallback
          />
        </div>

        {/* Additional Images */}
        {blog.images && blog.images.length > 1 && (
          <div style={{ marginBottom: "60px" }}>
            <h3
              style={{
                fontSize: "24px",
                color: "#A47148",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Hình ảnh khác
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {blog.images.slice(1).map((image, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${blog.title} - Hình ${index + 2}`}
                    style={{
                      width: "100%",
                      height: "auto", // Thay đổi từ 200px cố định để responsive
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <section style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3
            style={{
              fontSize: "28px",
              color: "#A47148",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            Bài viết liên quan
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "30px",
              justifyItems: "center",
            }}
          >
            {relatedBlogs.map((relatedBlog) => (
              <div
                key={relatedBlog._id}
                style={relatedCardStyle(hoveredRelated[relatedBlog._id])}
                onMouseEnter={() => setHoveredRelated((prev) => ({ ...prev, [relatedBlog._id]: true }))}
                onMouseLeave={() => setHoveredRelated((prev) => ({ ...prev, [relatedBlog._id]: false }))}
                onClick={() => handleRelatedClick(relatedBlog._id)}
              >
                <div
                  style={{
                    height: "150px",
                    backgroundColor: "#f5f5f5",
                    backgroundImage:
                      relatedBlog.images && relatedBlog.images.length > 0
                        ? `url(${relatedBlog.images[0]})`
                        : "url(https://via.placeholder.com/300x150?text=Blog+Image)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div style={{ padding: "20px" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8B4513",
                      marginBottom: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    {formatDate(relatedBlog.createdAt)} • {relatedBlog.author?.username || "Pawmily"}
                  </div>

                  <h4
                    style={{
                      fontSize: "16px",
                      color: "#5D4037",
                      margin: "0 0 10px 0",
                      fontWeight: "bold",
                      lineHeight: "1.3",
                      height: "40px",
                      overflow: "hidden",
                    }}
                  >
                    {relatedBlog.title}
                  </h4>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6D4C41",
                      margin: "0",
                      lineHeight: "1.4",
                      height: "42px",
                      overflow: "hidden",
                    }}
                  >
                    {(relatedBlog.content || "").substring(0, 80) + "..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}