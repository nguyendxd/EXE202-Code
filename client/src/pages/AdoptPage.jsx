import React, { useState, useEffect } from "react";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import "../styles/index.css";
import { getAllPets } from '../services/petService';
import defaultImage from '../assets/default-image.jpg';

export default function AdoptPage() {
    const [pets, setPets] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState({
        loai: "",
        gioiTinh: "",
        mauSac: "",
        tinhTrang: "",
        viTri: "",
        doTuoi: ""
    });
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
                    color: pet.color || 'Không rõ',
                    status: pet.temperament || pet.healthStatus?.join(', ') || 'Unknown',
                    location: pet.address || 'Unknown location',
                    image: pet.images?.[0] || defaultImage,
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

    const filteredPets = pets.filter((pet) => {
        const matchName = (pet.name || "").toLowerCase().includes(search.toLowerCase());
        const matchBreed = !filter.loai || (pet.breed || "").toLowerCase().includes(filter.loai.toLowerCase());
        const matchGender = !filter.gioiTinh || (pet.gender || "").toLowerCase().includes(filter.gioiTinh.toLowerCase());
        const matchColor = !filter.mauSac || (pet.color || "").toLowerCase().includes(filter.mauSac.toLowerCase());
        const matchLocation = !filter.viTri || (pet.location || "").toLowerCase().includes(filter.viTri.toLowerCase());
        const matchAge = !filter.doTuoi || (pet.age || "").toLowerCase().includes(filter.doTuoi.toLowerCase());
        // Có thể bổ sung matchTinhTrang nếu cần
        return matchName && matchBreed && matchGender && matchColor && matchLocation && matchAge;
    });

    const petsPerPage = 8;
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    const displayedPets = filteredPets.slice((currentPage - 1) * petsPerPage, currentPage * petsPerPage);

    const gridStyle = {
        display: 'grid',
        gap: '30px',
        padding: '0 20px',
    };

    const handleSearchResults = (results) => {
        // Format lại dữ liệu để đảm bảo có trường image
        const formattedPets = (results || []).map(pet => ({
            _id: pet._id || `temp-id-${Math.random()}`,
            name: pet.name || 'Unknown',
            age: pet.age || 'Not specified',
            gender: pet.gender || 'Not specified',
            breed: pet.breed || 'Not specified',
            color: pet.color || 'Không rõ',
            status: pet.temperament || (pet.healthStatus?.join(', ') || 'Unknown'),
            location: pet.address || 'Unknown location',
            image: (pet.images && pet.images[0]) ? pet.images[0] : defaultImage,
        }));
        setPets(formattedPets);
        setCurrentPage(1);
    };

    return (
        <>
            <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0", textAlign: "center" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#5C4033", marginBottom: "10px" }}>
                        Nhận nuôi & Tìm gia đình mới cho các bé
                    </h2>
                    <p style={{ fontSize: "18px", color: "#5C4033", marginBottom: "20px" }}>
                        Cho bé một mái ấm - Trọn đời yêu thương!
                    </p>

                    <SearchBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onSearchResults={handleSearchResults} />

                    {loading ? (
                        <Loading />
                    ) : (
                        <div className="pet-grid" style={gridStyle}>
                            {displayedPets.map((pet, idx) => (
                                console.log(pet),
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
