import axios from 'axios';

const API_URL = '/rescue-stations';

export const createRescueStation = (data) => axios.post(API_URL, data);
export const getAllRescueStations = () => axios.get(API_URL);
export const searchRescueStations = (params) => axios.get(`${API_URL}/search`, { params });
export const getRescueStationById = (id) => axios.get(`${API_URL}/${id}`);
export const updateRescueStation = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteRescueStation = (id) => axios.delete(`${API_URL}/${id}`);
