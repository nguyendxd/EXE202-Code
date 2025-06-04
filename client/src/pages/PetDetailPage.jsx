import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/index.css";
import { getPetById } from '../services/petService';

export default function PetDetailPage() {
    const { petId } = useParams();
    const navigate = useNavigate();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPet = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPetById(petId);
                setPet(res.data.data);
            } catch (err) {
                setError("Không tìm thấy thông tin thú cưng.");
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [petId]);

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Đang tải thông tin thú cưng...</div>;
    if (error || !pet) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 0" }}>
                <div style={{ display: "flex", gap: "32px", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 32 }}>
                    {/* Ảnh và nút bên trái */}
                    <div style={{ width: 320, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img src={pet.images?.[0] || 'https://via.placeholder.com/300'} alt={pet.name} style={{ width: 220, height: 220, objectFit: "cover", borderRadius: "12px", border: '2px solid #E5C299' }} />
                        <div style={{ fontWeight: 600, fontSize: 20, color: '#5C4033', marginTop: 16 }}>{pet.name}</div>
                        <div style={{ color: '#7A5F3C', fontSize: 14, margin: '8px 0 16px 0' }}>Thêm vào danh sách yêu thích</div>
                        <button style={{ background: '#E5C299', color: '#5C4033', border: 'none', borderRadius: 8, padding: '8px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginBottom: 8 }}>Đăng ký</button>
                    </div>
                    {/* Thông tin chi tiết bên phải */}
                    <div style={{ flex: 1, fontSize: 16, color: '#5C4033' }}>
                        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Trại cứu hộ chó mèo</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', marginBottom: 8 }}>
                            <div>
                                <div><b>Tuổi:</b> {pet.age || 'Không rõ'}</div>
                                <div><b>Màu sắc:</b> {pet.color || 'Không rõ'}</div>
                                <div><b>Giống:</b> {pet.breed || 'Không rõ'}</div>
                            </div>
                            <div>
                                <div><b>Giới tính:</b> {pet.gender || 'Không rõ'}</div>
                                <div><b>Cân nặng:</b> {pet.weight ? pet.weight + 'kg' : 'Không rõ'}</div>
                                <div><b>Tính cách:</b> {pet.temperament || 'Không rõ'}</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <b>Tình trạng sức khỏe:</b><br />
                            {pet.healthStatus && Array.isArray(pet.healthStatus) ? (
                                <ul style={{ margin: 0, paddingLeft: 20 }}>
                                    {pet.healthStatus.map((item, idx) => <li key={idx}>{item}</li>)}
                                </ul>
                            ) : (
                                <span>{pet.healthStatus || 'Không rõ'}</span>
                            )}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <b>Địa chỉ:</b> {pet.address || 'Không rõ'}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <b>Số điện thoại:</b> {pet.phone || 'Không rõ'}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <b>Câu chuyện:</b><br />
                            <span>{pet.story || 'Chưa có câu chuyện.'}</span>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 32, textAlign: 'center' }}>
                    <button onClick={() => navigate(-1)} style={{ background: '#E5C299', color: '#5C4033', border: 'none', borderRadius: 8, padding: '8px 32px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
                        &lt; Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}