import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/index.css";
import { getPetById } from '../services/petService';
import '../styles/PetGallery.css';
import '../styles/PetDetailInfo.css';

export default function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [zoomImgIdx, setZoomImgIdx] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const fetchPet = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPetById(id);
                setPet(res.data);
            } catch (err) {
                setError("Không tìm thấy thông tin thú cưng.");
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id]);

    const handleWishlistToggle = () => {
        setIsWishlisted((prev) => {
            const newState = !prev;
            if (newState) {
                toast.success('Đã thêm vào wishlist!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.info('Đã xóa khỏi wishlist!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            return newState;
        });
    };

    const handleNavigateToUserPage = () => {
        navigate(`/user/${pet.shelterId}`);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Đang tải thông tin thú cưng...</div>;
    if (error || !pet) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <ToastContainer />
            <section
                style={{
                    backgroundImage: 'url("https://cdn.pixabay.com/photo/2022/10/25/04/55/cat-7544821_1280.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#5C4033',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    position: 'relative',
                    minHeight: '100px',
                    boxSizing: 'border-box',
                }}
            >
                <h1 style={{ fontSize: '24px', margin: 0, fontWeight: 600 }}>Thông tin về bé</h1>
                <p style={{ fontSize: '19px', maxWidth: '700px', margin: '20px auto' }}>
                    Tìm hiểu thêm về tính cách, sức khỏe và câu chuyện của boss
                </p>
            </section>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "24px" }}>
                    <div className="pet-detail-info-row">
                        {/* Ảnh và nút bên trái */}
                        <div className="pet-detail-avatar">
                            {/* Avatar */}
                            <img src={pet.images?.[0] || 'https://via.placeholder.com/300'} alt={pet.name} style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "50%", border: '2px solid #E5C299' }} />
                            <div className="pet-name">{pet.name}</div>
                            <div style={{ paddingTop: '30px', display: 'flex', alignItems: 'center', color: '#7A5F3C', fontSize: "16px", margin: '8px 0 12px 0' }}>
                                Thêm vào wishlist
                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        marginLeft: '8px',
                                        padding: '0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s ease-in-out'
                                    }}
                                    aria-label="Thêm vào wishlist"
                                    onClick={handleWishlistToggle}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={isWishlisted ? '#FF0000' : 'none'}
                                        stroke={isWishlisted ? '#FF0000' : '#E5C299'}
                                        strokeWidth={isWishlisted ? '2.5' : '2'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{
                                            transform: isWishlisted ? 'scale(1.2)' : 'scale(1)',
                                            transition: 'fill 0.3s ease-in-out, stroke 0.3s ease-in-out, stroke-width 0.3s ease-in-out, transform 0.3s ease-in-out'
                                        }}
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>
                            <button className="pet-register-btn" onClick={handleNavigateToUserPage}>Đăng ký</button>
                        </div>
                        {/* Thông tin chi tiết bên phải */}
                        <div className="pet-detail-main">
                            <div
                                style={{ fontWeight: 700, fontSize: "20px", marginBottom: "12px", cursor: 'pointer' }}
                                onClick={handleNavigateToUserPage}
                            >
                                Trại cứu hộ chó mèo
                            </div>
                            <hr style={{ border: "none", borderTop: "2px solid #E5C299", borderRadius: "2px", marginBottom: "16px" }} />
                            <div style={{ fontSize: "16px", display: 'flex', marginBottom: "12px" }}>
                                <div style={{ display: 'flex', flex: 0.5, flexDirection: 'column', gap: '8px' }}>
                                    <div><b style={{ fontWeight: 600 }}>Tuổi:</b> {pet.age || 'Không rõ'}</div>
                                    <div><b style={{ fontWeight: 600 }}>Màu sắc:</b> {pet.color || 'Không rõ'}</div>
                                    <div><b style={{ fontWeight: 600 }}>Giống:</b> {pet.breed || 'Không rõ'}</div>
                                </div>
                                <div style={{ display: 'flex', flex: 0.5, flexDirection: 'column', gap: '8px' }}>
                                    <div><b style={{ fontWeight: 600 }}>Giới tính:</b> {pet.gender || 'Không rõ'}</div>
                                    <div><b style={{ fontWeight: 600 }}>Cân nặng:</b> {pet.weight || 'Không rõ'}</div>
                                    <div><b style={{ fontWeight: 600 }}>Tính cách:</b> {pet.temperament
                                        ? pet.temperament.split(',').map(s => s.trim()).filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' – ')
                                        : 'Không rõ'}</div>
                                </div>
                            </div>
                            <hr style={{ border: "none", borderTop: "2px solid #E5C299", borderRadius: "2px", marginBottom: "16px" }} />
                            <div style={{ marginBottom: "8px", fontSize: "16px" }}>
                                <b style={{ fontWeight: 600 }}>Tình trạng sức khỏe:</b><br />
                                {pet.healthStatus && Array.isArray(pet.healthStatus) && pet.healthStatus.length > 0 ? (
                                    <ul style={{ margin: "4px 0 0 20px", padding: 0, listStyle: "none" }}>
                                        {pet.healthStatus.map((s, idx) => (
                                            <li key={idx} style={{ marginBottom: 2 }}>
                                                <span style={{ color: '#5C4033', fontWeight: 600 }}>–</span> {s.trim().charAt(0).toUpperCase() + s.trim().slice(1)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>Không rõ</span>
                                )}
                            </div>
                            <div style={{ marginBottom: "8px", fontSize: "16px" }}>
                                <b style={{ fontWeight: 600 }}>Địa chỉ:</b> {pet.address || 'Không rõ'}
                            </div>
                            <div style={{ marginBottom: "8px", fontSize: "16px" }}>
                                <b style={{ fontWeight: 600 }}>Số điện thoại:</b> {pet.contactPhone || 'Không rõ'}
                            </div>
                            <div style={{ fontSize: "16px" }}>
                                <b style={{ fontWeight: 600 }}>Câu chuyện:</b><br />
                                <span>{pet.story || 'Chưa có câu chuyện.'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Hiển thị gallery ảnh */}
                {pet.images && pet.images.length > 1 && (
                    <div style={{ marginTop: '32px', width: '100%' }}>
                        <div style={{ fontWeight: 700, fontSize: 22, color: '#5C4033', marginBottom: 18 }}>Hình ảnh về bé</div>
                        <div className="pet-gallery-grid">
                            {pet.images.slice(1).map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`pet-gallery-${idx + 1}`}
                                    className="pet-gallery-img"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setZoomImgIdx(idx + 1)}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Modal phóng to ảnh, click vào ảnh để chuyển tiếp */}
                {zoomImgIdx !== null && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(0,0,0,0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                        }}
                        onClick={() => setZoomImgIdx(null)}
                    >
                        <img
                            src={pet.images[zoomImgIdx]}
                            alt="zoom-img"
                            style={{
                                maxWidth: '95vw',
                                maxHeight: '95vh',
                                width: '700px',
                                borderRadius: 18,
                                border: '3px solid #E5C299',
                                background: '#fff',
                                boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
                                objectFit: 'contain'
                            }}
                            onClick={e => {
                                e.stopPropagation();
                                setZoomImgIdx((prev) => {
                                    const next = prev + 1;
                                    return next >= pet.images.length ? 1 : next; // chỉ duyệt các ảnh gallery, không duyệt avatar
                                });
                            }}
                        />
                        <button
                            onClick={() => setZoomImgIdx(null)}
                            style={{
                                position: 'fixed',
                                top: 32,
                                right: 32,
                                background: '#fff',
                                color: '#5C4033',
                                border: '2px solid #E5C299',
                                borderRadius: '50%',
                                width: 40,
                                height: 40,
                                fontSize: 28,
                                fontWeight: 700,
                                cursor: 'pointer',
                                zIndex: 1001,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                            }}
                            aria-label="Đóng"
                        >×</button>
                    </div>
                )}
            </div>
        </div>
    );
}