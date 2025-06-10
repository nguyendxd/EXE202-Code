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
exports.getPost = exports.getPosts = exports.deletePost = exports.updatePost = exports.createPost = void 0;
const Post_1 = __importDefault(require("../model/Post"));
const imagekit_1 = __importDefault(require("../config/imagekit"));
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status } = req.body;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
            return res.status(403).json({ message: 'You have no permission for this function' });
        }
        const files = req.files;
        const imageUrls = files && files.length > 0
            ? (yield Promise.all(files.map(f => imagekit_1.default.upload({
                file: f.buffer.toString('base64'),
                fileName: f.originalname,
                folder: 'post-image',
            })))).map(r => r.url)
            : [];
        const post = yield Post_1.default.create({
            title,
            content,
            images: imageUrls,
            author: userId,
            authorType: user.role,
            status: status || 'draft',
        });
        res.status(201).json(post);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Error creating post', error: error instanceof Error ? error.message : error });
    }
});
exports.createPost = createPost;
// Update a post
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status } = req.body;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
            return res.status(403).json({ message: 'Only admin or shelter can update posts.' });
        }
        const post = yield Post_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        if (req.files && req.files.length > 0) {
            post.images = req.files.map(f => f.filename);
        }
        post.title = title !== null && title !== void 0 ? title : post.title;
        post.content = content !== null && content !== void 0 ? content : post.content;
        post.status = status !== null && status !== void 0 ? status : post.status;
        yield post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});
exports.updatePost = updatePost;
// Delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
            return res.status(403).json({ message: 'Only admin or shelter can delete posts.' });
        }
        const post = yield Post_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        if (post.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        yield post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
exports.deletePost = deletePost;
// Get all posts (admin only)
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can get all posts.' });
        }
        const posts = yield Post_1.default.find().sort({ createdAt: -1 });
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});
exports.getPosts = getPosts;
// Get a single post by ID (admin only)
const getPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can get post by id.' });
        }
        const post = yield Post_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching post', error });
    }
});
exports.getPost = getPost;
