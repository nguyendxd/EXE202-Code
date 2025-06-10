"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const postController_1 = require("../controller/postController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // bắt buộc phải dùng memoryStorage để có buffer
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - authorType
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of image URLs
 *         author:
 *           type: string
 *           description: The ID of the post author
 *         authorType:
 *           type: string
 *           enum: [shelter, admin]
 *           description: The type of the author
 *         status:
 *           type: string
 *           enum: [draft, published, archived]
 *           default: draft
 *           description: The status of the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the post
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the post
 */
/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       201:
 *         description: The created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Only shelters and admins can create posts
 */
router.post('/', auth_1.authenticateToken, upload.array('images', 5), postController_1.createPost);
/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter posts by status
 *       - in: query
 *         name: authorType
 *         schema:
 *           type: string
 *           enum: [shelter, admin]
 *         description: Filter posts by author type
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter posts by author ID
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/', auth_1.authenticateToken, postController_1.getPosts);
/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
router.get('/:id', auth_1.authenticateToken, postController_1.getPost);
/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               status:
 *                 type: string
 *                 enum: [draft, published, archived]
 *     responses:
 *       200:
 *         description: The updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this post
 *       404:
 *         description: Post not found
 */
router.put('/:id', auth_1.authenticateToken, upload.array('images', 5), postController_1.updatePost);
/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this post
 *       404:
 *         description: Post not found
 */
router.delete('/:id', auth_1.authenticateToken, postController_1.deletePost);
exports.default = router;
