import axios from 'axios';
import axiosInstance from '../config/axios';

const API_URL = '/profiles';

export const getProfiles = () => axiosInstance.get(API_URL);
export const getProfileById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updateProfile = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
