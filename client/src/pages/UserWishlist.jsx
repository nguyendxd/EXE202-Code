import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from '../services/wishlistService';
import { useNavigate } from 'react-router-dom';

export default function UserWishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedPetId, setSelectedPetId] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await getWishlist();
                console.log("res", res.data);
                setWishlist(res.data);
            } catch (err) {
                setWishlist([]);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    const handleCardClick = (petId) => {
        navigate(`/pets/${petId}`);
    };

    const handleRemoveWishlist = async (e, petId) => {
        e.stopPropagation();
        setSelectedPetId(petId);
        setShowConfirmModal(true);
    };

    const confirmRemove = async () => {
        try {
            await removeFromWishlist(selectedPetId);
            setWishlist((prev) => prev.filter(item => item.pet._id !== selectedPetId));
            setShowConfirmModal(false);
            setSelectedPetId(null);
        } catch (err) {
            // Có thể hiện toast lỗi ở đây nếu muốn
        }
    };

    const cancelRemove = () => {
        setShowConfirmModal(false);
        setSelectedPetId(null);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Đang tải danh sách yêu thích...</div>;

    return (
        <div style={{ minHeight: "100vh", background: "#FAF3E0", padding: 0, margin: 0 }}>
            <style>{`
                .wishlist-title {
                    text-align: center;
                    margin: 40px 0 32px 0;
                    color: #5C4033;
                    font-weight: 600;
                    font-size: 28px;
                }
                .wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 36px;
                    justify-content: center;
                    padding: 0 60px 40px 60px;
                }
                @media (max-width: 1100px) {
                    .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 0 20px 30px 20px !important; }
                }
                @media (max-width: 700px) {
                    .wishlist-grid { grid-template-columns: 1fr !important; padding: 0 6px 20px 6px !important; }
                    .wishlist-card { max-width: 98vw !important; min-width: 0 !important; }
                    .wishlist-title { font-size: 20px !important; margin: 24px 0 18px 0 !important; }
                }
                .wishlist-card {
                    background: #F5E8C7;
                    border: 3px solid #C69447;
                    border-radius: 18px;
                    box-shadow: 0 2px 8px #e5c29955;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 0 0 18px 0;
                    min-height: 340px;
                    max-width: 260px;
                    margin: 0 auto;
                    position: relative;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .wishlist-card:hover {
                    transform: translateY(-5px);
                }
                .wishlist-img-wrapper {
                    position: relative;
                    width: 100%;
                    height: 170px;
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                    overflow: hidden;
                    background: #fff;
                }
                .wishlist-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                .heart-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255,255,255,0.85);
                    border: none;
                    border-radius: 50%;
                    padding: 5px;
                    z-index: 2;
                    box-shadow: 0 2px 8px #c6944740;
                    transition: transform 0.2s;
                }
                .heart-btn:hover {
                    transform: scale(1.1);
                }
                .pet-name {
                    font-weight: 700;
                    color: #5C4033;
                    font-size: 20px;
                    margin: 16px 0 0 0;
                    text-align: center;
                }
                .pet-info {
                    color: #5C4033;
                    font-size: 15px;
                    margin: 10px 0 0 0;
                    text-align: center;
                }
                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 8px;
                    margin: 30px 0 0 0;
                }
                .pagination-btn {
                    border: 1.5px solid #C69447;
                    background: #FAF3E0;
                    color: #5C4033;
                    border-radius: 50%;
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.2s, color 0.2s;
                }
                .pagination-btn.active, .pagination-btn:hover {
                    background: #C69447;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: #FAF3E0;
                    padding: 24px;
                    border-radius: 12px;
                    border: 2px solid #C69447;
                    max-width: 400px;
                    width: 90%;
                    text-align: center;
                }
                .modal-title {
                    color: #5C4033;
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                .modal-message {
                    color: #5C4033;
                    font-size: 16px;
                    margin-bottom: 24px;
                }
                .modal-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                }
                .modal-btn {
                    padding: 8px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .modal-btn.cancel {
                    background: #F5E8C7;
                    border: 2px solid #C69447;
                    color: #5C4033;
                }
                .modal-btn.confirm {
                    background: #C94F4F;
                    border: 2px solid #C94F4F;
                    color: white;
                }
                .modal-btn:hover {
                    transform: translateY(-2px);
                }
                .modal-btn.cancel:hover {
                    background: #F0E0B8;
                }
                .modal-btn.confirm:hover {
                    background: #B83B3B;
                }
            `}</style>

            {/* Modal xác nhận */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={cancelRemove}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-title">Xác nhận xóa</div>
                        <div className="modal-message">
                            Bạn có chắc chắn muốn xóa thú cưng này khỏi danh sách yêu thích?
                        </div>
                        <div className="modal-buttons">
                            <button className="modal-btn cancel" onClick={cancelRemove}>
                                Hủy
                            </button>
                            <button className="modal-btn confirm" onClick={confirmRemove}>
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px 0",
                minHeight: "100vh"
            }}>
                <h2 className="wishlist-title" style={{ textAlign: "center", margin: "40px 0 32px 0", color: "#5C4033", fontWeight: 600, fontSize: 24 }}>
                    Danh sách được yêu thích
                </h2>
                <div
                    className="wishlist-grid"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                        gap: "30px",
                        padding: "0 20px 40px 20px",
                        justifyContent: "center"
                    }}
                >
                    {wishlist.length === 0 ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#8B4513', fontSize: 18 }}>Chưa có thú cưng nào trong wishlist.</div>
                    ) : (
                        wishlist.map((item, idx) => {
                            const pet = item.pet;
                            return (
                                <div
                                    key={pet._id}
                                    className="wishlist-card"
                                    onClick={() => handleCardClick(pet._id)}
                                    style={{ width: '100%', maxWidth: 260, minWidth: 0 }}
                                >
                                    <div className="wishlist-img-wrapper">
                                        <img src={pet?.images?.[0] || '/placeholder.svg'} alt={pet.name} className="wishlist-img" />
                                        <button
                                            className="heart-btn"
                                            onClick={(e) => handleRemoveWishlist(e, pet._id)}
                                            aria-label="Bỏ khỏi wishlist"
                                        >
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#C94F4F" stroke="#C94F4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="pet-name">{pet.name}</div>
                                    <div className="pet-info">
                                        Tuổi: {pet.age}<br />
                                        Giới tính: {pet.gender}<br />
                                        Giống: {pet.breed}<br />
                                        Tình trạng: {pet.healthStatus?.join(', ') || 'Chưa rõ'}<br />
                                        Nơi ở: {pet.address}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
