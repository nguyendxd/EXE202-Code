import express, { RequestHandler } from 'express';
import {
    createRescueStation,
    getAllRescueStations,
    getRescueStationById,
    updateRescueStation,
    deleteRescueStation,
    searchRescueStations
} from '../controller/rescueStationController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rescue Stations
 *   description: Quản lý trạm cứu hộ động vật
 */

/**
 * @swagger
 * /rescue-stations:
 *   post:
 *     summary: Tạo trạm cứu hộ mới
 *     tags: [Rescue Stations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - email
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               operatingHours:
 *                 type: object
 *     responses:
 *       201:
 *         description: Trạm cứu hộ đã được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/', authenticateToken as RequestHandler, isAdmin as RequestHandler, createRescueStation as RequestHandler);

/**
 * @swagger
 * /rescue-stations:
 *   get:
 *     summary: Lấy danh sách tất cả trạm cứu hộ
 *     tags: [Rescue Stations]
 *     responses:
 *       200:
 *         description: Danh sách trạm cứu hộ
 *       500:
 *         description: Lỗi server
 */
router.get('/', getAllRescueStations as RequestHandler);

/**
 * @swagger
 * /rescue-stations/search:
 *   get:
 *     summary: Tìm kiếm trạm cứu hộ
 *     tags: [Rescue Stations]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi server
 */
router.get('/search', searchRescueStations as RequestHandler);

/**
 * @swagger
 * /rescue-stations/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết trạm cứu hộ
 *     tags: [Rescue Stations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin trạm cứu hộ
 *       404:
 *         description: Không tìm thấy trạm cứu hộ
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', getRescueStationById as RequestHandler);

/**
 * @swagger
 * /rescue-stations/{id}:
 *   put:
 *     summary: Cập nhật thông tin trạm cứu hộ
 *     tags: [Rescue Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               description:
 *                 type: string
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *               operatingHours:
 *                 type: object
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy trạm cứu hộ
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', authenticateToken as RequestHandler, isAdmin as RequestHandler, updateRescueStation as RequestHandler);

/**
 * @swagger
 * /rescue-stations/{id}:
 *   delete:
 *     summary: Xóa trạm cứu hộ
 *     tags: [Rescue Stations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy trạm cứu hộ
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', authenticateToken as RequestHandler, isAdmin as RequestHandler, deleteRescueStation as RequestHandler);

export default router; 