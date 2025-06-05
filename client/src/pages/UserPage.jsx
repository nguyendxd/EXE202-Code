import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from '../services/userService';
import "../styles/index.css";

export default function UserPage() {
    const { id } = useParams();
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: 40 }}>Đang tải thông tin trạm cứu hộ...</div>;
    if (error || !user) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif", padding: "40px 20px" }}>
            {/* Section thông tin trạm */}
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "24px", marginBottom: "32px" }}>
                    {/* Hình ảnh trạm */}
                    <div style={{ marginRight: "24px" }}>
                        <img
                            src={user.avatar || "https://via.placeholder.com/100"}
                            alt={user.username}
                            style={{ width: "100px", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                        />
                    </div>
                    {/* Thông tin trạm */}
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#5C4033", marginBottom: "12px" }}>
                            {user.username || 'Chưa có tên'}
                        </h2>
                        <p style={{ fontSize: "16px", color: "#7A5F3C", marginBottom: "8px" }}>
                            {user.description || 'Chưa có mô tả'}
                        </p>
                        <div style={{ fontSize: "16px", color: "#5C4033", marginBottom: "8px" }}>
                            <strong>Email:</strong> {user.email || '[Chưa có email]'}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Số điện thoại:</strong> {user.phone || '[Chưa có số điện thoại]'}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Địa chỉ:</strong> {user.address || '[Chưa có địa chỉ]'}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Link mạng xã hội:</strong> {user.socialLink ? <a href={user.socialLink} target="_blank" rel="noopener noreferrer">{user.socialLink}</a> : '[Chưa có link]'}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Vai trò:</strong> {user.role}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Xác thực:</strong> {user.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                        </div>
                        <div style={{ fontSize: "16px", color: "black", marginBottom: "8px" }}>
                            <strong>Ngày tạo:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString('vi-VN') : '[Chưa có]'}
                        </div>
                    </div>
                    {/* Nút Nhắn tin */}
                    <button
                        style={{
                            background: "#E5C299",
                            color: "#5C4033",
                            border: "none",
                            borderRadius: "20px",
                            padding: "10px 24px",
                            fontSize: "16px",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background 0.3s ease-in-out"
                        }}
                        onMouseOver={(e) => e.target.style.background = "#D9B78A"}
                        onMouseOut={(e) => e.target.style.background = "#E5C299"}
                    >
                        Nhắn tin
                    </button>
                </div>
            </div>
        </div >
    );
}