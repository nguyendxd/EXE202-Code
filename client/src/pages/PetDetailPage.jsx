import React from "react";
import { useParams } from "react-router-dom";
import "../styles/index.css";

const petData = {
    "Bé Nâu": {
        name: "Bé Nâu",
        age: "6 tháng",
        gender: "Đực",
        breed: "Chó Border lai",
        status: "Khỏe mạnh",
        location: "Quận 9",
        price: "Cân nặng: 3kg",
        description: "Đã tiêm: + Khỏe mạnh\n+ Đã được tiêm phòng\n+ Chưa triệt sản",
        contact: "Địa chỉ: Trại chó hồ mèo, 10/3 Bình Quới, Phường 28, Bình Thạnh, Hồ Chí Minh, Việt Nam\nSđt liên hệ: 0912345568",
        image: "https://storage.googleapis.com/a1aa/image/32cb1443-82cf-41dc-56ac-fe3523ae600f.jpg",
        story: "Câu chuyện: The need of travelers had made Sinh Cafe feel that it is necessary to introduce travelers its Vietnam country, it’s culture, it’s people with its friendly instinct and hospitality. Sinh Cafe was the first tour agent who has provided travelers with travel information and transport to ease their travel."
    }
};

export default function PetDetailPage() {
    const { petName } = useParams();
    const pet = petData[petName];

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0", textAlign: "center" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#5C4033", marginBottom: "10px" }}>
                    {pet.name}
                </h2>
                <p style={{ fontSize: "16px", color: "#5C4033", marginBottom: "20px" }}>
                    Thêm bạn đồng hành yêu thích
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "30px", padding: "20px", background: "#fff", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                    <img src={pet.image} alt={pet.name} style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "10px" }} />
                    <div style={{ textAlign: "left", maxWidth: "400px" }}>
                        <p><strong>Tuổi:</strong> {pet.age}</p>
                        <p><strong>Giới tính:</strong> {pet.gender}</p>
                        <p><strong>Giống:</strong> {pet.breed}</p>
                        <p><strong>Trạng thái:</strong> {pet.status}</p>
                        <p><strong>Địa chỉ:</strong> {pet.location}</p>
                        <p><strong>{pet.price}</strong></p>
                        <p><strong>Thông tin:</strong> {pet.description}</p>
                        <p><strong>Liên hệ:</strong> {pet.contact}</p>
                        <p><strong>Câu chuyện:</strong> {pet.story}</p>
                        <button style={{ backgroundColor: "#FF6F61", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
                            Đăng ký
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button style={{ backgroundColor: "#FF6F61", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
                        &lt; Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}