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
exports.isAdmin = exports.authenticateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository_1 = require("../repository/userRepository"); // Import the function to get user from DB by Firebase UID
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log('No authorization header found');
        return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    console.log('Token:', token);
    if (!token) {
        console.log('No token found in authorization header');
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        console.log('JWT Secret:', JWT_SECRET);
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log('Decoded token:', JSON.stringify(decoded, null, 2));
        // Ensure the decoded token has the required fields, specifically uid
        if (!decoded || typeof decoded !== 'object' || !decoded.uid) {
            console.error('Invalid token structure or missing UID');
            throw new Error('Invalid token structure or missing UID');
        }
        const firebaseUID = decoded.uid;
        // Fetch the user from your MongoDB database using the firebaseUID
        const userFromDB = yield (0, userRepository_1.getUserByFirebaseUID)(firebaseUID);
        if (!userFromDB) {
            console.error('User not found in database for UID:', firebaseUID);
            return res.status(403).json({ message: 'User not found' });
        }
        // Set the user information in the request, including the MongoDB _id
        req.user = {
            id: userFromDB._id.toString(), // Use MongoDB _id as the 'id' and cast to any to resolve unknown type error
            uid: userFromDB.firebaseUID,
            role: userFromDB.role,
            email: userFromDB.email,
            // You can include other fields from userFromDB if needed for AuthenticatedRequest
        };
        console.log('User authenticated and data loaded from DB:', req.user);
        next();
    }
    catch (error) {
        console.error('Token verification or DB fetch error:', error);
        return res.status(403).json({ message: 'Invalid token or user data issue', error: error.message });
    }
});
exports.authenticateToken = authenticateToken;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};
exports.isAdmin = isAdmin;
