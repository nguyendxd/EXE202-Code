"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Loading from "../components/Loading"
import Pagination from "../components/Pagination"

export default function BlogPage() {
  const navigate = useNavigate()
  const [hoveredCards, setHoveredCards] = useState({})
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const response = await axios.get('http://103.28.32.101:3000/api/blogs', {
          params: {
            status: "published",
          },
        })
        console.log("Dữ liệu từ API:", response.data)
        const blogs = Array.isArray(response.data) ? response.data : []
        const mappedPosts = blogs.map((blog) => {
          console.log("Blog đang xử lý:", blog)
          return {
            id: blog._id || blog.id || "unknown-id",
            title: blog.title || "Chưa có tiêu đề",
            content: blog.content || "",
            excerpt: (blog.content || "").substring(0, 100) + "...",
            image:
              blog.images && blog.images.length > 0
                ? blog.images[0]
                : "https://via.placeholder.com/300x200?text=Blog+Image",
            date: blog.createdAt
              ? new Date(blog.createdAt).toLocaleDateString("vi-VN")
              : new Date().toLocaleDateString("vi-VN"),
            author: blog.author?.username || (typeof blog.author === "string" ? blog.author : "Không rõ"),
          }
        })

        console.log("Blog posts sau khi ánh xạ:", mappedPosts)
        setBlogPosts(mappedPosts)
        setLoading(false)
      } catch (err) {
        setError(`Không thể tải bài viết. Vui lòng thử lại sau. Chi tiết: ${err.message}`)
        setLoading(false)
        console.error("Lỗi khi lấy blogs:", err.response?.data || err.message)
      }
    }

    fetchBlogs()
  }, [])

  const handleBlogClick = (blogId) => {
    navigate(`/blog/${blogId}`)
  }

  const cardStyle = (hovered) => ({
    backgroundColor: "#FFF8E7",
    borderRadius: "15px",
    boxShadow: hovered ? "0 8px 16px rgba(0,0,0,0.2)" : "0 4px 8px rgba(0,0,0,0.1)",
    width: "280px",
    height: "350px",
    overflow: "hidden",
    cursor: "pointer",
    transform: hovered ? "translateY(-8px)" : "translateY(0)",
    transition: "all 0.3s ease",
    border: "2px solid #D7A86E",
  })

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)

  if (loading) {
    return <Loading />
  }

  if (error) {
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
        <p style={{ color: "#A47148", fontSize: "24px" }}>{error}</p>
      </div>
    )
  }

  if (blogPosts.length === 0) {
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
        <p style={{ color: "#A47148", fontSize: "24px" }}>Không có bài viết nào để hiển thị.</p>
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
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1
          style={{
            fontSize: "24px",
            color: "#A47148",
            margin: "0 0 20px 0",
            fontWeight: "bold",
          }}
        >
          Blog
        </h1>
        <h2
          style={{
            fontSize: "18px",
            color: "#6D4C41",
            margin: "0",
            fontWeight: "normal",
          }}
        >
          Những câu chuyện của các bé động vật
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1400px",
          margin: "0 auto 60px auto",
          justifyItems: "start",
          paddingLeft: "60px",
        }}
      >
        {currentPosts.map((post) => (
          <div
            key={post.id}
            style={cardStyle(hoveredCards[post.id])}
            onMouseEnter={() => setHoveredCards((prev) => ({ ...prev, [post.id]: true }))}
            onMouseLeave={() => setHoveredCards((prev) => ({ ...prev, [post.id]: false }))}
            onClick={() => handleBlogClick(post.id)}
          >
            <div
              style={{
                height: "180px",
                backgroundColor: "#f5f5f5",
                backgroundImage: `url(${post.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            <div
              style={{
                height: "170px",
                backgroundColor: "#D7A86E",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8B4513",
                    marginBottom: "8px",
                    fontWeight: "bold",
                  }}
                >
                  {post.date} • {post.author}
                </div>
                <h3
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
                  {post.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#6D4C41",
                    margin: "0",
                    lineHeight: "1.4",
                    height: "56px",
                    overflow: "hidden",
                  }}
                >
                  {post.excerpt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}
