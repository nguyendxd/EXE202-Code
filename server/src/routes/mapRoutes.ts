import express, { RequestHandler } from 'express';
import {
    searchNearbyStations,
    searchPlace,
    getPlaceDetail,
    geocodeAddress
} from '../controller/mapController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Map
 *   description: Map and location related endpoints
 */

/**
 * @swagger
 * /map/nearby-stations:
 *   get:
 *     summary: Find nearby rescue stations
 *     tags: [Map]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's latitude
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: User's longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 20
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby rescue stations with distance and duration
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/nearby-stations', authenticateToken as RequestHandler, searchNearbyStations as RequestHandler);

/**
 * @swagger
 * /map/search:
 *   get:
 *     summary: Search for places
 *     tags: [Map]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching places
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Server error
 */
router.get('/search', authenticateToken as RequestHandler, searchPlace as RequestHandler);

/**
 * @swagger
 * /map/place/{placeId}:
 *   get:
 *     summary: Get place details
 *     tags: [Map]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: placeId
 *         required: true
 *         schema:
 *           type: string
 *         description: Place ID from search results
 *     responses:
 *       200:
 *         description: Place details
 *       400:
 *         description: Missing place ID
 *       500:
 *         description: Server error
 */
router.get('/place/:placeId', authenticateToken as RequestHandler, getPlaceDetail as RequestHandler);

/**
 * @swagger
 * /map/geocode:
 *   get:
 *     summary: Convert address to coordinates
 *     tags: [Map]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address to geocode
 *     responses:
 *       200:
 *         description: Geocoding results
 *       400:
 *         description: Missing address
 *       500:
 *         description: Server error
 */
router.get('/geocode', authenticateToken as RequestHandler, geocodeAddress as RequestHandler);

export default router; 