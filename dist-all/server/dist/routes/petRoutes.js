"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const petController_1 = require("../controller/petController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
 *     tags: [Pets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               species:
 *                 type: string
 *                 enum: [dog, cat]
 *               breed:
 *                 type: string
 *               age:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               healthStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: string
 *               weight:
 *                 type: string
 *               temperament:
 *                 type: string
 *               address:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               story:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               avatar:
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
router.post("/", auth_1.authenticateToken, upload.fields([
    { name: "images", maxCount: 5 },
    { name: "avatar", maxCount: 1 }
]), petController_1.createPetController);
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
router.get("/", petController_1.getAllPetsController);
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
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *       - in: query
 *         name: address
 *         schema:
 *           type: string
 *       - in: query
 *         name: age
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of pets matching the search criteria
 *       500:
 *         description: Server error
 */
router.get('/search', petController_1.searchPetsController);
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
 *     responses:
 *       200:
 *         description: Pet details
 *       404:
 *         description: Pet not found
 */
router.get("/:id", petController_1.getPetByIdController);
/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
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
 *               species:
 *                 type: string
 *                 enum: [dog, cat]
 *               breed:
 *                 type: string
 *               age:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [small, medium, large]
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               healthStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *               color:
 *                 type: string
 *               weight:
 *                 type: string
 *               temperament:
 *                 type: string
 *               address:
 *                 type: string
 *               contactPhone:
 *                 type: string
 *               story:
 *                 type: string
 *               isAdopted:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               avatar:
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
router.put("/:id", auth_1.authenticateToken, upload.fields([
    { name: "images", maxCount: 5 },
    { name: "avatar", maxCount: 1 }
]), petController_1.updatePetController);
/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Mark a pet as adopted
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pet marked as adopted
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Error deleting pet
 */
router.delete("/:id", auth_1.authenticateToken, petController_1.deletePetController);
/**
 * @swagger
 * /pets/user/{userId}:
 *   get:
 *     summary: Get pets by user ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of pets belonging to the user
 *       500:
 *         description: Server error
 */
router.get("/user/:userId", petController_1.getPetsByUserIdController);
exports.default = router;
