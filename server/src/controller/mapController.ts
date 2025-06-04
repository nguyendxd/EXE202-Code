import { Request, Response } from 'express';
import goongMapService from '../config/goongMap';
import RescueStation from '../model/RescueStation';

interface GoongPlace {
    place_id: string;
    description: string;
    name: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        }
    };
}


export const searchNearbyStations = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius = 20 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tọa độ vị trí'
            });
        }

      
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
            'phòng khám thú y',
            'bệnh viện thú y',
            'phòng khám chó mèo',
            'bệnh viện chó mèo',
            'phòng khám thú cưng',
            'bệnh viện thú cưng',
            'phòng khám động vật',
            'bệnh viện động vật'
        ];

        // Tìm kiếm với từng từ khóa và kết hợp kết quả
        const goongResults = await Promise.all(
            searchKeywords.map(async (keyword) => {
                try {
                    const result = await goongMapService.searchPlace(keyword, {
                        location: `${latitude},${longitude}`,
                        radius: parseFloat(radius as string) * 1000 // Convert km to meters
                    });
                    return result;
                } catch (error) {
                    console.error(`Error searching for ${keyword}:`, error);
                    return null;
                }
            })
        );

        // Gộp kết quả và loại bỏ trùng lặp
        const uniqueResults = goongResults.reduce((acc: GoongPlace[], result) => {
            if (!result || !result.predictions) {
                return acc;
            }
            const newPlaces = result.predictions.filter((place: GoongPlace) => {
                // Kiểm tra xem địa điểm đã tồn tại chưa
                const isDuplicate = acc.some((existing: GoongPlace) => existing.place_id === place.place_id);
                if (isDuplicate) return false;

                // Lọc các địa điểm không liên quan đến thú y
                const name = place.description.toLowerCase();
                const isVetRelated = name.includes('thú y') || 
                                   name.includes('chó mèo') || 
                                   name.includes('thú cưng') || 
                                   name.includes('động vật') ||
                                   name.includes('pet') ||
                                   name.includes('vet');
                
                return isVetRelated;
            });
            return [...acc, ...newPlaces];
        }, []);

        console.log(`Found ${uniqueResults.length} unique veterinary places from Goong Map`);
        
        
        const stationsWithDetails = await Promise.all(
            stations.map(async (station) => {
                try {
                    
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
                    // Lấy chi tiết địa điểm để có thông tin đầy đủ
                    const placeDetails = await goongMapService.getPlaceDetail(place.place_id);
                    if (!placeDetails || !placeDetails.result) {
                        console.warn('No details found for place:', place.place_id);
                        return null;
                    }

                    const location = placeDetails.result.geometry.location;
                    const distanceMatrix = await goongMapService.getDistanceMatrix(
                        `${latitude},${longitude}`,
                        `${location.lat},${location.lng}`
                    );

                    const distance = distanceMatrix.rows[0].elements[0].distance;
                    const duration = distanceMatrix.rows[0].elements[0].duration;

                    // Chỉ thêm nếu trong bán kính 20km
                    if (distance.value <= 20000) {
                        return {
                            name: placeDetails.result.name,
                            address: placeDetails.result.formatted_address,
                            location: {
                                type: 'Point',
                                coordinates: [
                                    location.lng,
                                    location.lat
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