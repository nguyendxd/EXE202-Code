import express, { RequestHandler } from 'express';
import { 
    addToWishlist,
    removeFromWishlist,
    getMyWishlist
} from '../controller/petWishlistController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

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
router.get('/', authenticateToken as RequestHandler, getMyWishlist as RequestHandler);

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
router.post('/:petId', authenticateToken as RequestHandler, addToWishlist as RequestHandler);

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
router.delete('/:petId', authenticateToken as RequestHandler, removeFromWishlist as RequestHandler);

export default router; 