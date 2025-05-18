import express from "express";
import {
  createPetController,
  getAllPetsController,
  getPetByIdController,
  updatePetController,
  deletePetController,
} from "../controller/petController";

const router = express.Router();

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
router.post("/", createPetController);

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all available pets
 *     tags:
 *       - Pets
 *     responses:
 *       200:
 *         description: List of pets
 *       500:
 *         description: Error fetching pets
 */
router.get("/", getAllPetsController);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get pet by ID
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
 *         description: Pet object
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Error fetching pet
 */
router.get("/:id", getPetByIdController);

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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Error updating pet
 */
router.put("/:id", updatePetController);

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
router.delete("/:id", deletePetController);

export default router;
