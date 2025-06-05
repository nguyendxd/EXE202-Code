import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/index.css";
import { getPetById } from '../services/petService';

export default function PetDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    <div style={{ display: "flex", gap: "24px" }}>
                        {/* Ảnh và nút bên trái */}
                        <div style={{ width: "300px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <img src={pet.images?.[0] || 'https://via.placeholder.com/300'} alt={pet.name} style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "50%", border: '2px solid #E5C299' }} />
                            <div style={{ fontWeight: 600, fontSize: "18px", color: '#5C4033', marginTop: "12px" }}>{pet.name}</div>
                            <div style={{ color: '#7A5F3C', fontSize: "14px", margin: '8px 0 12px 0' }}>Thêm vào danh sách yêu thích</div>
                            <button style={{ background: '#E5C299', color: '#5C4033', border: 'none', borderRadius: "20px", padding: '8px 24px', fontWeight: 600, fontSize: "14px", cursor: 'pointer' }}>Đăng ký</button>
                        </div>
                        {/* Thông tin chi tiết bên phải */}
                        <div style={{ flex: 1, fontSize: "14px", color: '#5C4033' }}>
                            <div style={{ fontWeight: 700, fontSize: "18px", marginBottom: "12px" }}>Trại cứu hộ chó mèo</div>
                            <div style={{ display: 'flex', gap: '40px', marginBottom: "12px" }}>
                                <div>
                                    <div><b>Tuổi:</b> {pet.age || 'Không rõ'}</div>
                                    <div><b>Màu sắc:</b> {pet.color || 'Không rõ'}</div>
                                    <div><b>Giống:</b> {pet.breed || 'Không rõ'}</div>
                                </div>
                                <div>
                                    <div><b>Giới tính:</b> {pet.gender || 'Không rõ'}</div>
                                    <div><b>Cân nặng:</b> {pet.weight || 'Không rõ'}</div>
                                    <div><b>Tính cách:</b> {pet.temperament || 'Không rõ'}</div>
                                </div>
                            </div>
                            <div style={{ marginBottom: "8px" }}>
                                <b>Tình trạng sức khỏe:</b><br />
                                {pet.healthStatus && Array.isArray(pet.healthStatus) ? (
                                    <ul style={{ margin: "4px 0 0 20px", padding: 0 }}>
                                        {pet.healthStatus.map((item, idx) => <li key={idx}>{item}</li>)}
                                    </ul>
                                ) : (
                                    <span>{pet.healthStatus || 'Không rõ'}</span>
                                )}
                            </div>
                            <div style={{ marginBottom: "8px" }}>
                                <b>Địa chỉ:</b> {pet.address || 'Không rõ'}
                            </div>
                            <div style={{ marginBottom: "8px" }}>
                                <b>Số điện thoại:</b> {pet.contactPhone || 'Không rõ'}
                            </div>
                            <div>
                                <b>Câu chuyện:</b><br />
                                <span>{pet.story || 'Chưa có câu chuyện.'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
                    <button onClick={() => navigate(-1)} style={{ background: "none", color: '#5C4033', border: 'none', fontSize: "24px", cursor: 'pointer' }}>{"<"}</button>
                    <button style={{ background: "none", color: '#5C4033', border: 'none', fontSize: "24px", cursor: 'pointer' }}>{">"}</button>
                </div>
            </div>
        </div>
    );
}