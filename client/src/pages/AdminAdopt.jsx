"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLayout from "../components/AdminLayout"
import pawLetter from "../assets/PawLetter.png"

export default function AdminAdopt() {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [filteredPets, setFilteredPets] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [selectedPet, setSelectedPet] = useState(null)
  const [showPetModal, setShowPetModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [petToDelete, setPetToDelete] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [petsPerPage] = useState(8)
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [stats, setStats] = useState({
    totalPets: 0,
    availablePets: 0,
    adoptedPets: 0,
    pendingAdoptions: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hoveredButtons, setHoveredButtons] = useState({})
  const [editPetData, setEditPetData] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${import.meta.env.VITE_API_URL}/pets`)
      .then(res => res.json())
      .then(data => {
        const petsArray = Array.isArray(data.data) ? data.data : [];
        setPets(petsArray)
        setFilteredPets(petsArray)
        // Tính toán stats
        const totalPets = data.total || petsArray.length
        const availablePets = petsArray.filter((p) => p.status === "available").length
        const adoptedPets = petsArray.filter((p) => p.status === "adopted").length
        const pendingAdoptions = petsArray.filter((p) => p.status === "pending").length
        setStats({ totalPets, availablePets, adoptedPets, pendingAdoptions })
        setLoading(false)
      })
      .catch(err => {
        setError("Không thể tải dữ liệu thú cưng.")
        setLoading(false)
        setPets([])
        setFilteredPets([])
      })
  }, [])

  // Filter and search pets
  useEffect(() => {
    const filtered = pets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.address.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filterStatus === "all" || pet.status === filterStatus
      const matchesType = filterType === "all" || pet.petType === filterType

      return matchesSearch && matchesStatus && matchesType
    })

    // Sort pets
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdAt" || sortBy === "adoptedAt") {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredPets(filtered)
    setCurrentPage(1)
  }, [pets, searchTerm, filterStatus, filterType, sortBy, sortOrder])

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có"
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
      case "available":
        return "#4CAF50"
      case "adopted":
        return "#2196F3"
      case "pending":
        return "#FF9800"
      case "medical":
        return "#F44336"
      default:
        return "#9E9E9E"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Có thể nhận nuôi"
      case "adopted":
        return "Đã được nhận nuôi"
      case "pending":
        return "Đang chờ nhận nuôi"
      case "medical":
        return "Đang điều trị"
      default:
        return "Không xác định"
    }
  }

  const handleCreatePet = () => {
    navigate("/admin/adopt/create")
  }

  const handleEditPet = (pet) => {
    setSelectedPet(pet)
    setEditPetData({ ...pet })
    setShowPetModal(true)
  }

  const handleViewPet = (pet) => {
    window.open(`/pets/${pet._id}`, "_blank")
  }

  const handleDeletePet = (pet) => {
    setPetToDelete(pet)
    setShowDeleteModal(true)
  }

  const handleStatusChange = (petId, newStatus) => {
    setPets(pets.map((pet) => (pet._id === petId ? { ...pet, status: newStatus } : pet)))
  }

  // Pagination
  const indexOfLastPet = currentPage * petsPerPage
  const indexOfFirstPet = indexOfLastPet - petsPerPage
  const currentPets = Array.isArray(filteredPets) ? filteredPets.slice(indexOfFirstPet, indexOfLastPet) : [];
  const totalPages = Array.isArray(filteredPets) ? Math.ceil(filteredPets.length / petsPerPage) : 1;

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Button styles with hover effect
  const buttonStyle = (type, hovered = false) => {
    const baseStyle = {
      padding: "8px 12px",
      borderRadius: "6px",
      border: "none",
      fontSize: "12px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "4px",
    }

    const styles = {
      create: {
        backgroundColor: hovered ? "#2E7D32" : "#4CAF50",
        color: "white",
        boxShadow: hovered ? "0 4px 8px rgba(76, 175, 80, 0.3)" : "0 2px 4px rgba(76, 175, 80, 0.2)",
      },
      view: {
        backgroundColor: hovered ? "#1565C0" : "#2196F3",
        color: "white",
        boxShadow: hovered ? "0 4px 8px rgba(33, 150, 243, 0.3)" : "0 2px 4px rgba(33, 150, 243, 0.2)",
      },
      edit: {
        backgroundColor: hovered ? "#F57C00" : "#FF9800",
        color: "white",
        boxShadow: hovered ? "0 4px 8px rgba(255, 152, 0, 0.3)" : "0 2px 4px rgba(255, 152, 0, 0.2)",
      },
      delete: {
        backgroundColor: hovered ? "#C62828" : "#F44336",
        color: "white",
        boxShadow: hovered ? "0 4px 8px rgba(244, 67, 54, 0.3)" : "0 2px 4px rgba(244, 67, 54, 0.2)",
      },
    }

    return { ...baseStyle, ...styles[type] }
  }

  // Cập nhật thú cưng
  const handleSavePet = async (updatedPet) => {
    // Chỉ lấy các trường hợp hợp lệ
    const petData = {
      name: updatedPet.name,
      age: updatedPet.age,
      gender: updatedPet.gender,
      color: updatedPet.color,
      breed: updatedPet.breed,
      weight: updatedPet.weight,
      temperament: updatedPet.temperament,
      healthStatus: updatedPet.healthStatus,
      address: updatedPet.address,
      contactPhone: updatedPet.contactPhone,
      story: updatedPet.story,
      images: updatedPet.images,
      avatar: updatedPet.avatar,
      isAdopted: updatedPet.isAdopted,
      shelterId: updatedPet.shelterId,
    };
    const token = localStorage.getItem("token");
    console.log('PUT pet', updatedPet._id, petData);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pets/${updatedPet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
      });
      console.log('PUT response', res);
      if (!res.ok) throw new Error('Cập nhật thất bại');
      const newPet = await res.json();
      console.log('PUT response data', newPet);
      setPets(pets.map((p) => p._id === newPet._id ? newPet : p));
      setShowPetModal(false);
    } catch (err) {
      console.error('PUT error', err);
      alert('Cập nhật thất bại!');
    }
  };

  // Xóa thú cưng
  const confirmDeletePet = async () => {
    if (!petToDelete) return;
    const token = localStorage.getItem("token");
    console.log('DELETE pet', petToDelete._id);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/pets/${petToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('DELETE response', res);
      if (!res.ok) throw new Error('Xóa thất bại');
      setPets(pets.filter((p) => p._id !== petToDelete._id));
      setShowDeleteModal(false);
      setPetToDelete(null);
    } catch (err) {
      console.error('DELETE error', err);
      alert('Xóa thất bại!');
    }
  };

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
              Đang tải dữ liệu thú cưng...
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
          Quản lý nhận nuôi thú cưng
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
          { title: "Tổng số thú cưng", value: stats.totalPets, color: "#2196F3", icon: "🐾" },
          { title: "Đã được nhận nuôi", value: stats.adoptedPets, color: "#9C27B0", icon: "❤️" },
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
          onClick={handleCreatePet}
          onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, create: true }))}
          onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, create: false }))}
          style={{
            ...buttonStyle("create", hoveredButtons.create),
            padding: "12px 20px",
            fontSize: "16px",
          }}
        >
          ✨ Thêm thú cưng mới
        </button>
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
          placeholder="Tìm kiếm theo tên, giống, địa chỉ..."
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

      {/* Pet Cards */}
      <div style={{ maxWidth: "1200px", margin: "0 auto 30px auto" }}>
        {filteredPets.length === 0 ? (
          <div
            style={{
              backgroundColor: "#FFF8E7",
              padding: "40px",
              borderRadius: "15px",
              textAlign: "center",
              border: "2px dashed #D7A86E",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🔍</div>
            <h3 style={{ color: "#A47148", fontSize: "24px", marginBottom: "10px" }}>Không tìm thấy thú cưng nào</h3>
            <p style={{ color: "#6D4C41", fontSize: "16px" }}>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "25px",
            }}
          >
            {currentPets.map((pet) => (
              <div
                key={pet._id}
                style={{
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
                }}
              >
                {/* Pet Image */}
                <div
                  style={{
                    height: "200px",
                    backgroundImage: `url(${pet.images && pet.images.length > 0 ? pet.images[0] : "https://via.placeholder.com/400x200?text=No+Image"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
                  {/* Status Badge */}
                  {(pet.status === "available" || pet.status === "adopted" || pet.status === "pending" || pet.status === "medical") && (
                    <div
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "15px",
                        backgroundColor: getStatusColor(pet.status),
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      {getStatusText(pet.status)}
                    </div>
                  )}
                </div>

                {/* Pet Content */}
                <div style={{ padding: "20px" }}>
                  {/* Pet Name and Basic Info */}
                  <div style={{ marginBottom: "15px" }}>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#5D4037",
                        marginBottom: "8px",
                      }}
                    >
                      {pet.name}
                    </h3>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#8B4513",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "5px",
                      }}
                    >
                      <div>
                        <strong>Tuổi:</strong> {pet.age}
                      </div>
                      <div>
                        <strong>Giới tính:</strong> {pet.gender === "male" ? "Đực" : "Cái"}
                      </div>
                      <div>
                        <strong>Giống:</strong> {pet.breed}
                      </div>
                      <div>
                        <strong>Cân nặng:</strong> {pet.weight}
                      </div>
                    </div>
                  </div>

                  {/* Health Status */}
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontSize: "12px", color: "#6D4C41", marginBottom: "5px" }}>
                      <strong>Tình trạng sức khỏe:</strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                      }}
                    >
                      {pet.healthStatus.map((status, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#E8F5E8",
                            color: "#2E7D32",
                            padding: "2px 8px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {status}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Adopter Info (if adopted or pending) */}
                  {(pet.status === "adopted" || pet.status === "pending") && pet.adopter && (
                    <div
                      style={{
                        backgroundColor: "#F3E5F5",
                        padding: "10px",
                        borderRadius: "8px",
                        marginBottom: "15px",
                        fontSize: "12px",
                        color: "#6A1B9A",
                      }}
                    >
                      <strong>Người nhận nuôi:</strong> {pet.adopter.name}
                      <br />
                      <strong>SĐT:</strong> {pet.adopter.phone}
                    </div>
                  )}

                  {/* Dates */}
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#A47148",
                      marginBottom: "15px",
                      borderTop: "1px solid #F5E8C7",
                      paddingTop: "10px",
                    }}
                  >
                    <div>Đăng: {formatDate(pet.createdAt)}</div>
                    {pet.adoptedAt && <div>Nhận nuôi: {formatDate(pet.adoptedAt)}</div>}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => handleViewPet(pet)}
                      onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, [`view-${pet._id}`]: true }))}
                      onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, [`view-${pet._id}`]: false }))}
                      style={buttonStyle("view", hoveredButtons[`view-${pet._id}`])}
                    >
                      👁️ Xem
                    </button>

                    <button
                      onClick={() => handleEditPet(pet)}
                      onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, [`edit-${pet._id}`]: true }))}
                      onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, [`edit-${pet._id}`]: false }))}
                      style={buttonStyle("edit", hoveredButtons[`edit-${pet._id}`])}
                    >
                      ✏️ Sửa
                    </button>

                    <button
                      onClick={() => handleDeletePet(pet)}
                      onMouseEnter={() => setHoveredButtons((prev) => ({ ...prev, [`delete-${pet._id}`]: true }))}
                      onMouseLeave={() => setHoveredButtons((prev) => ({ ...prev, [`delete-${pet._id}`]: false }))}
                      style={buttonStyle("delete", hoveredButtons[`delete-${pet._id}`])}
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
        <div
          style={{
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
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

      {/* Pet Edit Modal */}
      {showPetModal && selectedPet && editPetData && (
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
              maxWidth: "600px",
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
              Chỉnh sửa thông tin thú cưng
            </h3>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={editPetData.images?.[0] || "/placeholder.svg"}
                alt={editPetData.name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  border: "3px solid #D7A86E",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Tên thú cưng
                </label>
                <input
                  type="text"
                  value={editPetData.name || ""}
                  onChange={e => setEditPetData({ ...editPetData, name: e.target.value })}
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
                  Tuổi
                </label>
                <input
                  type="text"
                  value={editPetData.age || ""}
                  onChange={e => setEditPetData({ ...editPetData, age: e.target.value })}
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
                  Giống
                </label>
                <input
                  type="text"
                  value={editPetData.breed || ""}
                  onChange={e => setEditPetData({ ...editPetData, breed: e.target.value })}
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
                  Cân nặng
                </label>
                <input
                  type="text"
                  value={editPetData.weight || ""}
                  onChange={e => setEditPetData({ ...editPetData, weight: e.target.value })}
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
                  Giới tính
                </label>
                <select
                  value={editPetData.gender || "male"}
                  onChange={e => setEditPetData({ ...editPetData, gender: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                  }}
                >
                  <option value="male">Đực</option>
                  <option value="female">Cái</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                  Trạng thái
                </label>
                <select
                  value={editPetData.status || "available"}
                  onChange={e => setEditPetData({ ...editPetData, status: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "2px solid #D7A86E",
                    outline: "none",
                  }}
                >
                  <option value="available">Có thể nhận nuôi</option>
                  <option value="pending">Đang chờ nhận nuôi</option>
                  <option value="adopted">Đã được nhận nuôi</option>
                  <option value="medical">Đang điều trị</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Địa chỉ
              </label>
              <input
                type="text"
                value={editPetData.address || ""}
                onChange={e => setEditPetData({ ...editPetData, address: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Số điện thoại
              </label>
              <input
                type="tel"
                value={editPetData.contactPhone || ""}
                onChange={e => setEditPetData({ ...editPetData, contactPhone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Tính cách
              </label>
              <textarea
                value={editPetData.temperament || ""}
                onChange={e => setEditPetData({ ...editPetData, temperament: e.target.value })}
                rows={2}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", color: "#5D4037", fontWeight: "bold" }}>
                Câu chuyện
              </label>
              <textarea
                value={editPetData.story || ""}
                onChange={e => setEditPetData({ ...editPetData, story: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "2px solid #D7A86E",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "15px",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setShowPetModal(false)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "2px solid #D7A86E",
                  backgroundColor: "#FFFFFF",
                  color: "#A47148",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
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
                onClick={() => handleSavePet(editPetData)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#D7A86E",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#C19A5B"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#D7A86E"
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && petToDelete && (
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
              maxWidth: "450px",
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
              Bạn có chắc chắn muốn xóa thông tin của <strong>{petToDelete.name}</strong>?
              <br />
              Hành động này không thể hoàn tác.
            </p>

            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
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
                  transition: "all 0.3s ease",
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
                onClick={confirmDeletePet}
                style={{
                  padding: "12px 24px",
                  borderRadius: "25px",
                  border: "none",
                  backgroundColor: "#F44336",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#C62828"
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#F44336"
                }}
              >
                Xóa thú cưng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
