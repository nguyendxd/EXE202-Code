import express, { Request, Response } from 'express';
import { sendMessage } from '../controller/messageController';
import { authenticateToken } from '../middleware/auth';
import multer from 'multer';
import Message from '../model/Message';
import { Types } from 'mongoose';
import { AuthenticatedRequest } from '../controller/messageController';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - sender
 *         - receiver
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the message
 *         sender:
 *           type: string
 *           description: The id of the sender
 *         receiver:
 *           type: string
 *           description: The id of the receiver
 *         content:
 *           type: string
 *           description: The message content
 *         attachments:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of attachment URLs
 *         read:
 *           type: boolean
 *           description: Whether the message has been read
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the message was created
 */

/**
 * @swagger
 * /messages/send:
 *   post:
 *     summary: Send a new message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the message recipient
 *               content:
 *                 type: string
 *                 description: Message content
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Optional file attachments
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.post('/send', 
    authenticateToken as express.RequestHandler,
    upload.array('files'),
    sendMessage as express.RequestHandler
);

/**
 * @swagger
 * /messages/conversation/{userId}:
 *   get:
 *     summary: Get conversation history with a user
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the other user in the conversation
 *     responses:
 *       200:
 *         description: List of messages in the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */
router.get('/conversation/:userId', 
    authenticateToken as express.RequestHandler,
    (async (req: Request, res: Response): Promise<void> => {
        try {
            const currentUserId = (req as AuthenticatedRequest).user!.id;
            const otherUserId = req.params.userId;

            const messages = await Message.find({
                $or: [
                    { sender: currentUserId, receiver: otherUserId },
                    { sender: otherUserId, receiver: currentUserId }
                ]
            })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sender', 'email')
            .populate('receiver', 'email');

            res.json(messages);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching conversation', error: error.message });
        }
    }) as express.RequestHandler
);

/**
 * @swagger
 * /messages/conversations:
 *   get:
 *     summary: Get all conversations for current user
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations with latest messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the other user in conversation
 *                   lastMessage:
 *                     $ref: '#/components/schemas/Message'
 *                   user:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/conversations', 
    authenticateToken as express.RequestHandler,
    (async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as AuthenticatedRequest).user!.id;

            // Get the latest message from each conversation
            const conversations = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: new Types.ObjectId(userId) },
                            { receiver: new Types.ObjectId(userId) }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$sender', new Types.ObjectId(userId)] },
                                '$receiver',
                                '$sender'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        _id: 1,
                        lastMessage: 1,
                        'user.email': 1
                    }
                }
            ]);

            res.json(conversations);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching conversations', error: error.message });
        }
    }) as express.RequestHandler
);

/**
 * @swagger
 * /messages/read/{senderId}:
 *   put:
 *     summary: Mark messages from a sender as read
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: senderId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the message sender
 *     responses:
 *       200:
 *         description: Messages marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */
router.put('/read/:senderId', 
    authenticateToken as express.RequestHandler,
    (async (req: Request, res: Response): Promise<void> => {
        try {
            const currentUserId = (req as AuthenticatedRequest).user!.id;
            const senderId = req.params.senderId;

            await Message.updateMany(
                {
                    sender: senderId,
                    receiver: currentUserId,
                    read: false
                },
                {
                    $set: { read: true }
                }
            );

            res.json({ message: 'Messages marked as read' });
        } catch (error: any) {
            res.status(500).json({ message: 'Error marking messages as read', error: error.message });
        }
    }) as express.RequestHandler
);

/**
 * @swagger
 * /messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.delete('/:messageId', 
    authenticateToken as express.RequestHandler,
    (async (req: Request, res: Response): Promise<void> => {
        try {
            const messageId = req.params.messageId;
            const userId = (req as AuthenticatedRequest).user!.id;

            const message = await Message.findOne({
                _id: messageId,
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            });

            if (!message) {
                res.status(404).json({ message: 'Message not found' });
                return;
            }

            await message.deleteOne();
            res.json({ message: 'Message deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: 'Error deleting message', error: error.message });
        }
    }) as express.RequestHandler
);

export default router; 