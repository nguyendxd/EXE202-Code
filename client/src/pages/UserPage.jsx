import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from '../services/userService';
import Loading from '../components/Loading';
import "../styles/index.css";

export default function UserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getUserById(id);
                setUser(res.data);
            } catch (err) {
                setError("Không tìm thấy thông tin trạm cứu hộ.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    if (loading) return <Loading />;
    if (error || !user) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif", padding: "40px 20px" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "32px 40px" }}>
                <div style={{ display: "flex", gap: 40 }}>
                    {/* Bên trái: avatar và mô tả */}
                    <div style={{ flex: 0.4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={user.avatar || "https://via.placeholder.com/160x160?text=No+Avatar"}
                            alt={user.username}
                            style={{ width: "160px", height: "160px", borderRadius: "16px", objectFit: "cover", background: '#FFF7E2', border: '2px solid #E5C299', marginBottom: 20 }}
                        />
                        <div style={{ width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 22, fontWeight: 700, color: '#5C4033', marginRight: 8 }}>{user.username || 'Chưa có tên'}</span>
                            <span title="Thông tin trạm cứu hộ" style={{ fontSize: 22, color: '#A47148' }}>❗</span>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div style={{ fontWeight: 600, color: '#7A5F3C', marginBottom: 6 }}>Miêu tả</div>
                            <div style={{ background: '#FFF7E2', border: '2px solid #E5C299', borderRadius: 12, padding: 16, minHeight: 80, color: '#5C4033', fontSize: 16 }}>
                                {user.description || 'Chưa có mô tả'}
                            </div>
                        </div>
                    </div>
                    {/* Bên phải: thông tin chi tiết */}
                    <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: 24, color: '#5C4033', marginBottom: 18 }}>Trại cứu hộ chó mèo</div>
                        <div style={{ borderTop: '2px solid #E5C299', marginBottom: 18 }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: 17 }}>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Email:</b> {user.email || '[Chưa có email]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Số điện thoại:</b> {user.phone || '[Chưa có số điện thoại]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Địa chỉ:</b> {user.address || '[Chưa có địa chỉ]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Link mạng xã hội:</b> {user.socialLink ? <a href={user.socialLink} target="_blank" rel="noopener noreferrer">{user.socialLink}</a> : '[Chưa có link]'}</div>
                        </div>
                        <div style={{ borderTop: '2px solid #E5C299', margin: '32px 0 0 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                            <button
                                style={{
                                    background: "#E5C299",
                                    color: "#5C4033",
                                    border: "none",
                                    borderRadius: "20px",
                                    padding: "12px 40px",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "background 0.3s ease-in-out",
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                                onMouseOver={e => e.target.style.background = "#D9B78A"}
                                onMouseOut={e => e.target.style.background = "#E5C299"}
                                onClick={() => navigate(`/chat?to=${user._id}`)}
                            >
                                Nhắn tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}