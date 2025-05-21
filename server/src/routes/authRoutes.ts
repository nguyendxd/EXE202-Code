import express, { RequestHandler } from "express";
import { register, login, resetPassword } from "../controller/authController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - username
 *               - phone
 *               - address
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 description: Password is required and must be at least 6 characters long
 *                 example: "password123"
 *               username:
 *                 type: string
 *                 example: "JohnDoe"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               socialLink:
 *                 type: string
 *                 example: "https://facebook.com/johndoe"
 *               role:
 *                 type: string
 *                 enum: ["guest", "customer", "shelter", "admin"]
 *                 default: "customer"
 *                 example: "customer"
 *               description:
 *                 type: string
 *                 example: "This is my bio"
 *               avatar:
 *                 type: string
 *                 description: User's avatar URL. If not provided, a default avatar will be used.
 *                 example: "https://example.com/avatar.jpg"
 *     responses:
 *       201:
 *         description: User registered successfully. Please check your email to verify your account.
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User validation failed: password: Path `password` is required."
 *       500:
 *         description: Error registering user. Possible causes include invalid data format or server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Function setDoc() called with invalid data. Unsupported field value: undefined (found in field avatar in document users/...)"
 */
router.post("/register", register as RequestHandler);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully"
 *                 uid:
 *                   type: string
 *                   example: "firebase-user-uid"
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", login as RequestHandler);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Send password reset email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       500:
 *         description: Error sending password reset email
 */
router.post("/reset-password", resetPassword as RequestHandler);

export default router;
