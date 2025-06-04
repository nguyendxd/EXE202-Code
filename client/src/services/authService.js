import axiosInstance from '../config/axios';

const API_URL = '/auth';

export const register = (data) => axiosInstance.post(`${API_URL}/register`, data);
export const login = (data) => axiosInstance.post(`${API_URL}/login`, data);
export const resetPassword = (data) => axiosInstance.post(`${API_URL}/reset-password`, data);
