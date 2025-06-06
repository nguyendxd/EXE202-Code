import React from "react";

const wishlistPets = [
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    // Lặp lại 6 lần cho demo
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
    {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&q=80",
    },
];

export default function UserWishlist() {
    return (
        <div style={{ minHeight: "100vh", background: "#222", padding: 0, margin: 0 }}>
            <style>{`
                @media (max-width: 1100px) {
                    .wishlist-grid { grid-template-columns: repeat(2, 1fr) !important; padding: 0 20px 30px 20px !important; }
                }
                @media (max-width: 700px) {
                    .wishlist-grid { grid-template-columns: 1fr !important; padding: 0 6px 20px 6px !important; }
                    .wishlist-card { max-width: 98vw !important; min-width: 0 !important; }
                    .wishlist-title { font-size: 20px !important; margin: 24px 0 18px 0 !important; }
                }
            `}</style>
            <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", minHeight: "100vh" }}>
                {/* Sidebar */}
                <div style={{
                    width: 220,
                    background: "#222",
                    color: "#fff",
                    padding: "40px 0 0 0",
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                }}>
                    <div style={{ background: "#FAF3E0", color: "#222", borderRadius: 0, padding: 0, height: "100%" }}>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ padding: "18px 32px", borderBottom: "1px solid #e5e5e5", color: "#222" }}>Thông tin người dùng</li>
                            <li style={{ padding: "18px 32px", borderBottom: "1px solid #e5e5e5", color: "#222" }}>Danh sách nhận nuôi</li>
                            <li style={{ padding: "18px 32px", background: "#F5E8C7", borderRadius: 12, color: "#5C4033", fontWeight: 600, margin: "12px 16px" }}>Wishlist</li>
                            <li style={{ padding: "18px 32px", borderBottom: "1px solid #e5e5e5", color: "#222" }}>Bài đăng cá nhân</li>
                            <li style={{ padding: "18px 32px", color: "#222" }}>Đăng xuất</li>
                        </ul>
                    </div>
                </div>
                {/* Main content */}
                <div style={{ flex: 1, background: "#FAF3E0", padding: 0, minHeight: "100vh" }}>
                    <h2 className="wishlist-title" style={{ textAlign: "center", margin: "40px 0 32px 0", color: "#5C4033", fontWeight: 600, fontSize: 28 }}>Danh sách được yêu thích</h2>
                    <div className="wishlist-grid" style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 36,
                        justifyContent: "center",
                        padding: "0 60px 40px 60px",
                    }}>
                        {wishlistPets.map((pet, idx) => (
                            <div key={idx} className="wishlist-card" style={{
                                background: "#F5E8C7",
                                border: "3px solid #C69447",
                                borderRadius: 18,
                                boxShadow: "0 2px 8px #e5c29955",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "0 0 18px 0",
                                minHeight: 340,
                                maxWidth: 260,
                                margin: "0 auto"
                            }}>
                                <img src={pet.image} alt={pet.name} style={{ width: 160, height: 160, objectFit: "cover", borderRadius: 12, marginTop: 18, boxShadow: "0 2px 8px #c6944740" }} />
                                <div style={{ fontWeight: 700, color: "#5C4033", fontSize: 18, margin: "12px 0 0 0" }}>{pet.name}</div>
                                <div style={{ color: "#5C4033", fontSize: 14, margin: "8px 0 0 0", textAlign: "center" }}>
                                    Tuổi: {pet.age}<br />
                                    Giới tính: {pet.gender}<br />
                                    Giống: {pet.breed}<br />
                                    Tình trạng: {pet.status}<br />
                                    Nơi ở: {pet.location}
                                </div>
                                <div style={{ alignSelf: "flex-end", margin: "8px 18px 0 0", fontSize: 22, color: "#C94F4F" }}>♥</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
