import { Request, Response } from 'express';
import RescueStation, { IRescueStation } from '../model/RescueStation';
import goongMapService from '../config/goongMap';

// Tạo trạm cứu hộ mới
export const createRescueStation = async (req: Request, res: Response) => {
    try {
        const {
            name,
            address,
            phone,
            email,
            description,
            services,
            operatingHours
        } = req.body;

        // Sử dụng Goong API để lấy tọa độ từ địa chỉ
        const geocodeResult = await goongMapService.geocode(address);
        
        if (!geocodeResult.results || geocodeResult.results.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xác định vị trí từ địa chỉ này'
            });
        }

        const location = geocodeResult.results[0].geometry.location;

        const newStation = new RescueStation({
            name,
            address,
            phone,
            email,
            description,
            location: {
                type: 'Point',
                coordinates: [location.lng, location.lat]
            },
            services,
            operatingHours
        });

        await newStation.save();

        res.status(201).json({
            success: true,
            data: newStation
        });
    } catch (error) {
        console.error('Error creating rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tạo trạm cứu hộ'
        });
    }
};

// Lấy danh sách tất cả trạm cứu hộ
export const getAllRescueStations = async (req: Request, res: Response) => {
    try {
        const stations = await RescueStation.find();
        res.json({
            success: true,
            data: stations
        });
    } catch (error) {
        console.error('Error getting rescue stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy danh sách trạm cứu hộ'
        });
    }
};

// Lấy thông tin chi tiết một trạm cứu hộ
export const getRescueStationById = async (req: Request, res: Response) => {
    try {
        const station = await RescueStation.findById(req.params.id);
        
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
    } catch (error) {
        console.error('Error getting rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể lấy thông tin trạm cứu hộ'
        });
    }
};

// Cập nhật thông tin trạm cứu hộ
export const updateRescueStation = async (req: Request, res: Response) => {
    try {
        const {
            name,
            address,
            phone,
            email,
            description,
            services,
            operatingHours
        } = req.body;

        let updateData: any = {
            name,
            phone,
            email,
            description,
            services,
            operatingHours
        };

        // Nếu địa chỉ thay đổi, cập nhật tọa độ
        if (address) {
            const geocodeResult = await goongMapService.geocode(address);
            
            if (!geocodeResult.results || geocodeResult.results.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Không thể xác định vị trí từ địa chỉ mới'
                });
            }

            const location = geocodeResult.results[0].geometry.location;
            updateData.address = address;
            updateData.location = {
                type: 'Point',
                coordinates: [location.lng, location.lat]
            };
        }

        const updatedStation = await RescueStation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

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
    } catch (error) {
        console.error('Error updating rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể cập nhật thông tin trạm cứu hộ'
        });
    }
};

// Xóa trạm cứu hộ
export const deleteRescueStation = async (req: Request, res: Response) => {
    try {
        const deletedStation = await RescueStation.findByIdAndDelete(req.params.id);

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
    } catch (error) {
        console.error('Error deleting rescue station:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể xóa trạm cứu hộ'
        });
    }
};

// Tìm kiếm trạm cứu hộ theo tên hoặc địa chỉ
export const searchRescueStations = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập từ khóa tìm kiếm'
            });
        }

        const stations = await RescueStation.find({
            $text: { $search: query as string }
        });

        res.json({
            success: true,
            data: stations
        });
    } catch (error) {
        console.error('Error searching rescue stations:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể tìm kiếm trạm cứu hộ'
        });
    }
}; 