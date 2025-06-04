import axiosInstance from '../config/axios';

const API_URL = '/pets';
// src/services/petService.js
// src/services/petService.js
export const getAllPets = () => axiosInstance.get(API_URL);
export const createPet = (data) => axiosInstance.post(API_URL, data);
export const getPetById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updatePet = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deletePet = (id) => axiosInstance.delete(`${API_URL}/${id}`);
