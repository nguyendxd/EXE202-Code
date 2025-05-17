import express from "express";
import { 
    getAllUsers, 
    addUser, 
    getUserByEmailController, 
    getUserByIdController, 
    updateUserController, 
    deleteUserController 
} from "../controller/userManagementController";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy tất cả người dùng (Admin)
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   firebaseUID:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   address:
 *                     type: string
 *                   socialLink:
 *                     type: string
 *                   role:
 *                     type: string
 *                     enum: ["guest", "customer", "shelter", "admin"]
 *                   description:
 *                     type: string
 *                   isAdmin:
 *                     type: boolean
 *                   isVerified:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy người dùng theo ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi khi lấy người dùng
 */
router.get("/:id", getUserByIdController);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firebaseUID:
 *                 type: string
 *                 example: "abc123xyz"
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               socialLink:
 *                 type: string
 *                 example: "https://facebook.com/johndoe"
 *               description:
 *                 type: string
 *                 example: "This is my bio"
 *               role:
 *                 type: string
 *                 enum: ["guest", "customer", "shelter", "admin"]
 *                 example: "customer"
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", addUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật người dùng qua ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "JohnDoeUpdated"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: "456 New St"
 *               socialLink:
 *                 type: string
 *                 example: "https://instagram.com/johndoe"
 *               description:
 *                 type: string
 *                 example: "Updated bio"
 *               role:
 *                 type: string
 *                 enum: ["guest", "customer", "shelter", "admin"]
 *                 example: "customer"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi khi cập nhật người dùng
 */
router.put("/:id", updateUserController);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng qua ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người dùng
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi khi xóa người dùng
 */
router.delete("/:id", deleteUserController);

export default router;
