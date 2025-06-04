import axios from 'axios';

const API_URL = '/users';

export const createUser = (data) => axios.post(API_URL, data);
export const getAllUsers = () => axios.get(API_URL);
export const getUserById = (id) => axios.get(`${API_URL}/${id}`);
export const updateUser = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_URL}/${id}`);
export const updateUserStatus = (id, data) => axios.patch(`${API_URL}/${id}/status`, data);
export const updateUserRole = (id, data) => axios.patch(`${API_URL}/${id}/role`, data);
