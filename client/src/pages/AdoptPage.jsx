import React, { useState } from "react";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "../styles/index.css";

const pets = Array(8).fill({
    name: "Bé Nâu",
    age: "6 tháng",
    gender: "Đực",
    breed: "Chó Border lai",
    status: "Khỏe mạnh",
    location: "Quận 9",
    image: "https://storage.googleapis.com/a1aa/image/32cb1443-82cf-41dc-56ac-fe3523ae600f.jpg",
});

export default function AdoptPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPets = pets.filter(
        (pet) =>
            pet.name.toLowerCase().includes(search.toLowerCase()) &&
            (filter === "" || pet.breed.toLowerCase().includes(filter.toLowerCase()))
    );

    const petsPerPage = 8;
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    const displayedPets = filteredPets.slice((currentPage - 1) * petsPerPage, currentPage * petsPerPage);

    const gridStyle = {
        display: 'grid',
        gap: '30px', // Increased from 20px to 30px for more spacing
        padding: '0 20px',
    };

    return (
        <>
            <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0", textAlign: "center" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#5C4033", marginBottom: "10px" }}>
                        Nhận nuôi & Tìm gia đình mới cho các bé
                    </h2>
                    <p style={{ fontSize: "16px", color: "#5C4033", marginBottom: "20px" }}>
                        Cho bé một mái ấm - Trọn đời yêu thương!
                    </p>

                    <SearchBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

                    <div className="pet-grid" style={gridStyle}>
                        {displayedPets.map((pet, idx) => (
                            <PetCard key={idx} pet={pet} />
                        ))}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </>
    );
}