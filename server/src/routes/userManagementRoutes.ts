import express, { RequestHandler, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
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
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         role:
 *           type: string
 *           enum: [user, admin, shelter]
 *           description: User's role in the system
 *         status:
 *           type: string
 *           enum: [active, inactive, suspended]
 *           default: active
 *           description: User's account status
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Last login timestamp
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update date
 */

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
 *     summary: Get all users
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin, shelter]
 *         description: Filter users by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended]
 *         description: Filter users by status
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins can access this endpoint
 */
router.get('/', authenticateToken as RequestHandler, getAllUsers as RequestHandler);

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
router.post('/', authenticateToken as RequestHandler, addUser as RequestHandler);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to view this user
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateToken as RequestHandler, getUserByIdController as RequestHandler);

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
router.put('/:id', authenticateToken as RequestHandler, updateUserController as RequestHandler);

/**
 * @swagger
 * /users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins can update user status
 *       404:
 *         description: User not found
 */
router.patch('/:id/status', authenticateToken as RequestHandler, (req: Request, res: Response) => {
    // TODO: Implement updateUserStatus controller
});

/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin, shelter]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins can update user roles
 *       404:
 *         description: User not found
 */
router.patch('/:id/role', authenticateToken as RequestHandler, (req: Request, res: Response) => {
    // TODO: Implement updateUserRole controller
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only admins can delete users
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateToken as RequestHandler, deleteUserController as RequestHandler);

export default router;
