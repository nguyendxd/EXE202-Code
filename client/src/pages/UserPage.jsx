import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById } from '../services/userService';
import { getPetsByUserId } from '../services/petService';
import Loading from '../components/Loading';
import PetCard from '../components/PetCard';
import Pagination from '../components/Pagination';
import "../styles/index.css";
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

export default function UserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pets, setPets] = useState([]);
    const [petsLoading, setPetsLoading] = useState(true);
    const [petsError, setPetsError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const [canViewPrivateInfo, setCanViewPrivateInfo] = useState(false);

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
        // Fetch pets by user
        const fetchPets = async () => {
            setPetsLoading(true);
            setPetsError(null);
            try {
                const res = await getPetsByUserId(id);
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
            } catch (err) {
                setPetsError("Không thể tải danh sách thú cưng.");
            } finally {
                setPetsLoading(false);
            }
        };
        fetchPets();
        // Kiểm tra đã có conversation chưa
        const checkConversation = async () => {
            const currentUserId = localStorage.getItem('userId');
            if (!currentUserId || !id || currentUserId === id) {
                setCanViewPrivateInfo(false);
                return;
            }
            const conversationId1 = `${currentUserId}_${id}`;
            const conversationId2 = `${id}_${currentUserId}`;
            const q = query(collection(db, 'conversations'));
            const snapshot = await getDocs(q);
            let found = false;
            snapshot.forEach(doc => {
                if (doc.id === conversationId1 || doc.id === conversationId2) {
                    found = true;
                }
            });
            setCanViewPrivateInfo(found);
        };
        checkConversation();
    }, [id]);

    if (loading) return <Loading />;
    if (error || !user) return <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error || "Không có dữ liệu."}</div>;

    // Sau khi lấy pets xong
    const totalPages = Math.ceil(pets.length / pageSize);
    const pagedPets = pets.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ backgroundColor: "#FFF7E2", minHeight: "100vh", fontFamily: "Arial, sans-serif", padding: "clamp(20px, 4vw, 40px)" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "clamp(20px, 4vw, 32px) clamp(20px, 4vw, 40px)" }}>
                <div style={{ display: "flex", gap: "clamp(20px, 4vw, 40px)", flexWrap: "wrap" }}>
                    {/* Bên trái: avatar và mô tả */}
                    <div style={{ flex: "1 1 300px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={user.avatar || "https://via.placeholder.com/160x160?text=No+Avatar"}
                            alt={user.username}
                            style={{ width: "clamp(120px, 25vw, 160px)", height: "clamp(120px, 25vw, 160px)", borderRadius: "16px", objectFit: "cover", background: '#FFF7E2', border: '2px solid #E5C299', marginBottom: 20 }}
                        />
                        <div style={{ width: '100%', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center' }}>
                            <span style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, color: '#5C4033', marginRight: 8, wordWrap: 'break-word', overflowWrap: 'break-word' }}>{user.username || 'Chưa có tên'}</span>
                            <span title="Thông tin trạm cứu hộ" style={{ fontSize: "clamp(18px, 4vw, 22px)", color: '#A47148' }}>❗</span>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div style={{ fontWeight: 600, color: '#7A5F3C', marginBottom: 6, fontSize: "clamp(14px, 3vw, 16px)" }}>Miêu tả</div>
                            <div style={{ background: '#FFF7E2', border: '2px solid #E5C299', borderRadius: 12, padding: "clamp(12px, 3vw, 16px)", minHeight: 80, color: '#5C4033', fontSize: "clamp(14px, 3vw, 16px)", wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                                {user.description || 'Chưa có mô tả'}
                            </div>
                        </div>
                    </div>
                    {/* Bên phải: thông tin chi tiết */}
                    <div style={{ flex: "1 1 400px", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ fontWeight: 700, fontSize: "clamp(20px, 4.5vw, 24px)", color: '#5C4033', marginBottom: 18, wordWrap: 'break-word', overflowWrap: 'break-word' }}>Trại cứu hộ chó mèo</div>
                        <div style={{ borderTop: '2px solid #E5C299', marginBottom: 18 }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, fontSize: "clamp(15px, 3.5vw, 17px)" }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
                                <b style={{ color: '#7A5F3C', minWidth: 'clamp(80px, 20vw, 120px)', display: 'inline-block' }}>Email:</b>
                                <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{user.email || '[Chưa có email]'}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
                                <b style={{ color: '#7A5F3C', minWidth: 'clamp(80px, 20vw, 120px)', display: 'inline-block' }}>Số điện thoại:</b>
                                <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{canViewPrivateInfo ? (user.phone || '[Chưa có số điện thoại]') : <i>Chỉ hiển thị khi đã nhắn tin</i>}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
                                <b style={{ color: '#7A5F3C', minWidth: 'clamp(80px, 20vw, 120px)', display: 'inline-block' }}>Địa chỉ:</b>
                                <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{canViewPrivateInfo ? (user.address || '[Chưa có địa chỉ]') : <i>Chỉ hiển thị khi đã nhắn tin</i>}</span>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'flex-start' }}>
                                <b style={{ color: '#7A5F3C', minWidth: 'clamp(80px, 20vw, 120px)', display: 'inline-block' }}>Link mạng xã hội:</b>
                                <span style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{user.socialLink ? <a href={user.socialLink} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{user.socialLink}</a> : '[Chưa có link]'}</span>
                            </div>
                        </div>
                        <div style={{ borderTop: '2px solid #E5C299', margin: '32px 0 0 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                            <button
                                style={{
                                    background: "#E5C299",
                                    color: "#5C4033",
                                    border: "none",
                                    borderRadius: "20px",
                                    padding: "clamp(10px, 2.5vw, 12px) clamp(30px, 6vw, 40px)",
                                    fontSize: "clamp(16px, 3.5vw, 18px)",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "background 0.3s ease-in-out",
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    whiteSpace: 'nowrap'
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
            {/* Danh sách pet của user */}
            <div style={{ maxWidth: "1100px", margin: "32px auto 0 auto", background: "#fff", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "clamp(20px, 4vw, 32px) clamp(20px, 4vw, 40px)" }}>
                <div style={{ fontWeight: 700, fontSize: "clamp(18px, 4vw, 22px)", color: '#5C4033', marginBottom: 24, wordWrap: 'break-word', overflowWrap: 'break-word' }}>Các động vật cần nhận nuôi ở trạm này</div>
                {petsLoading ? (
                    <div style={{ textAlign: 'center', color: '#A47148' }}>Đang tải danh sách thú cưng...</div>
                ) : petsError ? (
                    <div style={{ textAlign: 'center', color: 'red' }}>{petsError}</div>
                ) : pets.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#A47148' }}>Chưa có thú cưng nào được đăng.</div>
                ) : (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: 'clamp(20px, 4vw, 32px)',
                            justifyItems: 'center',
                            marginTop: 8
                        }}>
                            {pagedPets.map(pet => (
                                <PetCard key={pet._id} pet={pet} />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
}