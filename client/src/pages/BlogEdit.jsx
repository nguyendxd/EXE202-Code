"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import pawLetter from "../assets/PawLetter.png"

export default function BlogEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
    status: "draft",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [hoveredButtons, setHoveredButtons] = useState({})
  const [imagePreview, setImagePreview] = useState([])
  const [activeTab, setActiveTab] = useState("edit")
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Không thể tải dữ liệu blog");
        const data = await res.json();
        setBlog(data);
        setFormData({
          title: data.title || "",
          content: data.content || "",
          images: data.images || [],
          status: data.status || "draft",
        });
        setImagePreview(data.images || []);
        setWordCount((data.content || "").split(/\s+/).filter((word) => word.length > 0).length);
        setCharacterCount((data.content || "").length);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu blog. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "content") {
      setWordCount(value.split(/\s+/).filter((word) => word.length > 0).length)
      setCharacterCount(value.length)
    }
  }

  const handleImageUpload = (e) => {
    alert("Chức năng upload ảnh mới đã bị tắt. Bạn chỉ có thể xóa hoặc giữ ảnh cũ.");
  };

  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem("token");
      const updateData = {
        title: formData.title,
        content: formData.content,
        images: formData.images,
        status: formData.status,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error("Cập nhật blog thất bại");
      alert("Bài viết đã được cập nhật thành công!");
      navigate("/admin/blog");
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const buttonStyle = (type, hovered = false) => {
    const baseStyle = {
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transform: hovered ? "translateY(-2px)" : "translateY(0)",
    }

    const styles = {
      save: {
        backgroundColor: hovered ? "#2E7D32" : "#4CAF50",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(76, 175, 80, 0.3)" : "0 3px 6px rgba(76, 175, 80, 0.2)",
      },
      publish: {
        backgroundColor: hovered ? "#1565C0" : "#2196F3",
        color: "white",
        boxShadow: hovered ? "0 6px 12px rgba(33, 150, 243, 0.3)" : "0 3px 6px rgba(33, 150, 243, 0.2)",
      },
      cancel: {
        backgroundColor: hovered ? "#F5F5F5" : "#FFFFFF",
        color: "#A47148",
        border: "2px solid #D7A86E",
        boxShadow: hovered ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
      },
      preview: {
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
              onClick={() => navigate("/admin/blog")}
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
              Quay lại danh sách
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
        <img src={pawLetter || "/placeholder.svg"} alt="Pawmily" style={{ height: "60px", objectFit: "contain" }} />
        <h1
          style={{
            fontSize: "32px",
            color: "#A47148",
            margin: "10px 0",
            fontWeight: "bold",
          }}
        >
          ✏️ Chỉnh sửa bài viết
        </h1>
        <p style={{ color: "#6D4C41", fontSize: "16px" }}>Cập nhật nội dung và thông tin bài viết của bạn</p>
      </div>

      {/* Navigation Breadcrumb */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto 20px auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            color: "#8B4513",
            marginBottom: "20px",
          }}
        >
          <button
            onClick={() => navigate("/admin/blog")}
            style={{
              background: "none",
              border: "none",
              color: "#A47148",
              cursor: "pointer",
              textDecoration: "underline",
              fontSize: "14px",
            }}
          >
            Quản lý Blog
          </button>
          <span>›</span>
          <span>Chỉnh sửa</span>
          <span>›</span>
          <span style={{ fontWeight: "bold" }}>{formData.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 300px",
            gap: "30px",
            alignItems: "start",
          }}
        >
          {/* Main Form */}
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
              padding: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              border: "2px solid #D7A86E",
            }}
          >
            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "30px",
                borderBottom: "2px solid #F5F5F5",
              }}
            >
              {[
                { id: "edit", label: "✏️ Chỉnh sửa", icon: "✏️" },
                { id: "preview", label: "👁️ Xem trước", icon: "👁️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    backgroundColor: "transparent",
                    color: activeTab === tab.id ? "#A47148" : "#8B4513",
                    fontWeight: activeTab === tab.id ? "bold" : "normal",
                    borderBottom: activeTab === tab.id ? "3px solid #A47148" : "3px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontSize: "16px",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "edit" ? (
              <div style={{ display: "grid", gap: "25px" }}>
                {/* Title */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#5D4037",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Tiêu đề bài viết *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                    style={{
                      width: "100%",
                      padding: "15px 20px",
                      borderRadius: "10px",
                      border: "2px solid #D7A86E",
                      outline: "none",
                      fontSize: "18px",
                      backgroundColor: "#FFF8E7",
                      transition: "border-color 0.3s ease",
                      fontWeight: "bold",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#A47148")}
                    onBlur={(e) => (e.target.style.borderColor = "#D7A86E")}
                  />
                </div>

                {/* Content */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <label
                      style={{
                        color: "#5D4037",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Nội dung bài viết *
                    </label>
                    <div style={{ fontSize: "14px", color: "#8B4513" }}>
                      {wordCount} từ • {characterCount} ký tự
                    </div>
                  </div>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Viết nội dung bài viết của bạn ở đây... Bạn có thể sử dụng Markdown để định dạng văn bản."
                    rows={20}
                    style={{
                      width: "100%",
                      padding: "20px",
                      borderRadius: "10px",
                      border: "2px solid #D7A86E",
                      outline: "none",
                      fontSize: "16px",
                      backgroundColor: "#FFF8E7",
                      resize: "vertical",
                      fontFamily: "Monaco, Consolas, 'Courier New', monospace",
                      lineHeight: "1.6",
                      transition: "border-color 0.3s ease",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#A47148")}
                    onBlur={(e) => (e.target.style.borderColor = "#D7A86E")}
                  />
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8B4513",
                      marginTop: "8px",
                      fontStyle: "italic",
                    }}
                  >
                    💡 Mẹo: Sử dụng # cho tiêu đề, ** cho in đậm, * cho in nghiêng, và - cho danh sách
                  </div>
                </div>

                {/* Images */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#5D4037",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    Hình ảnh
                  </label>

                  {/* Current Images */}
                  {imagePreview.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                        gap: "15px",
                        marginBottom: "20px",
                        padding: "20px",
                        backgroundColor: "#FFF8E7",
                        borderRadius: "10px",
                        border: "2px solid #D7A86E",
                      }}
                    >
                      {imagePreview.map((image, index) => (
                        <div
                          key={index}
                          style={{
                            position: "relative",
                            borderRadius: "8px",
                            overflow: "hidden",
                            aspectRatio: "1",
                            border: "2px solid #D7A86E",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Blog image ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                          {index === 0 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "8px",
                                left: "8px",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                              }}
                            >
                              Ảnh chính
                            </div>
                          )}
                          <button
                            onClick={() => removeImage(index)}
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              backgroundColor: "#F44336",
                              color: "white",
                              border: "none",
                              borderRadius: "50%",
                              width: "24px",
                              height: "24px",
                              cursor: "pointer",
                              fontSize: "12px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  <div
                    style={{
                      border: "2px dashed #D7A86E",
                      borderRadius: "10px",
                      padding: "30px",
                      textAlign: "center",
                      backgroundColor: "#FFF8E7",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#A47148"
                      e.target.style.backgroundColor = "#F5F5DC"
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "#D7A86E"
                      e.target.style.backgroundColor = "#FFF8E7"
                    }}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      style={{
                        cursor: "pointer",
                        display: "block",
                      }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "15px" }}>📸</div>
                      <div
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          color: "#A47148",
                          marginBottom: "8px",
                        }}
                      >
                        Thêm hình ảnh
                      </div>
                      <div style={{ fontSize: "14px", color: "#8B4513" }}>
                        Kéo thả hoặc click để chọn ảnh (JPG, PNG, GIF)
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              /* Preview Tab */
              <div
                style={{
                  padding: "20px",
                  backgroundColor: "#FFF8E7",
                  borderRadius: "10px",
                  border: "2px solid #D7A86E",
                  minHeight: "500px",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#5D4037",
                    marginBottom: "20px",
                    lineHeight: "1.3",
                  }}
                >
                  {formData.title || "Tiêu đề bài viết"}
                </h2>

                <div
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.8",
                    color: "#5D4037",
                    whiteSpace: "pre-wrap",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formData.content
                      .replace(
                        /^# (.*$)/gim,
                        '<h1 style="font-size: 24px; font-weight: bold; margin: 20px 0 15px 0; color: #A47148;">$1</h1>',
                      )
                      .replace(
                        /^## (.*$)/gim,
                        '<h2 style="font-size: 20px; font-weight: bold; margin: 18px 0 12px 0; color: #A47148;">$1</h2>',
                      )
                      .replace(
                        /^### (.*$)/gim,
                        '<h3 style="font-size: 18px; font-weight: bold; margin: 16px 0 10px 0; color: #A47148;">$1</h3>',
                      )
                      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
                      .replace(/^- (.*$)/gim, '<li style="margin: 5px 0; padding-left: 10px;">$1</li>')
                      .replace(/\n/g, "<br>"),
                  }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "grid", gap: "20px" }}>
            {/* Blog Info */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                border: "2px solid #D7A86E",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#A47148",
                  marginBottom: "20px",
                }}
              >
                📊 Thông tin bài viết
              </h3>

              <div style={{ display: "grid", gap: "15px" }}>
                {/* Status */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#5D4037",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "2px solid #D7A86E",
                      outline: "none",
                      fontSize: "14px",
                      backgroundColor: "#FFF8E7",
                      cursor: "pointer",
                    }}
                  >
                    <option value="draft">📝 Bản nháp</option>
                    <option value="published">✅ Đã đăng</option>
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      color: "#5D4037",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                  >
                    Tác giả
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 15px",
                      backgroundColor: "#FFF8E7",
                      borderRadius: "8px",
                      border: "2px solid #D7A86E",
                    }}
                  >
                    <img
                      src={blog?.author?.avatar || "/placeholder.svg"}
                      alt={blog?.author?.username}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        border: "2px solid #D7A86E",
                      }}
                    />
                    <div style={{ fontSize: "14px", color: "#5D4037", fontWeight: "bold" }}>
                      {blog?.author?.username}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div>
                  <div style={{ fontSize: "12px", color: "#8B4513", marginBottom: "5px" }}>
                    <strong>Tạo:</strong> {blog && formatDate(blog.createdAt)}
                  </div>
                  <div style={{ fontSize: "12px", color: "#8B4513" }}>
                    <strong>Cập nhật:</strong> {blog && formatDate(blog.updatedAt)}
                  </div>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#E3F2FD",
                      borderRadius: "8px",
                      border: "1px solid #BBDEFB",
                    }}
                  >
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1976D2" }}>{blog?.views || 0}</div>
                    <div style={{ fontSize: "12px", color: "#1565C0" }}>Lượt xem</div>
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#E8F5E8",
                      borderRadius: "8px",
                      border: "1px solid #C8E6C9",
                    }}
                  >
                    <div style={{ fontSize: "18px", fontWeight: "bold", color: "#388E3C" }}>{blog?.comments || 0}</div>
                    <div style={{ fontSize: "12px", color: "#2E7D32" }}>Bình luận</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                padding: "25px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                border: "2px solid #D7A86E",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#A47148",
                  marginBottom: "20px",
                }}
              >
                🎯 Hành động
              </h3>

              <div style={{ display: "grid", gap: "15px" }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, publish: true }))}
                  onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, publish: false }))}
                  style={buttonStyle("publish", hoveredButtons.publish)}
                >
                  {saving ? "⏳ Đang cập nhật..." : "🚀 Đăng bài viết"}
                </button>

                <button
                  onClick={() => navigate("/admin/blog")}
                  onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, cancel: true }))}
                  onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, cancel: false }))}
                  style={buttonStyle("cancel", hoveredButtons.cancel)}
                >
                  ❌ Hủy và quay lại
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div
              style={{
                backgroundColor: "#FFF3E0",
                borderRadius: "15px",
                padding: "20px",
                border: "2px solid #FFE0B2",
              }}
            >
              <h4
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#E65100",
                  marginBottom: "15px",
                }}
              >
                💡 Mẹo viết bài
              </h4>
              <ul
                style={{
                  fontSize: "14px",
                  color: "#BF360C",
                  lineHeight: "1.6",
                  paddingLeft: "20px",
                  margin: 0,
                }}
              >
                <li>Sử dụng tiêu đề hấp dẫn và mô tả</li>
                <li>Thêm ảnh chất lượng cao</li>
                <li>Chia nhỏ nội dung thành đoạn</li>
                <li>Sử dụng từ khóa phù hợp</li>
                <li>Kiểm tra chính tả trước khi đăng</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
