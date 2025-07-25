"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import pawLetter from "../assets/PawLetter.png"

export default function AdminCreatePet() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [petData, setPetData] = useState({
    name: "",
    age: "",
    gender: "male",
    color: "",
    breed: "",
    weight: "",
    temperament: "",
    healthStatus: [],
    address: "",
    contactPhone: "",
    story: "",
    status: "available",
    petType: "dog"
  })
  const [images, setImages] = useState([])
  const [avatar, setAvatar] = useState(null)
  const [previewImages, setPreviewImages] = useState([])
  const [previewAvatar, setPreviewAvatar] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPetData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleHealthStatusChange = (status) => {
    setPetData(prev => ({
      ...prev,
      healthStatus: prev.healthStatus.includes(status)
        ? prev.healthStatus.filter(s => s !== status)
        : [...prev.healthStatus, status]
    }))
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages(files)
    
    // Tạo preview
    const previews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(previews)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    setAvatar(file)
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      
      // Thêm thông tin pet
      Object.keys(petData).forEach(key => {
        if (key === 'healthStatus') {
          formData.append(key, JSON.stringify(petData[key]))
        } else {
          formData.append(key, petData[key])
        }
      })

      // Thêm ảnh
      images.forEach(image => {
        formData.append('images', image)
      })

      if (avatar) {
        formData.append('avatar', avatar)
      }

      const token = localStorage.getItem("token")
      const response = await fetch(`${import.meta.env.VITE_API_URL}/pets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Tạo thú cưng thất bại')
      }

      const result = await response.json()
      alert('Tạo thú cưng thành công!')
      navigate('/admin/adoption')
    } catch (error) {
      console.error('Error creating pet:', error)
      alert('Tạo thú cưng thất bại: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const healthStatusOptions = [
    "Đã tiêm phòng",
    "Đã tẩy giun",
    "Đã triệt sản",
    "Khỏe mạnh",
    "Cần chăm sóc đặc biệt",
    "Đang điều trị"
  ]

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
          Thêm thú cưng mới
        </h1>
      </div>

      {/* Form */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <form onSubmit={handleSubmit} style={{ backgroundColor: "#FFFFFF", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", border: "2px solid #D7A86E" }}>
          
          {/* Basic Information */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#A47148", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #D7A86E", paddingBottom: "10px" }}>
              Thông tin cơ bản
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Tên thú cưng *
                </label>
                <input
                  type="text"
                  name="name"
                  value={petData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Tuổi *
                </label>
                <input
                  type="text"
                  name="age"
                  value={petData.age}
                  onChange={handleInputChange}
                  required
                  placeholder="VD: 2 tuổi, 6 tháng"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Giống *
                </label>
                <input
                  type="text"
                  name="breed"
                  value={petData.breed}
                  onChange={handleInputChange}
                  required
                  placeholder="VD: Golden Retriever, Mèo Ba Tư"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Cân nặng
                </label>
                <input
                  type="text"
                  name="weight"
                  value={petData.weight}
                  onChange={handleInputChange}
                  placeholder="VD: 15kg, 4kg"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Giới tính *
                </label>
                <select
                  name="gender"
                  value={petData.gender}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                >
                  <option value="male">Đực</option>
                  <option value="female">Cái</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Loại thú cưng *
                </label>
                <select
                  name="petType"
                  value={petData.petType}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                >
                  <option value="dog">Chó</option>
                  <option value="cat">Mèo</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Màu sắc
                </label>
                <input
                  type="text"
                  name="color"
                  value={petData.color}
                  onChange={handleInputChange}
                  placeholder="VD: Vàng, Trắng đen"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={petData.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                >
                  <option value="available">Có thể nhận nuôi</option>
                  <option value="pending">Đang chờ nhận nuôi</option>
                  <option value="adopted">Đã được nhận nuôi</option>
                  <option value="medical">Đang điều trị</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#A47148", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #D7A86E", paddingBottom: "10px" }}>
              Tình trạng sức khỏe
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
              {healthStatusOptions.map((status) => (
                <label key={status} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={petData.healthStatus.includes(status)}
                    onChange={() => handleHealthStatusChange(status)}
                    style={{ transform: "scale(1.2)" }}
                  />
                  <span style={{ color: "#5D4037", fontSize: "14px" }}>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#A47148", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #D7A86E", paddingBottom: "10px" }}>
              Thông tin liên hệ
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={petData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Địa chỉ cụ thể"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={petData.contactPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="Số điện thoại liên hệ"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#A47148", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #D7A86E", paddingBottom: "10px" }}>
              Mô tả
            </h3>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Tính cách
              </label>
              <textarea
                name="temperament"
                value={petData.temperament}
                onChange={handleInputChange}
                rows={3}
                placeholder="Mô tả tính cách của thú cưng..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Câu chuyện
              </label>
              <textarea
                name="story"
                value={petData.story}
                onChange={handleInputChange}
                rows={4}
                placeholder="Kể câu chuyện về thú cưng này..."
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>
          </div>

          {/* Images */}
          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ color: "#A47148", fontSize: "20px", marginBottom: "15px", borderBottom: "2px solid #D7A86E", paddingBottom: "10px" }}>
              Hình ảnh
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Ảnh đại diện
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                {previewAvatar && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={previewAvatar}
                      alt="Avatar preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #D7A86E"
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Ảnh khác (tối đa 5 ảnh)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                    fontSize: "14px"
                  }}
                />
                {previewImages.length > 0 && (
                  <div style={{ marginTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {previewImages.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "2px solid #D7A86E"
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => navigate('/admin/adoption')}
              style={{
                padding: "15px 30px",
                borderRadius: "25px",
                border: "2px solid #D7A86E",
                backgroundColor: "#FFFFFF",
                color: "#A47148",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#FFF8E7"
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#FFFFFF"
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "15px 30px",
                borderRadius: "25px",
                border: "none",
                backgroundColor: loading ? "#A0A0A0" : "#D7A86E",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#C19A5B"
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = "#D7A86E"
                }
              }}
            >
              {loading ? "Đang tạo..." : "Tạo thú cưng"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
} 