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
exports.updateProfile = exports.getProfile = exports.getAllProfile = void 0;
const User_1 = __importDefault(require("../model/User"));
const imagekit_1 = __importDefault(require("../config/imagekit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//lay tat ca profile nguoi dung (admin)
const getAllProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.find();
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error fetching user profiles:", error);
        res.status(500).json({ error: "Failed to fetch user profiles" });
    }
});
exports.getAllProfile = getAllProfile;
//lay profile nguoi dung hien tai
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Failed to fetch user profiles:", error);
        res.status(500).json({ error: "Failed to fetch user profiles" });
    }
});
exports.getProfile = getProfile;
//cap nhat profile nguoi dung (co the up ava)
// Cập nhật profile người dùng (có thể upload avatar)
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting profile update...');
        console.log('Request file:', req.file);
        console.log('Request body:', req.body);
        const userId = req.params.id;
        const { username, phone, address, socialLink, description } = req.body;
        // Tìm user theo ID
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // Kiểm tra DEFAULT_AVATAR_URL
        const defaultAvatarUrl = process.env.DEFAULT_AVATAR_URL;
        if (!defaultAvatarUrl) {
            res.status(500).json({ error: "Server configuration error: Missing DEFAULT_AVATAR_URL" });
            return;
        }
        // Khởi tạo avatarUrl
        let avatarUrl = user.avatar || defaultAvatarUrl;
        // Xử lý upload avatar nếu có file
        if (req.file) {
            console.log('Processing file upload...');
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                console.log('Invalid file type:', req.file.mimetype);
                res.status(400).json({ error: "Invalid file type. Only JPEG, PNG and GIF are allowed" });
                return;
            }
            try {
                const fileBuffer = req.file.buffer;
                const fileName = `${Date.now()}-${req.file.originalname}`;
                console.log('Uploading to ImageKit with filename:', fileName);
                const result = yield imagekit_1.default.upload({
                    file: fileBuffer.toString("base64"),
                    fileName,
                    folder: "avatars",
                    useUniqueFileName: true,
                });
                if (!result.url) {
                    console.log('ImageKit upload failed - no URL returned');
                    res.status(500).json({ error: "Failed to get URL from ImageKit" });
                    return;
                }
                console.log('ImageKit upload successful, URL:', result.url);
                avatarUrl = result.url;
            }
            catch (uploadError) {
                console.error("Upload avatar failed:", uploadError);
                res.status(500).json({ error: "Failed to upload avatar" });
                return;
            }
        }
        else {
            console.log('No file uploaded, keeping existing avatar');
        }
        // Cập nhật thông tin profile
        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.socialLink = socialLink || user.socialLink;
        user.description = description || user.description;
        user.avatar = avatarUrl;
        yield user.save();
        console.log('Profile updated successfully');
        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    }
    catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
});
exports.updateProfile = updateProfile;
