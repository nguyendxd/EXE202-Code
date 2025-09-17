import axiosInstance from '../config/axios';

const API_URL = '/rescue-stations';

export const createRescueStation = (data) => axiosInstance.post(API_URL, data);
export const getAllRescueStations = () => axiosInstance.get(API_URL);
export const searchRescueStations = (params) => axiosInstance.get(`${API_URL}/search`, { params });
export const getRescueStationById = (id) => axiosInstance.get(`${API_URL}/${id}`);
export const updateRescueStation = (id, data) => axiosInstance.put(`${API_URL}/${id}`, data);
export const deleteRescueStation = (id) => axiosInstance.delete(`${API_URL}/${id}`);
