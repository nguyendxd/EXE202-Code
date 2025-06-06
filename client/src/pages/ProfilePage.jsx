import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileById } from '../services/profileService';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getProfileById(id);
                setUser(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Không thể tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserProfile();
        } else {
            setUser(currentUser);
            setLoading(false);
        }
    }, [id, currentUser]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#FAF3E0'
            }}>
                <div style={{ color: '#5C4033', fontSize: '18px' }}>Đang tải...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#FAF3E0'
            }}>
                <div style={{ color: '#FF6B6B', fontSize: '18px' }}>{error}</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#FAF3E0'
            }}>
                <div style={{ color: '#5C4033', fontSize: '18px' }}>Không tìm thấy người dùng</div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#FAF3E0',
            padding: '100px 20px 20px 20px'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    gap: '20px'
                }}>
                    <img
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.username}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '3px solid #E5C299',
                            objectFit: 'cover'
                        }}
                    />
                    <div>
                        <h1 style={{
                            color: '#5C4033',
                            margin: '0 0 10px 0',
                            fontSize: '28px'
                        }}>
                            {user.username}
                        </h1>
                        <p style={{
                            color: '#8B4513',
                            margin: '0',
                            fontSize: '16px'
                        }}>
                            {user.email}
                        </p>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginTop: '30px'
                }}>
                    <div style={{
                        backgroundColor: '#FFF8E7',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #E5C299'
                    }}>
                        <h3 style={{
                            color: '#5C4033',
                            margin: '0 0 15px 0',
                            fontSize: '18px'
                        }}>
                            Thông tin cá nhân
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Họ tên: </span>
                                <span style={{ color: '#5C4033' }}>{user.fullName || 'Chưa cập nhật'}</span>
                            </div>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Số điện thoại: </span>
                                <span style={{ color: '#5C4033' }}>{user.phone || 'Chưa cập nhật'}</span>
                            </div>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Địa chỉ: </span>
                                <span style={{ color: '#5C4033' }}>{user.address || 'Chưa cập nhật'}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#FFF8E7',
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #E5C299'
                    }}>
                        <h3 style={{
                            color: '#5C4033',
                            margin: '0 0 15px 0',
                            fontSize: '18px'
                        }}>
                            Thống kê
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Số bài đăng: </span>
                                <span style={{ color: '#5C4033' }}>{user.postCount || 0}</span>
                            </div>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Số lượt nhận nuôi: </span>
                                <span style={{ color: '#5C4033' }}>{user.adoptionCount || 0}</span>
                            </div>
                            <div>
                                <span style={{ color: '#8B4513', fontWeight: 'bold' }}>Ngày tham gia: </span>
                                <span style={{ color: '#5C4033' }}>
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút chỉnh sửa (chỉ hiển thị cho chủ profile) */}

                <div style={{
                    marginTop: '30px',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => navigate('/setting')}
                        style={{
                            backgroundColor: '#E5C299',
                            color: '#5C4033',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '25px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            ':hover': {
                                backgroundColor: '#D3B17D',
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        Chỉnh sửa thông tin
                    </button>
                </div>
            </div>
        </div>
    );
} 