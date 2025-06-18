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
                console.log('API Response:', res.data);
                console.log('Data structure:', res.data.data);
                console.log('Data type:', typeof res.data.data);
                console.log('Is array:', Array.isArray(res.data.data));

                let petArray = [];
                if (Array.isArray(res.data.data)) {
                    petArray = res.data.data;
                    console.log('Pet array length:', petArray.length);
                    console.log('First pet:', petArray[0]);
                    console.log('All pets:', petArray);
                } else if (res.data.data && typeof res.data.data === 'object') {
                    petArray = [res.data.data];
                    console.log('Single pet object converted to array');
                }
                // Ensure all required fields are present, with fallbacks
                const formattedPets = petArray.map((pet, index) => {
                    console.log('Processing pet:', pet._id, pet.name);
                    // Kiểm tra xem pet có _id hợp lệ không
                    const validId = pet._id && typeof pet._id === 'string' && pet._id.length > 0;
                    console.log('Valid ID:', validId, 'ID value:', pet._id);

                    return {
                        _id: validId ? pet._id : `temp-id-${Date.now()}-${index}`, // Better fallback for missing _id
                        name: pet.name || 'Unknown', // Fallback for missing name
                        age: pet.age || 'Not specified',
                        gender: pet.gender || 'Not specified',
                        breed: pet.breed || 'Not specified',
                        color: pet.color || 'Không rõ',
                        status: pet.temperament || pet.healthStatus?.join(', ') || 'Unknown',
                        location: pet.address || 'Unknown location',
                        image: pet.images?.[0] || defaultImage,
                    };
                });
                console.log('Formatted pets:', formattedPets);
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
        const isMatch = matchName && matchBreed && matchGender && matchColor && matchLocation && matchAge;
        if (!isMatch) {
            console.log('Pet filtered out:', pet.name, {
                matchName, matchBreed, matchGender, matchColor, matchLocation, matchAge,
                search, filter
            });
        }
        return isMatch;
    });

    const petsPerPage = 8;
    const totalPages = Math.ceil(filteredPets.length / petsPerPage);
    const displayedPets = filteredPets.slice((currentPage - 1) * petsPerPage, currentPage * petsPerPage);

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '30px',
        padding: '0 20px',
        justifyContent: 'center',
        alignItems: 'start',
    };

    const handleSearchResults = (results) => {
        // Format lại dữ liệu để đảm bảo có trường image
        const formattedPets = (results || []).map((pet, index) => {
            const validId = pet._id && typeof pet._id === 'string' && pet._id.length > 0;
            console.log('Search result pet ID:', pet._id, 'Valid:', validId);

            return {
                _id: validId ? pet._id : `temp-id-${Date.now()}-${index}`,
                name: pet.name || 'Unknown',
                age: pet.age || 'Not specified',
                gender: pet.gender || 'Not specified',
                breed: pet.breed || 'Not specified',
                color: pet.color || 'Không rõ',
                status: pet.temperament || (pet.healthStatus?.join(', ') || 'Unknown'),
                location: pet.address || 'Unknown location',
                image: (pet.images && pet.images[0]) ? pet.images[0] : defaultImage,
            };
        });
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
                            {displayedPets.map((pet, idx) => {
                                console.log('Rendering pet:', pet._id, pet.name, 'Index:', idx);
                                console.log('Pet object:', pet);
                                return <PetCard key={pet._id || idx} pet={pet} />;
                            })}
                        </div>
                    )}

                    <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </>
    );
}
