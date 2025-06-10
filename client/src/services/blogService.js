import axiosInstance from '../config/axios';

const API_URL = '/blogs';

export const createBlog = (data) => axiosInstance.post(API_URL, data);
export const getAllBlogs = () => axiosInstance.get(API_URL);
export const getBlogById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updateBlog = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deleteBlog = (id) => axiosInstance.delete(`${API_URL}/${id}`);
