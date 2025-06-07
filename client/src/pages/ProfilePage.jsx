import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileById, updateProfile } from '../services/profileService';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        address: '',
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
                fullName: user.fullName || '',
                phone: user.phone || '',
                address: user.address || '',
                avatar: user.avatar || ''
            });
            setAvatarFile(null);
        }
    }, [user]);

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
            {/* Modal cập nhật thông tin */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.25)',
                    zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: 12,
                        padding: 32,
                        minWidth: 340,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                        position: 'relative'
                    }}>
                        <h2 style={{ color: '#5C4033', marginBottom: 18, fontSize: 22 }}>Cập nhật thông tin</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setUpdating(true);
                            setUpdateError(null);
                            try {
                                let updateData = { ...form };
                                if (avatarFile) {
                                    // upload file lên server hoặc cloud, lấy url trả về
                                    // ở đây giả lập upload, thực tế bạn cần gọi API upload
                                    // ví dụ: const url = await uploadAvatar(avatarFile);
                                    // updateData.avatar = url;
                                    // demo: dùng URL.createObjectURL
                                    updateData.avatar = form.avatar;
                                }
                                const res = await updateProfile(user._id, updateData);
                                setUser(prev => ({ ...prev, ...updateData }));
                                setShowModal(false);
                            } catch (err) {
                                setUpdateError(err.response?.data?.message || 'Cập nhật thất bại');
                            } finally {
                                setUpdating(false);
                            }
                        }}>
                            <div style={{ marginBottom: 16, textAlign: 'center' }}>
                                <label style={{ color: '#8B4513', fontWeight: 600, display: 'block', marginBottom: 8 }}>Ảnh đại diện</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setAvatarFile(file);
                                            setForm(f => ({ ...f, avatar: URL.createObjectURL(file) }));
                                        }
                                    }}
                                    style={{ marginBottom: 10 }}
                                />
                                {form.avatar && (
                                    <img src={form.avatar} alt="avatar preview" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E5C299', marginTop: 8 }} />
                                )}
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ color: '#8B4513', fontWeight: 600 }}>Họ tên</label>
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E5C299', marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ color: '#8B4513', fontWeight: 600 }}>Số điện thoại</label>
                                <input
                                    type="text"
                                    value={form.phone}
                                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E5C299', marginTop: 4 }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <label style={{ color: '#8B4513', fontWeight: 600 }}>Địa chỉ</label>
                                <input
                                    type="text"
                                    value={form.address}
                                    onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #E5C299', marginTop: 4 }}
                                    required
                                />
                            </div>
                            {updateError && <div style={{ color: 'red', marginBottom: 10 }}>{updateError}</div>}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#eee', color: '#5C4033', fontWeight: 600, cursor: 'pointer' }}>Huỷ</button>
                                <button type="submit" disabled={updating} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#E5C299', color: '#5C4033', fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer' }}>{updating ? 'Đang lưu...' : 'Lưu'}</button>
                            </div>
                        </form>
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
                }}>
                    {/* Bên trái: avatar và mô tả */}
                    <div style={{ flex: 0.38, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
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
                    <div style={{ flex: 0.62, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
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