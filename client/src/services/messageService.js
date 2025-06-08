import axiosInstance from '../config/axios';

const API_URL = '/messages';

export const sendMessage = (data) => axiosInstance.post(`${API_URL}/send`, data);
export const getConversation = (userId) => axiosInstance.get(`${API_URL}/conversation/${userId}`);
export const getConversations = () => axiosInstance.get(`${API_URL}/conversations`);
export const markAsRead = (senderId) => axiosInstance.put(`${API_URL}/read/${senderId}`);
export const deleteMessage = (messageId) => axiosInstance.delete(`${API_URL}/${messageId}`);
