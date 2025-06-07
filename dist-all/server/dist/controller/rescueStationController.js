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
exports.searchRescueStations = exports.deleteRescueStation = exports.updateRescueStation = exports.getRescueStationById = exports.getAllRescueStations = exports.createRescueStation = void 0;
const RescueStation_1 = __importDefault(require("../model/RescueStation"));
const mapboxConfig_1 = require("../config/mapboxConfig"); // Import Mapbox geocoding client
// Tạo trạm cứu hộ mới
const createRescueStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, phone, email, description, services, operatingHours } = req.body;
        // Sử dụng Mapbox API để lấy tọa độ từ địa chỉ
        const geocodeResponse = yield mapboxConfig_1.geocodingClient.forwardGeocode({ query: address }).send();
        if (!geocodeResponse.body.features || geocodeResponse.body.features.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xác định vị trí từ địa chỉ này'
            });
        }
        const location = geocodeResponse.body.features[0].geometry.coordinates; // [longitude, latitude]
        const newStation = new RescueStation_1.default({
            name,
            address,
            phone,
            email,
            description,
            location: {
                type: 'Point',
                coordinates: [location[0], location[1]] // Mapbox returns [lng, lat], Mongoose expects [lng, lat]
            },
            services,
            operatingHours
        });
        yield newStation.save();
        res.status(201).json({
            success: true,
            data: newStation
        });
    }
    catch (error) {
        console.error('Error creating rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tạo trạm cứu hộ'
        });
    }
});
exports.createRescueStation = createRescueStation;
// Lấy danh sách tất cả trạm cứu hộ
const getAllRescueStations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stations = yield RescueStation_1.default.find();
        res.json({
            success: true,
            data: stations
        });
    }
    catch (error) {
        console.error('Error getting rescue stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách trạm cứu hộ'
        });
    }
});
exports.getAllRescueStations = getAllRescueStations;
// Lấy thông tin chi tiết một trạm cứu hộ
const getRescueStationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const station = yield RescueStation_1.default.findById(req.params.id);
        if (!station) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy trạm cứu hộ'
            });
        }
        res.json({
            success: true,
            data: station
        });
    }
    catch (error) {
        console.error('Error getting rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin trạm cứu hộ'
        });
    }
});
exports.getRescueStationById = getRescueStationById;
// Cập nhật thông tin trạm cứu hộ
const updateRescueStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, phone, email, description, services, operatingHours } = req.body;
        let updateData = {
            name,
            phone,
            email,
            description,
            services,
            operatingHours
        };
        // Nếu địa chỉ thay đổi, cập nhật tọa độ bằng Mapbox API
        if (address) {
            const geocodeResponse = yield mapboxConfig_1.geocodingClient.forwardGeocode({ query: address }).send();
            if (!geocodeResponse.body.features || geocodeResponse.body.features.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể xác định vị trí từ địa chỉ mới'
                });
            }
            const location = geocodeResponse.body.features[0].geometry.coordinates; // [longitude, latitude]
            updateData.address = address;
            updateData.location = {
                type: 'Point',
                coordinates: [location[0], location[1]] // Mapbox returns [lng, lat], Mongoose expects [lng, lat]
            };
        }
        const updatedStation = yield RescueStation_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedStation) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy trạm cứu hộ'
            });
        }
        res.json({
            success: true,
            data: updatedStation
        });
    }
    catch (error) {
        console.error('Error updating rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể cập nhật thông tin trạm cứu hộ'
        });
    }
});
exports.updateRescueStation = updateRescueStation;
// Xóa trạm cứu hộ
const deleteRescueStation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedStation = yield RescueStation_1.default.findByIdAndDelete(req.params.id);
        if (!deletedStation) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy trạm cứu hộ'
            });
        }
        res.json({
            success: true,
            message: 'Đã xóa trạm cứu hộ thành công'
        });
    }
    catch (error) {
        console.error('Error deleting rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể xóa trạm cứu hộ'
        });
    }
});
exports.deleteRescueStation = deleteRescueStation;
// Tìm kiếm trạm cứu hộ theo tên hoặc địa chỉ
const searchRescueStations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }
        const stations = yield RescueStation_1.default.find({
            $text: { $search: query }
        });
        res.json({
            success: true,
            data: stations
        });
    }
    catch (error) {
        console.error('Error searching rescue stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm trạm cứu hộ'
        });
    }
});
exports.searchRescueStations = searchRescueStations;
