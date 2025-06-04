import axios from 'axios';

const API_URL = '/pets';
// src/services/petService.js
export const getAllPets = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'; // Fallback to localhost
        const response = await fetch(`${apiUrl}/pets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Failed to fetch pets: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        let petArray = [];
        if (Array.isArray(data)) {
            petArray = data;
        } else if (data && typeof data === 'object') {
            petArray = [data];
        }
        return { data: petArray };
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Fetch timed out');
            throw new Error('Request timed out. Please try again later.');
        } else if (error.message.includes('Failed to fetch')) {
            console.error('Network error:', error.message);
            throw new Error('Unable to connect to the server. Please check your network or server status.');
        }
        console.error('Error fetching pets:', error.message);
        throw error;
    }
};

export const createPet = (data) => axios.post(API_URL, data);
export const getPetById = (id) => axios.get(`${API_URL}/${id}`);
export const updatePet = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePet = (id) => axios.delete(`${API_URL}/${id}`);
