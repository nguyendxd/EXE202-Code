"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mapController_1 = require("../controller/mapController");
const router = express_1.default.Router();
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
 *           default: 30
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearby rescue stations with distance and duration
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
router.get('/nearby-stations', mapController_1.searchNearbyStations);
/**
 * @swagger
 * /map/search:
 *   get:
 *     summary: Search for places
 *     tags: [Map]
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
router.get('/search', mapController_1.searchPlace);
/**
 * @swagger
 * /map/place/{placeId}:
 *   get:
 *     summary: Get place details
 *     tags: [Map]
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
router.get('/place/:placeId', mapController_1.getPlaceDetail);
/**
 * @swagger
 * /map/geocode:
 *   get:
 *     summary: Get coordinates for a given address (Geocoding)
 *     tags: [Map]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: Address to geocode
 *     responses:
 *       200:
 *         description: Coordinates for the address
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error or geocoding failed
 */
router.get('/geocode', mapController_1.geocodeAddress);
exports.default = router;
