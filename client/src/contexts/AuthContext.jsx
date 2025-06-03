import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            // Có thể thêm logic để lấy thông tin user ở đây
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth phải được sử dụng trong AuthProvider');
    }
    return context;
}; 