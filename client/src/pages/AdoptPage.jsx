import React, { useState, useEffect } from "react";
import PetCard from "../components/PetCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Loading from "../components/Loading";
import "../styles/index.css";
import { getAllPets, createPet } from '../services/petService';
import { useAuth } from '../contexts/AuthContext';
import defaultImage from '../assets/default-image.jpg';

export default function AdoptPage() {
    const { user: currentUser } = useAuth();
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
    const [showPetModal, setShowPetModal] = useState(false);
    const [petForm, setPetForm] = useState({
        name: '',
        species: '',
        breed: '',
        age: '',
        size: '',
        gender: '',
        healthStatus: '',
        color: '',
        weight: '',
        temperament: '',
        address: '',
        contactPhone: '',
        story: '',
    });
    const [petImages, setPetImages] = useState([]);
    const [petSubmitting, setPetSubmitting] = useState(false);
    const [petSubmitError, setPetSubmitError] = useState(null);

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
            {/* Modal đăng động vật */}
            {showPetModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 20,
                        padding: '40px',
                        width: '520px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        position: 'relative',
                        animation: 'modalFadeIn 0.3s ease-out',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <h2 style={{ color: '#5C4033', marginBottom: 18, fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>Đăng động vật mới</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setPetSubmitting(true);
                            setPetSubmitError(null);
                            try {
                                const formData = new FormData();
                                Object.entries(petForm).forEach(([key, value]) => {
                                    if (key === 'healthStatus') {
                                        value.split(',').map(s => s.trim()).forEach(v => formData.append('healthStatus', v));
                                    } else {
                                        formData.append(key, value);
                                    }
                                });
                                formData.append('user', currentUser._id);
                                if (petImages && petImages.length > 0) {
                                    petImages.forEach(img => formData.append('images', img));
                                }
                                await createPet(formData);
                                // Refresh the pets list
                                const res = await getAllPets();
                                let petArray = [];
                                if (Array.isArray(res.data.data)) {
                                    petArray = res.data.data;
                                } else if (res.data.data && typeof res.data.data === 'object') {
                                    petArray = [res.data.data];
                                }
                                const formattedPets = petArray.map((pet, index) => {
                                    const validId = pet._id && typeof pet._id === 'string' && pet._id.length > 0;
                                    return {
                                        _id: validId ? pet._id : `temp-id-${Date.now()}-${index}`,
                                        name: pet.name || 'Unknown',
                                        age: pet.age || 'Not specified',
                                        gender: pet.gender || 'Not specified',
                                        breed: pet.breed || 'Not specified',
                                        color: pet.color || 'Không rõ',
                                        status: pet.temperament || pet.healthStatus?.join(', ') || 'Unknown',
                                        location: pet.address || 'Unknown location',
                                        image: pet.images?.[0] || defaultImage,
                                    };
                                });
                                setPets(formattedPets);
                                setShowPetModal(false);
                                setPetForm({
                                    name: '', species: '', breed: '', age: '', size: '', gender: '', healthStatus: '', color: '', weight: '', temperament: '', address: '', contactPhone: '', story: ''
                                });
                                setPetImages([]);
                            } catch (err) {
                                setPetSubmitError(err.response?.data?.message || 'Lưu thông tin thất bại');
                            } finally {
                                setPetSubmitting(false);
                            }
                        }} encType="multipart/form-data">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <input required placeholder="Tên động vật" value={petForm.name} onChange={e => setPetForm(f => ({ ...f, name: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input required placeholder="Loài (species)" value={petForm.species} onChange={e => setPetForm(f => ({ ...f, species: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Giống (breed)" value={petForm.breed} onChange={e => setPetForm(f => ({ ...f, breed: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Tuổi (age)" value={petForm.age} onChange={e => setPetForm(f => ({ ...f, age: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />

                                <div style={{ display: 'flex', gap: 8 }}>
                                    <label style={{ fontWeight: 500, color: '#8B4513', minWidth: 80 }}>Giới tính:</label>
                                    <select value={petForm.gender} onChange={e => setPetForm(f => ({ ...f, gender: e.target.value }))} style={{ flex: 1, padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }}>
                                        <option value="">Chọn</option>
                                        <option value="male">Đực</option>
                                        <option value="female">Cái</option>
                                    </select>
                                </div>
                                <input placeholder="Tình trạng sức khoẻ (cách nhau bởi dấu phẩy)" value={petForm.healthStatus} onChange={e => setPetForm(f => ({ ...f, healthStatus: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Màu sắc (color)" value={petForm.color} onChange={e => setPetForm(f => ({ ...f, color: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Cân nặng (weight)" value={petForm.weight} onChange={e => setPetForm(f => ({ ...f, weight: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Tính cách (temperament)" value={petForm.temperament} onChange={e => setPetForm(f => ({ ...f, temperament: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Địa chỉ (address)" value={petForm.address} onChange={e => setPetForm(f => ({ ...f, address: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <input placeholder="Số điện thoại liên hệ" value={petForm.contactPhone} onChange={e => setPetForm(f => ({ ...f, contactPhone: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299' }} />
                                <textarea placeholder="Câu chuyện (story)" value={petForm.story} onChange={e => setPetForm(f => ({ ...f, story: e.target.value }))} style={{ padding: 8, borderRadius: 6, border: '1.5px solid #E5C299', minHeight: 60 }} />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    <label style={{ fontWeight: 500, color: '#8B4513' }}>Ảnh động vật (có thể chọn nhiều):</label>
                                    <input type="file" accept="image/*" multiple onChange={e => setPetImages(Array.from(e.target.files))} />
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                                        {petImages && petImages.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative' }}>
                                                <img src={URL.createObjectURL(img)} alt="pet" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '1.5px solid #E5C299' }} />
                                                <button type="button" onClick={() => setPetImages(petImages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: -8, right: -8, background: '#FF6B6B', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', fontSize: 13, fontWeight: 700, lineHeight: '20px', padding: 0 }}>×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {petSubmitError && <div style={{ color: '#FF6B6B', background: '#FFF0F0', borderRadius: 8, padding: 8, textAlign: 'center' }}>{petSubmitError}</div>}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 18 }}>
                                    <button type="button" onClick={() => setShowPetModal(false)} style={{ padding: '10px 28px', borderRadius: 8, border: '2px solid #E5C299', background: 'transparent', color: '#5C4033', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>Huỷ</button>
                                    <button type="submit" disabled={petSubmitting} style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#E5C299', color: '#5C4033', fontWeight: 600, cursor: petSubmitting ? 'not-allowed' : 'pointer', fontSize: 15, opacity: petSubmitting ? 0.7 : 1 }}>{petSubmitting ? 'Đang đăng...' : 'Đăng động vật'}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 0", textAlign: "center" }}>
                    <h2 style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#5C4033",
                        marginBottom: "10px",
                        padding: "0 20px",
                        "@media (max-width: 768px)": {
                            padding: "0 30px",
                            fontSize: "20px"
                        }
                    }}>
                        Nhận nuôi & Tìm gia đình mới cho các bé
                    </h2>
                    <p style={{
                        fontSize: "18px",
                        color: "#5C4033",
                        marginBottom: "20px",
                        padding: "0 20px",
                        "@media (max-width: 768px)": {
                            padding: "0 30px",
                            fontSize: "16px"
                        }
                    }}>
                        Cho bé một mái ấm - Trọn đời yêu thương!
                    </p>

                    <SearchBar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} onSearchResults={handleSearchResults} />

                    {/* Add button to post new animal */}
                    <div style={{ marginTop: "30px", marginBottom: "30px" }}>
                        <button
                            onClick={() => setShowPetModal(true)}
                            style={{
                                backgroundColor: '#E5C299',
                                color: '#5C4033',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '25px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(229,194,153,0.2)',
                                transform: 'translateY(4px)',
                                ':hover': {
                                    transform: 'translateY(0px) scale(1.05)',
                                    boxShadow: '0 6px 20px rgba(229,194,153,0.3)',
                                    backgroundColor: '#D3B17D'
                                }
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(0px) scale(1.05)';
                                e.target.style.boxShadow = '0 6px 20px rgba(229,194,153,0.3)';
                                e.target.style.backgroundColor = '#D3B17D';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(4px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(229,194,153,0.2)';
                                e.target.style.backgroundColor = '#E5C299';
                            }}
                        >
                            Đăng động vật mới
                        </button>
                    </div>

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
