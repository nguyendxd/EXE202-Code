"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const petWishlistController_1 = require("../controller/petWishlistController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: Pet Wishlist
 *   description: Pet wishlist management endpoints
 */
/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get current user's wishlist
 *     tags: [Pet Wishlist]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of pets in user's wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   pet:
 *                     $ref: '#/components/schemas/Pet'
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth_1.authenticateToken, petWishlistController_1.getMyWishlist);
/**
 * @swagger
 * /wishlist/{petId}:
 *   post:
 *     summary: Add a pet to wishlist
 *     tags: [Pet Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pet to add to wishlist
 *     responses:
 *       201:
 *         description: Pet added to wishlist successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found
 *       409:
 *         description: Pet already in wishlist
 */
router.post('/:petId', auth_1.authenticateToken, petWishlistController_1.addToWishlist);
/**
 * @swagger
 * /wishlist/{petId}:
 *   delete:
 *     summary: Remove a pet from wishlist
 *     tags: [Pet Wishlist]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: petId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the pet to remove from wishlist
 *     responses:
 *       200:
 *         description: Pet removed from wishlist successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Pet not found in wishlist
 */
router.delete('/:petId', auth_1.authenticateToken, petWishlistController_1.removeFromWishlist);
exports.default = router;
