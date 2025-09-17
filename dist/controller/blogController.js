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
exports.searchBlogs = exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../model/Blog"));
const mongoose_1 = __importDefault(require("mongoose"));
const imagekit_1 = __importDefault(require("../config/imagekit"));
// Create a new blog post
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status } = req.body;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin')) {
            return res.status(403).json({ message: 'You have no permission' });
        }
        const files = req.files;
        const imageUrls = files && files.length > 0
            ? (yield Promise.all(files.map(f => imagekit_1.default.upload({
                file: f.buffer.toString('base64'),
                fileName: f.originalname,
                folder: 'blog-image',
            })))).map(r => r.url)
            : [];
        const blog = yield Blog_1.default.create({
            title,
            content,
            images: imageUrls,
            author: userId,
            status: status || 'draft',
        });
        res.status(201).json(blog);
    }
    catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({
            message: 'Error creating blog',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.createBlog = createBlog;
// Get all blogs with optional filters
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { author } = req.query;
        const query = {
            status: 'published'
        };
        if (author)
            query.author = author;
        const blogs = yield Blog_1.default.find(query)
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        res.json(blogs);
    }
    catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({
            message: 'Error fetching blogs',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.getAllBlogs = getAllBlogs;
// Get blog by ID
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Kiểm tra xem id có hợp lệ không (phải là ObjectId hợp lệ của MongoDB)
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }
        const blog = yield Blog_1.default.findById(id).populate('author', 'username avatar');
        if (!blog) {
            return res.status(404).json({ message: 'Blog không tìm thấy' });
        }
        // Chỉ trả về blog nếu status là 'published'
        if (blog.status !== 'published') {
            return res.status(403).json({ message: 'Blog chưa được xuất bản' });
        }
        res.json(blog);
    }
    catch (error) {
        console.error('Error fetching blog by id:', error);
        res.status(500).json({
            message: 'Error fetching blog',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.getBlogById = getBlogById;
// Update blog
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, status } = req.body;
        const blogId = req.params.id;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const blog = yield Blog_1.default.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Check if user is the author or an admin
        if (blog.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission to update this blog' });
        }
        // Handle image uploads if any
        const files = req.files;
        let imageUrls = blog.images;
        if (files && files.length > 0) {
            const newImageUrls = (yield Promise.all(files.map(f => imagekit_1.default.upload({
                file: f.buffer.toString('base64'),
                fileName: f.originalname,
                folder: 'blog-image',
            })))).map(r => r.url);
            imageUrls = [...imageUrls, ...newImageUrls];
        }
        // Update blog
        const updatedBlog = yield Blog_1.default.findByIdAndUpdate(blogId, {
            title: title || blog.title,
            content: content || blog.content,
            status: status || blog.status,
            images: imageUrls,
        }, { new: true }).populate('author', 'username avatar');
        res.json(updatedBlog);
    }
    catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({
            message: 'Error updating blog',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.updateBlog = updateBlog;
// Delete blog
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogId = req.params.id;
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const blog = yield Blog_1.default.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Check if user is the author or an admin
        if (blog.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission to delete this blog' });
        }
        // Delete images from imagekit if any
        if (blog.images && blog.images.length > 0) {
            yield Promise.all(blog.images.map((imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const fileId = (_a = imageUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.')[0];
                if (fileId) {
                    yield imagekit_1.default.deleteFile(fileId);
                }
            })));
        }
        yield Blog_1.default.findByIdAndDelete(blogId);
        res.json({ message: 'Blog deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({
            message: 'Error deleting blog',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.deleteBlog = deleteBlog;
// Search blogs with pagination
const searchBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query, page = 1, limit = 10, status } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        // Build search query
        const searchQuery = {};
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ];
        }
        if (status) {
            searchQuery.status = status;
        }
        // Execute search with pagination
        const [blogs, total] = yield Promise.all([
            Blog_1.default.find(searchQuery)
                .populate('author', 'username avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Blog_1.default.countDocuments(searchQuery)
        ]);
        res.json({
            blogs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error searching blogs:', error);
        res.status(500).json({
            message: 'Error searching blogs',
            error: error instanceof Error ? error.message : error
        });
    }
});
exports.searchBlogs = searchBlogs;
