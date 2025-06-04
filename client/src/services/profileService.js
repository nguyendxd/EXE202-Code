import axios from 'axios';

const API_URL = '/profiles';

export const getProfiles = () => axios.get(API_URL);
export const getProfileById = (id) => axios.get(`${API_URL}/${id}`);
export const updateProfile = (id, data) => axios.put(`${API_URL}/${id}`, data);
