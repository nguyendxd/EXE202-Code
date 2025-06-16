"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import pawLetter from "../assets/PawLetter.png"

export default function BlogCreate() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
  })
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [hoveredButtons, setHoveredButtons] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/")
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isValidType && isValidSize
    })

    if (validFiles.length !== files.length) {
      alert("Một số file không hợp lệ. Chỉ chấp nhận file ảnh dưới 5MB.")
    }

    // Create preview URLs
    const newPreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }))

    setImages((prev) => [...prev, ...validFiles])
    setImagePreview((prev) => [...prev, ...newPreviews])
  }

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    setImagePreview((prev) => {
      const newPreviews = prev.filter((_, index) => index !== indexToRemove)
      // Revoke URL to prevent memory leaks
      if (prev[indexToRemove]) {
        URL.revokeObjectURL(prev[indexToRemove].url)
      }
      return newPreviews
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc"
    } else if (formData.title.length < 10) {
      newErrors.title = "Tiêu đề phải có ít nhất 10 ký tự"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc"
    } else if (formData.content.length < 100) {
      newErrors.content = "Nội dung phải có ít nhất 100 ký tự"
    }

    if (images.length === 0) {
      newErrors.images = "Vui lòng thêm ít nhất một hình ảnh"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (status) => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      form.append("title", formData.title)
      form.append("content", formData.content)
      form.append("status", status)
      images.forEach((img) => form.append("images", img))

      const res = await fetch(`${import.meta.env.VITE_API_URL}/blogs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: form
      })

      if (!res.ok) throw new Error("Tạo blog thất bại")
      navigate("/admin/blog")
    } catch (error) {
      console.error("Error creating blog:", error)
      alert("Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  const buttonStyle = (type, hovered = false) => {
    const baseStyle = {
      padding: "12px 24px",
      borderRadius: "10px",
      border: "none",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      opacity: loading ? 0.7 : 1,
    }

    const styles = {
      save: {
        backgroundColor: hovered ? "#F57C00" : "#FF9800",
        color: "white",
        boxShadow: hovered ? "0 6px 16px rgba(255, 152, 0, 0.3)" : "0 4px 12px rgba(255, 152, 0, 0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      },
      publish: {
        backgroundColor: hovered ? "#2E7D32" : "#4CAF50",
        color: "white",
        boxShadow: hovered ? "0 6px 16px rgba(76, 175, 80, 0.3)" : "0 4px 12px rgba(76, 175, 80, 0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      },
      cancel: {
        backgroundColor: hovered ? "#F5F5F5" : "#FFFFFF",
        color: "#A47148",
        border: "2px solid #D7A86E",
        boxShadow: hovered ? "0 4px 12px rgba(0, 0, 0, 0.1)" : "0 2px 6px rgba(0, 0, 0, 0.05)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      },
      upload: {
        backgroundColor: hovered ? "#1565C0" : "#2196F3",
        color: "white",
        boxShadow: hovered ? "0 6px 16px rgba(33, 150, 243, 0.3)" : "0 4px 12px rgba(33, 150, 243, 0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      },
    }

    return { ...baseStyle, ...styles[type] }
  }

  const inputStyle = (hasError = false) => ({
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: `2px solid ${hasError ? "#F44336" : "#D7A86E"}`,
    outline: "none",
    fontSize: "16px",
    backgroundColor: "#FFF8E7",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
  })

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
          Tạo bài viết mới
        </h1>
        <p style={{ color: "#6D4C41", fontSize: "18px" }}>Chia sẻ những câu chuyện thú vị về thú cưng</p>
      </div>

      {/* Main Form */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "2px solid #D7A86E",
        }}
      >
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "grid",
            gap: "25px",
          }}
        >
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
              style={inputStyle(errors.title)}
              onFocus={(e) => (e.target.style.borderColor = "#A47148")}
              onBlur={(e) => (e.target.style.borderColor = errors.title ? "#F44336" : "#D7A86E")}
            />
            {errors.title && (
              <div style={{ color: "#F44336", fontSize: "14px", marginTop: "5px" }}>⚠️ {errors.title}</div>
            )}
          </div>

          {/* Content */}
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
              Nội dung bài viết *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Viết nội dung bài viết của bạn tại đây..."
              rows={12}
              style={{
                ...inputStyle(errors.content),
                resize: "vertical",
                minHeight: "300px",
                lineHeight: "1.6",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#A47148")}
              onBlur={(e) => (e.target.style.borderColor = errors.content ? "#F44336" : "#D7A86E")}
            />
            {errors.content && (
              <div style={{ color: "#F44336", fontSize: "14px", marginTop: "5px" }}>⚠️ {errors.content}</div>
            )}
            <div style={{ fontSize: "14px", color: "#8B4513", marginTop: "5px" }}>
              {formData.content.length} ký tự (tối thiểu 100 ký tự)
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
              Hình ảnh *
            </label>
            <div
              style={{
                border: `2px dashed ${errors.images ? "#F44336" : "#D7A86E"}`,
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#FFF8E7",
                transition: "all 0.3s ease",
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                multiple
                accept="image/*"
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, upload: true }))}
                onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, upload: false }))}
                style={buttonStyle("upload", hoveredButtons.upload)}
              >
                📷 Chọn hình ảnh
              </button>
              <p style={{ color: "#6D4C41", marginTop: "10px", fontSize: "14px" }}>
                Chấp nhận file JPG, PNG, GIF. Tối đa 5MB mỗi file.
              </p>
            </div>
            {errors.images && (
              <div style={{ color: "#F44336", fontSize: "14px", marginTop: "5px" }}>⚠️ {errors.images}</div>
            )}

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div
                style={{
                  marginTop: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "15px",
                }}
              >
                {imagePreview.map((preview, index) => (
                  <div
                    key={preview.id}
                    style={{
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      border: "2px solid #D7A86E",
                    }}
                  >
                    <img
                      src={preview.url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        backgroundColor: "#F44336",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8px",
                          left: "8px",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        Ảnh chính
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              paddingTop: "20px",
              borderTop: "2px solid #F5E8C7",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/admin/blog")}
              onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, cancel: true }))}
              onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, cancel: false }))}
              style={buttonStyle("cancel", hoveredButtons.cancel)}
              disabled={loading}
            >
              ❌ Hủy
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, save: true }))}
              onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, save: false }))}
              style={buttonStyle("save", hoveredButtons.save)}
              disabled={loading}
            >
              {loading ? "⏳ Đang lưu..." : "💾 Lưu nháp"}
            </button>

            <button
              type="button"
              onClick={() => handleSubmit("published")}
              onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, publish: true }))}
              onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, publish: false }))}
              style={buttonStyle("publish", hoveredButtons.publish)}
              disabled={loading}
            >
              {loading ? "⏳ Đang đăng..." : "🚀 Đăng bài"}
            </button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
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
            backdropFilter: "blur(5px)",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
              padding: "30px",
              textAlign: "center",
              border: "3px solid #D7A86E",
              animation: "fadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                animation: "spin 1s linear infinite",
              }}
            >
              ⏳
            </div>
            <div style={{ fontSize: "18px", color: "#A47148", fontWeight: "bold" }}>Đang xử lý...</div>
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
