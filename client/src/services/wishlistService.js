import axiosInstance from '../config/axios';

const API_URL = '/wishlist';

export const getWishlist = () => axiosInstance.get(API_URL);
export const addToWishlist = (petId) => axiosInstance.post(`${API_URL}/${petId}`);
export const removeFromWishlist = (petId) => axiosInstance.delete(`${API_URL}/${petId}`);
