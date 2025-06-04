import axios from 'axios';

const API_URL = '/map';

export const getNearbyStations = () => axios.get(`${API_URL}/nearby-stations`);
export const searchPlaces = (params) => axios.get(`${API_URL}/search`, { params });
export const getPlaceDetails = (placeId) => axios.get(`${API_URL}/place/${placeId}`);
export const geocode = (params) => axios.get(`${API_URL}/geocode`, { params });
