"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeAddress = exports.getPlaceDetail = exports.searchPlace = exports.searchNearbyStations = void 0;
const mapboxConfig_1 = require("../config/mapboxConfig");
const RescueStation_1 = __importDefault(require("../model/RescueStation"));
const searchNearbyStations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userLongitude = parseFloat(longitude);
        const userLatitude = parseFloat(latitude);
        // 1. Tìm kiếm trạm cứu hộ từ database
        console.log('Searching database for rescue stations...');
        const stations = yield RescueStation_1.default.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [
                            userLongitude,
                            userLatitude
                        ]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
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
        const mapboxResults = yield Promise.all(searchKeywords.map((keyword) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                console.log(`Searching Mapbox with keyword: ${keyword}`);
                const response = yield mapboxConfig_1.geocodingClient
                    .forwardGeocode({
                    query: keyword,
                    limit: 5,
                    proximity: [userLongitude, userLatitude],
                    types: ['place', 'address', 'poi']
                })
                    .send();
                console.log(`Mapbox search results for ${keyword}: ${((_a = response.body.features) === null || _a === void 0 ? void 0 : _a.length) || 0}`);
                return response.body;
            }
            catch (error) {
                console.error(`Error searching for ${keyword} from Mapbox:`, error);
                return null;
            }
        })));
        console.log('Finished Mapbox searches.');
        // Gộp và lọc kết quả
        const uniqueResults = mapboxResults.reduce((acc, result) => {
            if (!result || !result.features) {
                return acc;
            }
            const newPlaces = result.features.filter((place) => {
                // Kiểm tra xem địa điểm đã tồn tại chưa (lọc trùng lặp)
                const isDuplicate = acc.some((existing) => existing.id === place.id);
                if (isDuplicate)
                    return false;
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
        const stationsWithDetails = (yield Promise.all(stations.map((station) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(`Getting directions for database station: ${station.name}`);
                const response = yield mapboxConfig_1.directionsClient
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
                return Object.assign(Object.assign({}, (station.toObject())), { distance: {
                        value: route.distance || 0, // Ensure value is always number
                        text: `${((route.distance || 0) / 1000).toFixed(1)} km`
                    }, duration: {
                        value: route.duration || 0, // Ensure value is always number
                        text: `${Math.round((route.duration || 0) / 60)} phút`
                    }, source: 'database', location: station.location // Ensure location is included
                 });
            }
            catch (error) {
                console.error('Error getting distance details for database station:', error);
                // Return a partial result with default distance/duration on error
                return Object.assign(Object.assign({}, (station.toObject())), { distance: { value: 0, text: 'N/A' }, duration: { value: 0, text: 'N/A' }, source: 'database', location: station.location });
            }
        })))).filter((station) => station !== null); // Filter out nulls after Promise.all resolves
        console.log(`Processed ${stationsWithDetails.length} database stations.`, stationsWithDetails);
        // 4. Xử lý kết quả từ Mapbox
        console.log('Processing Mapbox results...');
        const mapboxStations = (yield Promise.all(uniqueResults.map((place) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                console.log(`Getting directions for Mapbox place: ${place.text}`);
                // Just need distance and duration
                const response = yield mapboxConfig_1.directionsClient
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
                };
            }
            catch (error) {
                console.error('Error processing Mapbox result:', error);
                return null; // Return null on error to be filtered out
            }
        })))).filter((station) => station !== null); // Filter out nulls and assert type
        console.log(`Processed ${mapboxStations.length} Mapbox stations.`, mapboxStations);
        // 5. Kết hợp và sắp xếp kết quả
        const allStations = [
            ...stationsWithDetails,
            ...mapboxStations // mapboxStations is already filtered and typed
        ].sort((a, b) => { var _a, _b; return (((_a = a.distance) === null || _a === void 0 ? void 0 : _a.value) || 0) - (((_b = b.distance) === null || _b === void 0 ? void 0 : _b.value) || 0); });
        console.log(`Final combined results: ${allStations.length}`, allStations);
        res.json({
            success: true,
            data: allStations
        });
    }
    catch (error) {
        console.error('Error searching nearby stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm trạm cứu hộ gần đó'
        });
    }
});
exports.searchNearbyStations = searchNearbyStations;
const searchPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }
        const response = yield mapboxConfig_1.geocodingClient
            .forwardGeocode({
            query: query,
            limit: 10,
            types: ['place', 'address', 'poi']
        })
            .send();
        res.json({
            success: true,
            data: response.body
        });
    }
    catch (error) {
        console.error('Error searching place:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm địa điểm'
        });
    }
});
exports.searchPlace = searchPlace;
const getPlaceDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const response = yield mapboxConfig_1.geocodingClient
            .reverseGeocode({
            query: placeId
        })
            .send();
        res.json({
            success: true,
            data: response.body
        });
    }
    catch (error) {
        console.error('Error getting place details:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin địa điểm'
        });
    }
});
exports.getPlaceDetail = getPlaceDetail;
const geocodeAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.query;
        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp địa chỉ'
            });
        }
        const response = yield mapboxConfig_1.geocodingClient
            .forwardGeocode({
            query: address,
            limit: 1
        })
            .send();
        res.json({
            success: true,
            data: response.body
        });
    }
    catch (error) {
        console.error('Error geocoding address:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể chuyển đổi địa chỉ thành tọa độ'
        });
    }
});
exports.geocodeAddress = geocodeAddress;
