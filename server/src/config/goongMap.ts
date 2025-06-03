import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GOONG_API_KEY = process.env.GOONG_API_KEY;
const GOONG_BASE_URL = 'https://rsapi.goong.io';

if (!GOONG_API_KEY) {
    throw new Error('GOONG_API_KEY is not defined in environment variables');
}

// Tạo instance axios với cấu hình cơ bản
const goongApi = axios.create({
    baseURL: GOONG_BASE_URL,
    params: {
        api_key: GOONG_API_KEY
    }
});

// Các hàm tiện ích để gọi API
export const goongMapService = {
    // Tìm kiếm địa điểm
    searchPlace: async (query: string) => {
        try {
            const response = await goongApi.get('/Place/AutoComplete', {
                params: { input: query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching place:', error);
            throw error;
        }
    },

    // Lấy chi tiết địa điểm
    getPlaceDetail: async (placeId: string) => {
        try {
            const response = await goongApi.get('/Place/Detail', {
                params: { place_id: placeId }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting place detail:', error);
            throw error;
        }
    },

    // Tính khoảng cách và thời gian di chuyển
    getDistanceMatrix: async (origins: string, destinations: string) => {
        try {
            const response = await goongApi.get('/DistanceMatrix', {
                params: { origins, destinations }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting distance matrix:', error);
            throw error;
        }
    },

    // Geocoding - chuyển đổi địa chỉ thành tọa độ
    geocode: async (address: string) => {
        try {
            const response = await goongApi.get('/Geocode', {
                params: { address }
            });
            return response.data;
        } catch (error) {
            console.error('Error geocoding address:', error);
            throw error;
        }
    },

    // Reverse Geocoding - chuyển đổi tọa độ thành địa chỉ
    reverseGeocode: async (lat: number, lng: number) => {
        try {
            const response = await goongApi.get('/Geocode', {
                params: { latlng: `${lat},${lng}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error reverse geocoding coordinates:', error);
            throw error;
        }
    }
};

export default goongMapService; 