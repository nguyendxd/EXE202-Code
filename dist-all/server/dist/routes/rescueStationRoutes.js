"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rescueStationController_1 = require("../controller/rescueStationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
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
router.post('/', auth_1.authenticateToken, auth_1.isAdmin, rescueStationController_1.createRescueStation);
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
router.get('/', rescueStationController_1.getAllRescueStations);
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
router.get('/search', rescueStationController_1.searchRescueStations);
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
router.get('/:id', rescueStationController_1.getRescueStationById);
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
router.put('/:id', auth_1.authenticateToken, auth_1.isAdmin, rescueStationController_1.updateRescueStation);
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
router.delete('/:id', auth_1.authenticateToken, auth_1.isAdmin, rescueStationController_1.deleteRescueStation);
exports.default = router;
