import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/index.css";
import { getPetById } from '../services/petService';
import './PetGallery.css';
import './PetDetailInfo.css';

export default function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [zoomImgIdx, setZoomImgIdx] = useState(null); // index ảnh đang phóng to

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

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Đang tải thông tin thú cưng...</div>;
    if (error || !pet) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
                <div style={{ background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "24px" }}>
                    <div className="pet-detail-info-row">
                        {/* Ảnh và nút bên trái */}
                        <div className="pet-detail-avatar">
                            {/* Avatar */}
                            <img src={pet.images?.[0] || 'https://via.placeholder.com/300'} alt={pet.name} style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "50%", border: '2px solid #E5C299' }} />
                            <div className="pet-name">{pet.name}</div>
                            <div style={{ color: '#7A5F3C', fontSize: "14px", margin: '8px 0 12px 0' }}>Thêm vào danh sách yêu thích</div>
                            <button className="pet-register-btn">Đăng ký</button>
                        </div>
                        {/* Thông tin chi tiết bên phải */}
                        <div className="pet-detail-main">
                            <div style={{ fontWeight: 700, fontSize: "20px", marginBottom: "12px" }}>Trại cứu hộ chó mèo</div>
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