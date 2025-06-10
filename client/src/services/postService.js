import axios from 'axios';
import axiosInstance from '../config/axios';

const API_URL = '/posts';

export const createPost = (data) => axiosInstance.post(API_URL, data);
export const getAllPosts = () => axiosInstance.get(API_URL);
export const getPostById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updatePost = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deletePost = (id) => axiosInstance.delete(`${API_URL}/${id}`);
