import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm xử lý đăng xuất
const handleLogout = () => {
    // Xóa tất cả thông tin người dùng
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/login';
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage nếu có
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Xử lý lỗi từ server
            switch (error.response.status) {
                case 401:
                    // Xử lý lỗi unauthorized (token hết hạn hoặc không hợp lệ)
                    handleLogout();
                    break;
                case 403:
                    // Xử lý lỗi forbidden
                    console.error('Bạn không có quyền truy cập');
                    // Nếu là lỗi token hết hạn, đăng xuất
                    if (error.response.data?.message?.includes('token expired')) {
                        handleLogout();
                    }
                    break;
                case 404:
                    // Xử lý lỗi not found
                    console.error('Không tìm thấy tài nguyên');
                    break;
                case 500:
                    // Xử lý lỗi server
                    console.error('Lỗi server');
                    break;
                default:
                    console.error('Có lỗi xảy ra');
            }
        } else if (error.request) {
            // Xử lý lỗi không nhận được response
            console.error('Không thể kết nối đến server');
        } else {
            // Xử lý lỗi khác
            console.error('Có lỗi xảy ra:', error.message);
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 