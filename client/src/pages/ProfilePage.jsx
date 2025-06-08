import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileById, updateProfile } from '../services/profileService';

// Thêm style responsive cho phần profile info
const profileResponsiveStyle = `
@media (max-width: 700px) {
  .profile-info-container {
    flex-direction: column !important;
    align-items: center !important;
    gap: 48px !important;
    padding: 18px !important;
  }
  .profile-info-left, .profile-info-right {
    width: 100% !important;
    max-width: 420px !important;
    margin: 0 auto !important;
  }
}
.profile-info-container {
  gap: 64px !important;
}
`;

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        email: '',
        phone: '',
        address: '',
        socialLink: '',
        description: '',
        avatar: ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);

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

    useEffect(() => {
        if (user) {
            setForm({
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                socialLink: user.socialLink || '',
                description: user.description || '',
                avatar: user.avatar || ''
            });
            setAvatarFile(null);
        }
    }, [user]);

    // Không cho scroll khi mở modal
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

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
            <style>{profileResponsiveStyle}</style>
            {/* Modal cập nhật thông tin */}
            {showModal && (
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
                        width: '500px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                        position: 'relative',
                        animation: 'modalFadeIn 0.3s ease-out'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                            <h2 style={{
                                color: '#5C4033',
                                marginBottom: 28,
                                fontSize: 24,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                width: 400
                            }}>Cập nhật thông tin</h2>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setUpdating(true);
                                setUpdateError(null);
                                try {
                                    const updateData = { ...form };
                                    const res = await updateProfile(user._id, updateData);
                                    setUser(prev => ({ ...prev, ...updateData }));
                                    setShowModal(false);
                                } catch (err) {
                                    setUpdateError(err.response?.data?.message || 'Cập nhật thất bại');
                                } finally {
                                    setUpdating(false);
                                }
                            }} style={{ width: 400 }}>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 18,
                                    width: '100%'
                                }}>
                                    <div style={{ width: '100%' }}>
                                        <label style={{
                                            color: '#8B4513',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 6,
                                            fontSize: 15,
                                            textAlign: 'left'
                                        }}>Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                border: '2px solid #E5C299',
                                                fontSize: 15,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                marginBottom: 2
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label style={{
                                            color: '#8B4513',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 6,
                                            fontSize: 15,
                                            textAlign: 'left'
                                        }}>Số điện thoại</label>
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                border: '2px solid #E5C299',
                                                fontSize: 15,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                marginBottom: 2
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label style={{
                                            color: '#8B4513',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 6,
                                            fontSize: 15,
                                            textAlign: 'left'
                                        }}>Địa chỉ</label>
                                        <input
                                            type="text"
                                            value={form.address}
                                            onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                border: '2px solid #E5C299',
                                                fontSize: 15,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                marginBottom: 2
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label style={{
                                            color: '#8B4513',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 6,
                                            fontSize: 15,
                                            textAlign: 'left'
                                        }}>Link mạng xã hội</label>
                                        <input
                                            type="text"
                                            value={form.socialLink}
                                            onChange={e => setForm(f => ({ ...f, socialLink: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                border: '2px solid #E5C299',
                                                fontSize: 15,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                marginBottom: 2
                                            }}
                                        />
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <label style={{
                                            color: '#8B4513',
                                            fontWeight: 600,
                                            display: 'block',
                                            marginBottom: 6,
                                            fontSize: 15,
                                            textAlign: 'left'
                                        }}>Miêu tả</label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                            style={{
                                                width: '100%',
                                                padding: '10px 14px',
                                                borderRadius: 8,
                                                border: '2px solid #E5C299',
                                                fontSize: 15,
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                                marginBottom: 2,
                                                minHeight: 70,
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                </div>
                                {updateError && (
                                    <div style={{
                                        color: '#FF6B6B',
                                        margin: '18px auto',
                                        padding: '10px',
                                        backgroundColor: '#FFF0F0',
                                        borderRadius: 8,
                                        fontSize: 14,
                                        maxWidth: 340,
                                        textAlign: 'center'
                                    }}>{updateError}</div>
                                )}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 16,
                                    marginTop: 26
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: '10px 28px',
                                            borderRadius: 8,
                                            border: '2px solid #E5C299',
                                            background: 'transparent',
                                            color: '#5C4033',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            fontSize: 15,
                                            transition: 'all 0.2s',
                                            boxShadow: '0 2px 8px rgba(229,194,153,0.08)'
                                        }}
                                    >
                                        Huỷ
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        style={{
                                            padding: '10px 28px',
                                            borderRadius: 8,
                                            border: 'none',
                                            background: '#E5C299',
                                            color: '#5C4033',
                                            fontWeight: 600,
                                            cursor: updating ? 'not-allowed' : 'pointer',
                                            fontSize: 15,
                                            transition: 'all 0.2s',
                                            opacity: updating ? 0.7 : 1,
                                            boxShadow: '0 2px 8px rgba(229,194,153,0.12)'
                                        }}
                                    >
                                        {updating ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
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
                    gap: 40,
                    alignItems: 'flex-start',
                    marginBottom: 30,
                    background: 'linear-gradient(90deg, #fff7e2 60%, #f7e2b8 100%)',
                    borderRadius: 18,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                    padding: 32,
                }} className="profile-info-container">
                    {/* Bên trái: avatar và mô tả */}
                    <div className="profile-info-left" style={{ flex: 0.38, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
                        <div style={{ position: 'relative', marginBottom: 10 }}>
                            <img
                                src={form.avatar || '/placeholder.svg'}
                                alt={user.username}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    background: '#FFF7E2',
                                    border: '3px solid #E5C299',
                                    boxShadow: '0 4px 16px rgba(164,113,72,0.10)'
                                }}
                            />
                        </div>
                        <div style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 26, fontWeight: 800, color: '#5C4033', letterSpacing: 0.5 }}>{user.username || 'Chưa có tên'}</span>
                        </div>
                        <div style={{ width: '100%' }}>
                            <div style={{ fontWeight: 600, color: '#7A5F3C', marginBottom: 6, fontSize: 17 }}>Miêu tả</div>
                            <div style={{ background: '#FFF7E2', border: '2px solid #E5C299', borderRadius: 12, padding: 16, minHeight: 80, color: '#5C4033', fontSize: 16, fontStyle: 'italic', boxShadow: '0 1px 4px rgba(229,194,153,0.08)' }}>
                                {user.description || 'Chưa có mô tả'}
                            </div>
                        </div>
                    </div>
                    {/* Bên phải: thông tin chi tiết */}
                    <div className="profile-info-right" style={{ flex: 0.62, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
                        <div style={{ fontWeight: 800, fontSize: 26, color: '#5C4033', marginBottom: 10, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span>Thông tin người dùng</span>
                        </div>
                        <div style={{ borderTop: '2px solid #E5C299', marginBottom: 18 }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 17 }}>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Email:</b> {user.email || '[Chưa có email]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Số điện thoại:</b> {user.phone || '[Chưa có số điện thoại]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Địa chỉ:</b> {user.address || '[Chưa có địa chỉ]'}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Link MXH:</b> {user.socialLink ? <a href={user.socialLink} target="_blank" rel="noopener noreferrer" style={{ color: '#A47148', textDecoration: 'underline' }}>{user.socialLink}</a> : '[Chưa có link]'}</div>
                        </div>
                        <div style={{ borderTop: '2px solid #E5C299', margin: '32px 0 0 0' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18, fontSize: 17 }}>
                            <div style={{ fontWeight: 700, color: '#5C4033', fontSize: 18, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span>Thống kê</span>
                            </div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Số bài đăng:</b> {user.postCount || 0}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Số lượt nhận nuôi:</b> {user.adoptionCount || 0}</div>
                            <div><b style={{ color: '#7A5F3C', minWidth: 120, display: 'inline-block' }}>Ngày tham gia:</b> {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '[Chưa có]'}</div>
                        </div>
                    </div>
                </div>

                {/* Nút chỉnh sửa (chỉ hiển thị cho chủ profile) */}

                <div style={{
                    marginTop: '30px',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={() => setShowModal(true)}
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