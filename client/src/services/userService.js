import axiosInstance from '../config/axios';

const API_URL = '/users';

export const createUser = (data) => axiosInstance.post(API_URL, data);
export const getAllUsers = () => axiosInstance.get(API_URL);
export const getUserById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`${API_URL}/${id}`);
export const updateUserStatus = (id, data) => axiosInstance.patch(`${API_URL}/${id}/status`, data);
export const updateUserRole = (id, data) => axiosInstance.patch(`${API_URL}/${id}/role`, data);
