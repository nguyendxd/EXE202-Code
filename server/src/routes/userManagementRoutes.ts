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
 * tags:
 *   name: Users
 *   description: API cho quản lý người dùng
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy tất cả người dùng
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
 *   get:
 *     summary: Lấy người dùng qua ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firebaseUID:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 address:
 *                   type: string
 *                 socialLink:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: ["guest", "customer", "shelter", "admin"]
 *                 description:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 isVerified:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getUserByIdController);

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
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               socialLink:
 *                 type: string
 *               description:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: ["guest", "customer", "shelter", "admin"]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", deleteUserController);

export default router;
