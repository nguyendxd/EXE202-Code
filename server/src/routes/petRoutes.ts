import express, { RequestHandler } from "express";
import {
  createPetController,
  getAllPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController,
  searchPetsController
} from "../controller/petController";
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),  
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

/**
 * @swagger
 * tags:
 *   - name: Pets
 *     description: Pet Management
 */

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     tags:
 *       - Pets
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bé Nâu"
 *               species:
 *                 type: string
 *                 enum: ["dog","cat"]
 *                 example: "dog"
 *               breed:
 *                 type: string
 *                 example: "Border Collie"
 *               age:
 *                 type: string
 *                 example: "6 tháng tuổi"
 *               size:
 *                 type: string
 *                 enum: ["small","medium","large"]
 *                 example: "small"
 *               gender:
 *                 type: string
 *                 enum: ["male","female"]
 *                 example: "male"
 *               healthStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Khỏe mạnh", "Đã tiêm chủng"]
 *               color:
 *                 type: string
 *                 example: "Đen vàng"
 *               weight:
 *                 type: string
 *                 example: "3kg"
 *               temperament:
 *                 type: string
 *                 example: "Năng động, thích quấn chủ"
 *               address:
 *                 type: string
 *                 example: "123 Đường A, Quận B"
 *               contactPhone:
 *                 type: string
 *                 example: "0912345678"
 *               story:
 *                 type: string
 *                 example: "Mình được phát hiện..."
 *               shelterId:
 *                 type: string
 *                 example: "60f1d5e8c2a3d4567890abcd"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Pet created successfully
 *       500:
 *         description: Error creating pet
 */
router.post(
  "/",
  authenticateToken as RequestHandler,
  upload.array("images", 5),
  createPetController as RequestHandler
);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     responses:
 *       200:
 *         description: List of all pets
 *       500:
 *         description: Server error
 */
router.get("/", getAllPetsController);

/**
 * @swagger
 * /pets/search:
 *   get:
 *     summary: Search pets with filters
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Pet breed
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *         description: Pet gender
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Pet color
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *         description: Pet location
 *       - in: query
 *         name: age
 *         schema:
 *           type: string
 *         description: Pet age (e.g., '6 tháng tuổi', '2 năm')
 *     responses:
 *       200:
 *         description: List of pets matching the search criteria
 *       500:
 *         description: Server error
 */
router.get('/search', searchPetsController);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet details
 *       404:
 *         description: Pet not found
 */
router.get("/:id", authenticateToken as RequestHandler, getPetByIdController as RequestHandler);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags:
 *       - Pets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bé Nâu"
 *               species:
 *                 type: string
 *                 enum: ["dog","cat"]
 *                 example: "dog"
 *               breed:
 *                 type: string
 *                 example: "Border Collie"
 *               age:
 *                 type: string
 *                 example: "6 tháng tuổi"
 *               size:
 *                 type: string
 *                 enum: ["small","medium","large"]
 *                 example: "small"
 *               gender:
 *                 type: string
 *                 enum: ["male","female"]
 *                 example: "male"
 *               healthStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Khỏe mạnh", "Đã tiêm chủng"]
 *               color:
 *                 type: string
 *                 example: "Đen vàng"
 *               weight:
 *                 type: string
 *                 example: "3kg"
 *               temperament:
 *                 type: string
 *                 example: "Năng động, thích quấn chủ"
 *               address:
 *                 type: string
 *                 example: "123 Đường A, Quận B"
 *               contactPhone:
 *                 type: string
 *                 example: "0912345678"
 *               story:
 *                 type: string
 *                 example: "Mình được phát hiện..."
 *               shelterId:
 *                 type: string
 *                 example: "60f1d5e8c2a3d4567890abcd"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               isAdopted:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Error updating pet
 */
router.put("/:id", authenticateToken as RequestHandler, upload.array("images", 5), updatePetController as RequestHandler);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Mark a pet as adopted
 *     tags:
 *       - Pets
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Pet ID
 *     responses:
 *       200:
 *         description: Pet marked as adopted
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Error deleting pet
 */
router.delete("/:id", authenticateToken as RequestHandler, deletePetController as RequestHandler);

export default router;
