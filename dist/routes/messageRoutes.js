"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageController_1 = require("../controller/messageController");
const auth_1 = require("../middleware/auth");
const multer_1 = __importDefault(require("multer"));
const Message_1 = __importDefault(require("../model/Message"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
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
router.post('/send', auth_1.authenticateToken, upload.array('files'), messageController_1.sendMessage);
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
router.get('/conversation/:userId', auth_1.authenticateToken, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.user.id;
        const otherUserId = req.params.userId;
        const messages = yield Message_1.default.find({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversation', error: error.message });
    }
})));
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
router.get('/conversations', auth_1.authenticateToken, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Get the latest message from each conversation
        const conversations = yield Message_1.default.aggregate([
            {
                $match: {
                    $or: [
                        { sender: new mongoose_1.Types.ObjectId(userId) },
                        { receiver: new mongoose_1.Types.ObjectId(userId) }
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
                            { $eq: ['$sender', new mongoose_1.Types.ObjectId(userId)] },
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching conversations', error: error.message });
    }
})));
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
router.put('/read/:senderId', auth_1.authenticateToken, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUserId = req.user.id;
        const senderId = req.params.senderId;
        yield Message_1.default.updateMany({
            sender: senderId,
            receiver: currentUserId,
            read: false
        }, {
            $set: { read: true }
        });
        res.json({ message: 'Messages marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error marking messages as read', error: error.message });
    }
})));
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
router.delete('/:messageId', auth_1.authenticateToken, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = req.params.messageId;
        const userId = req.user.id;
        const message = yield Message_1.default.findOne({
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
        yield message.deleteOne();
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting message', error: error.message });
    }
})));
exports.default = router;
