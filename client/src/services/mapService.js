import axiosInstance from '../config/axios';

const API_URL = '/map';

export const getNearbyStations = () => axiosInstance.get(`${API_URL}/nearby-stations`);
export const searchPlaces = (params) => axiosInstance.get(`${API_URL}/search`, { params });
export const getPlaceDetails = (placeId) => axiosInstance.get(`${API_URL}/place/${placeId}`);
export const geocode = (params) => axiosInstance.get(`${API_URL}/geocode`, { params });
