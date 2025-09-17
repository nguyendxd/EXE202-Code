import { Request, Response } from 'express';
import { geocodingClient, directionsClient } from '../config/mapboxConfig';
import RescueStation, { IRescueStation } from '../model/RescueStation';
import { HydratedDocument } from 'mongoose';

interface MapboxFeature {
    id: string;
    place_name: string;
    text: string;
    center: [number, number];
    geometry: {
        coordinates: [number, number];
    };
}

interface DistanceDuration {
    value: number;
    text: string;
}

interface CombinedStationResult {
    _id?: string; // Optional for Mapbox results
    name: string;
    address: string;
    phone?: string;
    email?: string;
    description?: string;
    location: { // Assuming this structure from Mongoose model and Mapbox features
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    images?: string[];
    operatingHours?: any; // Using any for simplicity, can be refined
    distance: DistanceDuration; // Ensure distance is always present in the final object
    duration: DistanceDuration; // Ensure duration is always present in the final object
    source: 'database' | 'mapbox';
    placeId?: string; // Only for mapbox results
    // Add other properties from RescueStation model if needed in the final output
    // e.g., isAdopted, isDeleted, etc.
}

export const searchNearbyStations = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius = 20 } = req.query;

        console.log(`Received search request: latitude=${latitude}, longitude=${longitude}, radius=${radius}`);

        if (!latitude || !longitude) {
            console.log('Missing latitude or longitude');
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tọa độ vị trí'
            });
        }

        const userLongitude = parseFloat(longitude as string);
        const userLatitude = parseFloat(latitude as string);

        // 1. Tìm kiếm trạm cứu hộ từ database
        console.log('Searching database for rescue stations...');
        const stations = await RescueStation.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [
                            userLongitude,
                            userLatitude
                        ]
                    },
                    $maxDistance: parseFloat(radius as string) * 1000 // Convert km to meters
                }
            }
        }).limit(10);

        console.log(`Found ${stations.length} stations in database.`, stations);

        // 2. Tìm kiếm từ Mapbox
        const searchKeywords = [
            'phòng khám thú y',
            'bệnh viện thú y',
            'trạm cứu hộ động vật',
            'thú y',
            'trạm cứu hộ chó mèo'
        ];

        console.log('Searching Mapbox for veterinary places...');
        const mapboxResults = await Promise.all(
            searchKeywords.map(async (keyword) => {
                try {
                    console.log(`Searching Mapbox with keyword: ${keyword}`);
                    const response = await geocodingClient
                        .forwardGeocode({
                            query: keyword,
                            limit: 5,
                            proximity: [userLongitude, userLatitude],
                            types: ['place', 'address', 'poi']
                        })
                        .send();
                    console.log(`Mapbox search results for ${keyword}: ${response.body.features?.length || 0}`);
                    return response.body;
                } catch (error) {
                    console.error(`Error searching for ${keyword} from Mapbox:`, error);
                    return null;
                }
            })
        );
        console.log('Finished Mapbox searches.');

        // Gộp và lọc kết quả
        const uniqueResults = mapboxResults.reduce((acc: MapboxFeature[], result: any) => {
            if (!result || !result.features) {
                return acc;
            }
            const newPlaces = result.features.filter((place: MapboxFeature) => {
                // Kiểm tra xem địa điểm đã tồn tại chưa (lọc trùng lặp)
                const isDuplicate = acc.some((existing) => existing.id === place.id);
                if (isDuplicate) return false;

                // Thêm bộ lọc kiểm tra từ khóa "thú y" (không phân biệt chữ hoa chữ thường)
                const nameOrText = `${place.text} ${place.place_name || ''}`.toLowerCase();
                const containsThuY = nameOrText.includes('thú y');
                
                return containsThuY; // Chỉ giữ lại nếu chứa từ "thú y"
            });
             console.log(`Filtered ${newPlaces.length} new places for keyword`);
            return [...acc, ...newPlaces];
        }, []).slice(0, 10);

        console.log(`Found ${uniqueResults.length} unique veterinary places from Mapbox after filtering.`, uniqueResults);

        // 3. Xử lý kết quả từ database
        console.log('Processing database results...');
        const stationsWithDetails: CombinedStationResult[] = (await Promise.all(
            stations.map(async (station: HydratedDocument<IRescueStation>) => {
                try {
                    console.log(`Getting directions for database station: ${station.name}`);
                    const response = await directionsClient
                        .getDirections({
                            profile: 'driving',
                            waypoints: [
                                { coordinates: [userLongitude, userLatitude] },
                                { coordinates: [station.location.coordinates[0], station.location.coordinates[1]] }
                            ]
                        })
                        .send();

                    if (!response.body.routes || response.body.routes.length === 0) {
                        console.warn(`No route found for database station: ${station.name}`);
                        return null; // Return null if no route found
                    }

                    const route = response.body.routes[0];
                    console.log(`Route found for ${station.name}. Distance: ${route.distance}, Duration: ${route.duration}`);
                    
                    // Construct the CombinedStationResult object
                    return {
                        ...(station.toObject()), // Spread properties from Mongoose document
                        distance: {
                            value: route.distance || 0, // Ensure value is always number
                            text: `${((route.distance || 0) / 1000).toFixed(1)} km`
                        },
                        duration: {
                            value: route.duration || 0, // Ensure value is always number
                            text: `${Math.round((route.duration || 0) / 60)} phút`
                        },
                        source: 'database',
                        location: station.location // Ensure location is included
                    } as CombinedStationResult;
                } catch (error) {
                    console.error('Error getting distance details for database station:', error);
                    // Return a partial result with default distance/duration on error
                    return {
                         ...(station.toObject()),
                        distance: { value: 0, text: 'N/A' },
                        duration: { value: 0, text: 'N/A' },
                        source: 'database',
                         location: station.location
                    } as CombinedStationResult;
                }
            })
        )).filter((station): station is CombinedStationResult => station !== null); // Filter out nulls after Promise.all resolves

        console.log(`Processed ${stationsWithDetails.length} database stations.`, stationsWithDetails);

        // 4. Xử lý kết quả từ Mapbox
        console.log('Processing Mapbox results...');
        const mapboxStations: CombinedStationResult[] = (
            await Promise.all(
                uniqueResults.map(async (place: MapboxFeature) => {
                    try {
                        console.log(`Getting directions for Mapbox place: ${place.text}`);
                         // Just need distance and duration
                        const response = await directionsClient
                            .getDirections({
                                profile: 'driving',
                                waypoints: [
                                    { coordinates: [userLongitude, userLatitude] },
                                    { coordinates: place.center }
                                ]
                            })
                            .send();

                        if (!response.body.routes || response.body.routes.length === 0) {
                             console.warn(`No route found for Mapbox place: ${place.text}`);
                             return null; // Return null if no route found
                         }

                        const route = response.body.routes[0];
                        console.log(`Route found for ${place.text}. Distance: ${route.distance}, Duration: ${route.duration}`);

                         // Construct the CombinedStationResult object
                            return {
                                name: place.text,
                                address: place.place_name,
                                location: {
                                    type: 'Point',
                                    coordinates: place.center
                                },
                                distance: {
                                    value: route.distance || 0, // Ensure value is always number
                                    text: `${((route.distance || 0) / 1000).toFixed(1)} km`
                                },
                                duration: {
                                    value: route.duration || 0, // Ensure value is always number
                                    text: `${Math.round((route.duration || 0) / 60)} phút`
                                },
                                source: 'mapbox',
                                placeId: place.id
                            } as CombinedStationResult;

                    } catch (error) {
                        console.error('Error processing Mapbox result:', error);
                        return null; // Return null on error to be filtered out
                    }
                })
            )
        ).filter((station): station is CombinedStationResult => station !== null); // Filter out nulls and assert type

         console.log(`Processed ${mapboxStations.length} Mapbox stations.`, mapboxStations);

        // 5. Kết hợp và sắp xếp kết quả
        const allStations: CombinedStationResult[] = [
            ...stationsWithDetails,
            ...mapboxStations // mapboxStations is already filtered and typed
        ].sort((a, b) => (a.distance?.value || 0) - (b.distance?.value || 0));

        console.log(`Final combined results: ${allStations.length}`, allStations);

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

        const response = await geocodingClient
            .forwardGeocode({
                query: query as string,
                limit: 10,
                types: ['place', 'address', 'poi']
            })
            .send();

        res.json({
            success: true,
            data: response.body
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

        // Note: Mapbox reverseGeocode is primarily for coordinates. 
        // Using forwardGeocode with placeId or relying on search results might be better.
        // Keeping this for now as it might work depending on Mapbox API behavior.
        const response = await geocodingClient
            .reverseGeocode({
                query: placeId
            })
            .send();

        res.json({
            success: true,
            data: response.body
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

        const response = await geocodingClient
            .forwardGeocode({
                query: address as string,
                limit: 1
            })
            .send();

        res.json({
            success: true,
            data: response.body
        });
    } catch (error) {
        console.error('Error geocoding address:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể chuyển đổi địa chỉ thành tọa độ'
        });
    }
}; 