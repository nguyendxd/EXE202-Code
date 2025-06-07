import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/index.css";
import { getPetById } from '../services/petService';
import { addToWishlist, removeFromWishlist, getWishlist } from '../services/wishlistService';
import '../styles/PetGallery.css';
import '../styles/PetDetailInfo.css';
import Loading from '../components/Loading';

export default function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [zoomImgIdx, setZoomImgIdx] = useState(null);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isHeartHover, setIsHeartHover] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [modalAction, setModalAction] = useState(''); // 'add' hoặc 'remove'

    useEffect(() => {
        const fetchPetAndWishlist = async () => {
            setLoading(true);
            setError(null);
            try {
                // Lấy thông tin pet
                const petRes = await getPetById(id);
                setPet(petRes.data);

                // Kiểm tra wishlist
                const wishlistRes = await getWishlist();
                const isInWishlist = wishlistRes.data.some(item => item.pet._id === id);
                setIsWishlisted(isInWishlist);
            } catch (err) {
                setError("Không tìm thấy thông tin thú cưng.");
            } finally {
                setLoading(false);
            }
        };
        fetchPetAndWishlist();
    }, [id]);

    const handleWishlistToggle = async () => {
        if (!isWishlisted) {
            setModalAction('add');
            setShowConfirmModal(true);
        } else {
            setModalAction('remove');
            setShowConfirmModal(true);
        }
    };

    const handleConfirmWishlist = async () => {
        try {
            if (modalAction === 'add') {
                await addToWishlist(id);
                setIsWishlisted(true);
                toast.success('Đã thêm vào wishlist!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                await removeFromWishlist(id);
                setIsWishlisted(false);
                toast.info('Đã xóa khỏi wishlist!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
            setShowConfirmModal(false);
        } catch (err) {
            toast.error(modalAction === 'add' ? 'Thêm vào wishlist thất bại!' : 'Xóa khỏi wishlist thất bại!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleCancelWishlist = () => {
        setShowConfirmModal(false);
    };

    const handleNavigateToUserPage = () => {
        navigate(`/user/${pet.shelterId._id}`);
    };

    if (loading) return <Loading />;
    if (error || !pet) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <ToastContainer />
            {/* Modal xác nhận */}
            {showConfirmModal && (
                <div
                    className="modal-overlay"
                    onClick={handleCancelWishlist}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: '#FAF3E0',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '2px solid #C69447',
                            maxWidth: '400px',
                            width: '90%',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ color: '#5C4033', fontSize: '20px', fontWeight: 600, marginBottom: '16px' }}>
                            {modalAction === 'add' ? 'Thêm vào wishlist' : 'Xóa khỏi wishlist'}
                        </div>
                        <div style={{ color: '#5C4033', fontSize: '16px', marginBottom: '24px' }}>
                            {modalAction === 'add'
                                ? 'Bạn có chắc chắn muốn thêm thú cưng này vào danh sách yêu thích?'
                                : 'Bạn có chắc chắn muốn xóa thú cưng này khỏi danh sách yêu thích?'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                            <button
                                onClick={handleCancelWishlist}
                                style={{
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    background: '#F5E8C7',
                                    border: '2px solid #C69447',
                                    color: '#5C4033',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmWishlist}
                                style={{
                                    padding: '8px 24px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    background: modalAction === 'add' ? '#C69447' : '#C94F4F',
                                    border: `2px solid ${modalAction === 'add' ? '#C69447' : '#C94F4F'}`,
                                    color: 'white',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {modalAction === 'add' ? 'Thêm' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                    onMouseEnter={() => setIsHeartHover(true)}
                                    onMouseLeave={() => setIsHeartHover(false)}
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill={isWishlisted ? '#FF0000' : 'none'}
                                        stroke={isHeartHover ? '#5C4033' : (isWishlisted ? '#FF0000' : '#E5C299')}
                                        strokeWidth={isWishlisted ? '2.5' : '2'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{
                                            transform: isHeartHover ? 'scale(1.05)' : (isWishlisted ? 'scale(1.2)' : 'scale(1)'),
                                            transition: 'fill 0.3s, stroke 0.3s, stroke-width 0.3s, transform 0.3s',
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