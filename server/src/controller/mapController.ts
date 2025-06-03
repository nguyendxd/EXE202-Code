import { Request, Response } from 'express';
import goongMapService from '../config/goongMap';
import RescueStation from '../model/RescueStation';

// Định nghĩa interface cho kết quả từ Goong Map
interface GoongPlace {
    place_id: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    };
}

// Tìm trạm cứu hộ gần nhất
export const searchNearbyStations = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius = 20 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tọa độ vị trí'
            });
        }

        // 1. Tìm kiếm trạm cứu hộ trong database
        const stations = await RescueStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [
                            parseFloat(longitude as string),
                            parseFloat(latitude as string)
                        ]
                    },
                    $maxDistance: parseFloat(radius as string) * 1000 // Convert km to meters
                }
            }
        });

      
        // 2. Tìm kiếm thêm từ Goong Map
        const searchKeywords = [
            'trạm cứu hộ động vật',
            'trung tâm cứu hộ động vật',
            'bệnh viện thú y',
            'phòng khám thú y',
            'cứu hộ chó mèo'
        ];

        const goongResults = await Promise.all(
            searchKeywords.map(keyword => goongMapService.searchPlace(keyword))
        );

        // Gộp kết quả và loại bỏ trùng lặp
        const uniqueResults = goongResults.reduce((acc: GoongPlace[], result) => {
            const newPlaces = (result.results || []).filter((place: GoongPlace) => 
                !acc.some((existing: GoongPlace) => existing.place_id === place.place_id)
            );
            return [...acc, ...newPlaces];
        }, []);
        
        // 3. Kết hợp và xử lý kết quả
        const stationsWithDetails = await Promise.all(
            stations.map(async (station) => {
                try {
                    // Lấy thông tin khoảng cách và thời gian di chuyển
                    const distanceMatrix = await goongMapService.getDistanceMatrix(
                        `${latitude},${longitude}`,
                        `${station.location.coordinates[1]},${station.location.coordinates[0]}`
                    );

                    const distance = distanceMatrix.rows[0].elements[0].distance;
                    const duration = distanceMatrix.rows[0].elements[0].duration;

                    return {
                        ...station.toObject(),
                        distance: {
                            value: distance.value,
                            text: distance.text
                        },
                        duration: {
                            value: duration.value,
                            text: duration.text
                        },
                        source: 'database'
                    };
                } catch (error) {
                    console.error('Error getting distance details:', error);
                    return {
                        ...station.toObject(),
                        source: 'database'
                    };
                }
            })
        );

        // 4. Xử lý kết quả từ Goong Map
        const goongStations = await Promise.all(
            uniqueResults.map(async (place: any) => {
                try {
                    const distanceMatrix = await goongMapService.getDistanceMatrix(
                        `${latitude},${longitude}`,
                        `${place.geometry.location.lat},${place.geometry.location.lng}`
                    );

                    const distance = distanceMatrix.rows[0].elements[0].distance;
                    const duration = distanceMatrix.rows[0].elements[0].duration;

                    // Chỉ thêm nếu trong bán kính 20km
                    if (distance.value <= 20000) {
                        return {
                            name: place.name,
                            address: place.formatted_address,
                            location: {
                                type: 'Point',
                                coordinates: [
                                    place.geometry.location.lng,
                                    place.geometry.location.lat
                                ]
                            },
                            distance: {
                                value: distance.value,
                                text: distance.text
                            },
                            duration: {
                                value: duration.value,
                                text: duration.text
                            },
                            source: 'goong',
                            placeId: place.place_id
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Error processing Goong result:', error);
                    return null;
                }
            })
        );

        // 5. Kết hợp và sắp xếp kết quả
        const allStations = [
            ...stationsWithDetails,
            ...goongStations.filter(station => station !== null)
        ].sort((a, b) => a.distance.value - b.distance.value);

        res.json({
            success: true,
            data: allStations
        });
    } catch (error) {
        console.error('Error searching nearby stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm trạm cứu hộ gần đó'
        });
    }
};

export const searchPlace = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        const results = await goongMapService.searchPlace(query as string);
        res.json({
            success: true,
            data: results
        });
    } catch (error) {
        console.error('Error searching place:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm địa điểm'
        });
    }
};

export const getPlaceDetail = async (req: Request, res: Response) => {
    try {
        const { placeId } = req.params;

        if (!placeId) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ID địa điểm'
            });
        }

        const details = await goongMapService.getPlaceDetail(placeId);
        res.json({
            success: true,
            data: details
        });
    } catch (error) {
        console.error('Error getting place details:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin địa điểm'
        });
    }
};

export const geocodeAddress = async (req: Request, res: Response) => {
    try {
        const { address } = req.query;

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp địa chỉ'
            });
        }

        const result = await goongMapService.geocode(address as string);
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error geocoding address:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể chuyển đổi địa chỉ thành tọa độ'
        });
    }
}; 