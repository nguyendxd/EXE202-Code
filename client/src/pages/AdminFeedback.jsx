import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

    useEffect(() => {
        const mockFeedbacks = [
            { id: 1, userName: '🍀annhi_2005', userEmail: 'annhii120905@gmail.com', content: 'Web hay và có ích lắm nha', createdAt: '2025-07-02T09:12:45Z' },
            { id: 2, userName: 'ynttn', userEmail: 'nnhuy1679@gmail.com', content: 'Pet dễ thương quáaaa 🥹', createdAt: '2025-07-04T14:55:10Z' },
            { id: 3, userName: 'andh', userEmail: 'iamhaan04@gmail.com', content: 'Web hơi đơn điệu 😅 ', createdAt: '2025-07-06T10:12:33Z' },
            { id: 4, userName: 'dungieee', userEmail: 'dungieee@gmail.com', content: 'Staff ở đây tâm lý ghê á, nói chuyện kiểu bạn bè thân thiện lun', createdAt: '2025-07-07T14:59:41Z' },
            { id: 5, userName: 'meowinthecloud', userEmail: 'misaki.chan262@gmail.com', content: 'Rep tin nhắn hơi lâu còn lại ok', createdAt: '2025-07-09T19:21:07Z' },
            { id: 6, userName: 'Minh Phương', userEmail: 'hoangphuong@gmail.com', content: 'web đẹp nha', createdAt: '2025-07-10T20:14:59Z' },
            { id: 7, userName: 'giangnee', userEmail: 'giangz04@gmail.com', content: 'Up thêm ảnh + clip pet nữa nha', createdAt: '2025-07-12T22:16:14Z' },
            { id: 8, userName: 'Umeow', userEmail: 'duc123@gmail.com', content: 'Pet cute, mình đã đăng khá nhiều pet, mong có nhiều người nhận nuôi các em', createdAt: '2025-07-14T11:07:45Z' },
            { id: 9, userName: 'linnn', userEmail: 'linhnguyen11@gmail.com', content: 'Adopt nhanh gọn lẹ với được hướng dẫn tận tình', createdAt: '2025-07-16T16:44:32Z' },
            { id: 10, userName: 'hihi', userEmail: 'hgbaovip115@gmail.com', content: 'Web hay', createdAt: '2025-07-18T18:26:51Z' },
            { id: 11, userName: 'nthoang', userEmail: 'hoangso1@gmail.com', content: 'web chất lượng', createdAt: '2025-07-20T13:53:17Z' },
            { id: 12, userName: 'kabetaijin', userEmail: 'kabetaijin120404@gmail.com', content: 'Tính năng chat trực tiếp ok nha', createdAt: '2025-07-22T21:19:40Z' },
            { id: 13, userName: 'soufnotfunny hẹ hẹ hẹ', userEmail: 'leminhtam31104@gmail.com', content: 'Thích web này lắm', createdAt: '2025-07-24T10:34:28Z' },
            { id: 14, userName: 'Trà Dâu', userEmail: 'mangurido@gmail.com', content: 'Nhận nuôi 2 bé chó, cưng muốn xỉu 🥰', createdAt: '2025-07-26T16:12:03Z' },
            { id: 15, userName: 'nguyên', userEmail: 'nguyenn120404@gmail.com', content: 'Có thêm lớp dạy newbie chăm pet là ok', createdAt: '2025-07-28T18:47:59Z' },
            { id: 16, userName: 'Đỗ Bình', userEmail: 'dophantuongbinh6.9@gmail.com', content: 'tư vấn nhiệt tình', createdAt: '2025-07-30T08:23:44Z' },
            { id: 17, userName: 'uycuteee', userEmail: 'uycute@gmail.com', content: 'web hay', createdAt: '2025-08-02T20:31:22Z' },
            { id: 18, userName: 'tamle', userEmail: 'natural01@gmail.com', content: 'thích nuôi mèo mà nhà hong cho 😅', createdAt: '2025-08-05T09:15:38Z' },
            { id: 19, userName: 'anhthuneh', userEmail: 'tranthupg2810@gmail.com', content: 'Pet độc lạ dễ thương', createdAt: '2025-08-09T22:05:16Z' },
            { id: 20, userName: 'yen.yenn✨', userEmail: 'yenyen@gmail.com', content: 'Web hay nha', createdAt: '2025-08-14T12:41:08Z' },
        ];

        setFeedbacks(mockFeedbacks);
        setFilteredFeedbacks(mockFeedbacks);
    }, []);

    const deleteFeedback = id => {
        if (window.confirm('Bạn có chắc chắn muốn xóa feedback này?')) {
            setFeedbacks(f => f.filter(item => item.id !== id));
            setFilteredFeedbacks(f => f.filter(item => item.id !== id));
        }
    };

    const formatDate = date =>
        new Date(date).toLocaleString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <AdminLayout>
            <style>
                {`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes shimmer {
                        0% {
                            background-position: -200px 0;
                        }
                        100% {
                            background-position: calc(200px + 100%) 0;
                        }
                    }

                    @keyframes pulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.05);
                        }
                    }

                    @keyframes glow {
                        0%, 100% {
                            box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
                        }
                        50% {
                            box-shadow: 0 0 30px rgba(212, 175, 55, 0.6);
                        }
                    }

                    .fade-in {
                        animation: fadeInUp 0.6s ease-out;
                    }

                    .shimmer {
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                        background-size: 200px 100%;
                        animation: shimmer 2s infinite;
                    }

                    .pulse {
                        animation: pulse 2s infinite;
                    }

                    .glow {
                        animation: glow 3s ease-in-out infinite;
                    }

                    .glass-card {
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    }

                    .gradient-text {
                        background: linear-gradient(135deg, #D4AF37, #B8860B, #DAA520);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }

                    .hover-lift {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .hover-lift:hover {
                        transform: translateY(-8px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                    }

                    .modern-button {
                        position: relative;
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .modern-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    }

                    .modern-button::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                        transition: left 0.5s;
                    }

                    .modern-button:hover::before {
                        left: 100%;
                    }

                    .table-row {
                        transition: all 0.3s ease;
                    }

                    .table-row:hover {
                        background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(255, 255, 255, 0.9)) !important;
                        transform: scale(1.01);
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    }
                `}
            </style>

            {/* Header */}
            <div className="fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "48px",
                            color: "white",
                            filter: "drop-shadow(0 4px 20px rgba(212, 175, 55, 0.3))",
                        }}
                    >
                        💬
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: "-10px",
                            right: "-10px",
                            width: "20px",
                            height: "20px",
                            background: "linear-gradient(135deg, #4CAF50, #45a049)",
                            borderRadius: "50%",
                            animation: "pulse 2s infinite",
                        }}
                    ></div>
                </div>
                <h1
                    className="gradient-text"
                    style={{
                        fontSize: "48px",
                        margin: "20px 0",
                        fontWeight: "800",
                        letterSpacing: "-1px",
                        textShadow: "0 4px 20px rgba(212, 175, 55, 0.3)",
                    }}
                >
                    Quản lý Feedback
                </h1>
                <p
                    style={{
                        fontSize: "18px",
                        color: "#8B7355",
                        fontWeight: "500",
                        opacity: "0.8",
                    }}
                >
                    Xem và quản lý feedback từ người dùng
                </p>
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
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="glass-card hover-lift fade-in"
                        style={{
                            background: stat.color,
                            padding: "30px",
                            borderRadius: "24px",
                            textAlign: "center",
                            position: "relative",
                            overflow: "hidden",
                            animationDelay: `${index * 0.1}s`,
                        }}
                    >
                        <div
                            style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                right: "0",
                                bottom: "0",
                                background: "rgba(255, 255, 255, 0.1)",
                                backdropFilter: "blur(10px)",
                            }}
                        ></div>

                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div
                                style={{
                                    fontSize: "40px",
                                    marginBottom: "15px",
                                    filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.2))",
                                }}
                            >
                                {stat.icon}
                            </div>
                            <div
                                style={{
                                    fontSize: "42px",
                                    fontWeight: "900",
                                    color: "white",
                                    marginBottom: "8px",
                                    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                                }}
                            >
                                {stat.value}
                            </div>
                            <div
                                style={{
                                    color: "rgba(255,255,255,0.9)",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    marginBottom: "8px",
                                }}
                            >
                                {stat.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Feedback Table */}
            <div
                className="glass-card fade-in"
                style={{
                    borderRadius: "24px",
                    maxWidth: "1400px",
                    margin: "0 auto",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))",
                    animationDelay: "0.6s",
                }}
            >
                <div
                    style={{
                        background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                        padding: "20px 30px",
                        color: "white",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        💬 Danh sách Feedback ({filteredFeedbacks.length})
                    </h3>
                </div>

                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr
                                style={{
                                    background: "linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(255, 255, 255, 0.5))",
                                }}
                            >
                                <th
                                    style={{
                                        padding: "20px",
                                        textAlign: "left",
                                        color: "#5D4037",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                    }}
                                >
                                    👤 Người dùng
                                </th>
                                <th
                                    style={{
                                        padding: "20px",
                                        textAlign: "left",
                                        color: "#5D4037",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                    }}
                                >
                                    💬 Nội dung
                                </th>
                                <th
                                    style={{
                                        padding: "20px",
                                        textAlign: "center",
                                        color: "#5D4037",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                    }}
                                >
                                    📅 Ngày tạo
                                </th>
                                <th
                                    style={{
                                        padding: "20px",
                                        textAlign: "center",
                                        color: "#5D4037",
                                        fontWeight: "700",
                                        fontSize: "16px",
                                    }}
                                >
                                    ⚙️ Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbacks.map((feedback, index) => (
                                <tr
                                    key={feedback.id}
                                    className="table-row"
                                    style={{
                                        borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
                                        backgroundColor: index % 2 === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,251,240,0.8)",
                                    }}
                                >
                                    <td style={{ padding: "20px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <div
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    fontWeight: "700",
                                                    fontSize: "20px",
                                                    border: "2px solid #D7A86E",
                                                }}
                                            >
                                                {feedback.userName.charAt(0)}
                                            </div>
                                            <div>
                                                <div
                                                    style={{
                                                        fontWeight: "700",
                                                        color: "#5D4037",
                                                        fontSize: "18px",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    {feedback.userName}
                                                </div>
                                                <div
                                                    style={{
                                                        color: "#8B7355",
                                                        fontSize: "14px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    📧 {feedback.userEmail}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px" }}>
                                        <div
                                            style={{
                                                color: "#5D4037",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                maxWidth: "400px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {feedback.content}
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px", textAlign: "center" }}>
                                        <div
                                            style={{
                                                color: "#8B7355",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {formatDate(feedback.createdAt)}
                                        </div>
                                    </td>
                                    <td style={{ padding: "20px", textAlign: "center" }}>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                                            <button
                                                onClick={() => deleteFeedback(feedback.id)}
                                                className="modern-button"
                                                style={{
                                                    background: "linear-gradient(135deg, #F44336, #d32f2f)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    padding: "10px 16px",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px",
                                                }}
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredFeedbacks.length === 0 && (
                    <div
                        style={{
                            padding: "60px 30px",
                            textAlign: "center",
                            color: "#8B7355",
                            fontSize: "18px",
                            fontWeight: "500",
                        }}
                    >
                        Không có feedback nào
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminFeedback;
