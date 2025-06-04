import axios from 'axios';

const API_URL = '/messages';

export const sendMessage = (data) => axios.post(`${API_URL}/send`, data);
export const getConversation = (userId) => axios.get(`${API_URL}/conversation/${userId}`);
export const getConversations = () => axios.get(`${API_URL}/conversations`);
export const markAsRead = (senderId) => axios.put(`${API_URL}/read/${senderId}`);
export const deleteMessage = (messageId) => axios.delete(`${API_URL}/${messageId}`);
