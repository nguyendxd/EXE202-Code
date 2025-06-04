import axios from 'axios';

const API_URL = '/blogs';

export const createBlog = (data) => axios.post(API_URL, data);
export const getAllBlogs = () => axios.get(API_URL);
export const getBlogById = (id) => axios.get(`${API_URL}/${id}`);
export const updateBlog = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteBlog = (id) => axios.delete(`${API_URL}/${id}`);
