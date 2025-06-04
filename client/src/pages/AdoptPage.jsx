import React, { useState, useEffect } from "react";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import "../styles/index.css";
import { getAllPets } from '../services/petService';

export default function AdoptPage() {
    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getAllPets();
                console.log(res.data.data);
                let petArray = [];
                if (Array.isArray(res.data.data)) {
                    petArray = res.data.data;
                } else if (res.data.data && typeof res.data.data === 'object') {
                    petArray = [res.data.data];
                }
                // Ensure all required fields are present, with fallbacks
                const formattedPets = petArray.map(pet => ({
                    _id: pet._id || `temp-id-${Math.random()}`, // Fallback for missing _id
                    name: pet.name || 'Unknown', // Fallback for missing name
                    age: pet.age || 'Not specified',
                    gender: pet.gender || 'Not specified',
                    breed: pet.breed || 'Not specified',
                    status: pet.temperament || pet.healthStatus?.join(', ') || 'Unknown',
                    location: pet.address || 'Unknown location',
                    image: pet.images?.[0] || 'https://via.placeholder.com/200',
                }));
                setPets(formattedPets);
            } catch (error) {
                console.error("Lỗi khi fetch pets:", error);
                setError(error.message);
                setPets([]); // Ensure pets is an empty array on error
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    const filteredPets = pets.filter(
        (pet) =>
            (pet.name || "").toLowerCase().includes(search.toLowerCase()) &&
            (filter === "" || (pet.breed || "").toLowerCase().includes(filter.toLowerCase()))
    );

    const petsPerPage = 8;
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    const displayedPets = filteredPets.slice((currentPage - 1) * petsPerPage, currentPage * petsPerPage);

    const gridStyle = {
        display: 'grid',
        gap: '30px',
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

                    {loading ? (
                        <div>Đang tải danh sách thú cưng...</div>
                    ) : (
                        <div className="pet-grid" style={gridStyle}>
                            {displayedPets.map((pet, idx) => (
                                <PetCard key={pet._id || idx} pet={pet} />
                            ))}
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </>
    );
}
