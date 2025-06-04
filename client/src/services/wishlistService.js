import axios from 'axios';

const API_URL = '/wishlist';

export const getWishlist = () => axios.get(API_URL);
export const addToWishlist = (petId, data) => axios.post(`${API_URL}/${petId}`, data);
export const removeFromWishlist = (petId) => axios.delete(`${API_URL}/${petId}`);
