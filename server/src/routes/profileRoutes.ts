import express, { RequestHandler, Request, Response, NextFunction } from 'express';
import { 
    getAllProfile,
    getProfile,
    updateProfile,    
} from "../controller/userProfile";
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// Configure multer for file upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only allow 1 file
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Error handling middleware for multer
const handleMulterError: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    if ((req as any).fileValidationError) {
        res.status(400).json({ error: (req as any).fileValidationError });
        return;
    }
    next();
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user
 *         fullName:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         phone:
 *           type: string
 *           description: User's phone number
 *         address:
 *           type: string
 *           description: User's address
 *         avatar:
 *           type: string
 *           description: URL to user's avatar image
 *         bio:
 *           type: string
 *           description: User's biography
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Profile creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last profile update date
 */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken as RequestHandler, getAllProfile as RequestHandler);

/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get a profile by ID
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     responses:
 *       200:
 *         description: The profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/:id', authenticateToken as RequestHandler, getProfile as RequestHandler);

/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update a profile (only one avatar picture allowed)
 *     tags: [Profiles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The profile ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's display name
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               address:
 *                 type: string
 *                 description: User's address
 *               socialLink:
 *                 type: string
 *                 description: User's social media link
 *               description:
 *                 type: string
 *                 description: User's description or bio
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Single avatar image file (JPEG, PNG, or GIF only, max 5MB)
 *     responses:
 *       200:
 *         description: The updated profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid file type or size
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to update this profile
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error or upload failed
 */
router.put('/:id', 
    authenticateToken as RequestHandler, 
    upload.single('avatar'), 
    handleMulterError,
    updateProfile as RequestHandler
);

export default router;




