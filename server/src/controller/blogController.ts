import { Request, Response } from "express";
import Blog, { IBlog } from "../model/Blog";
import { Types } from "mongoose";
import imagekit from "../config/imagekit";

export interface AuthenticatedRequest extends Request {
    user?: {id: string; uid: string; role: string; email: string};
}

// Create a new blog post
export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content, status } = req.body;
        const user = req.user;
        const userId = user?.id || user?.uid;
        
        if (!user || !userId || (user.role !== 'admin')) {
            return res.status(403).json({ message: 'You have no permission' });
        }

        const files = req.files as Express.Multer.File[] | undefined;
        const imageUrls = files && files.length > 0
            ? (await Promise.all(
                files.map(f => 
                    imagekit.upload({
                        file: f.buffer.toString('base64'),
                        fileName: f.originalname,
                        folder: 'blog-image',    
                    })
                )
            )).map(r => r.url)
            : []; 

        const blog = await Blog.create({
            title,
            content,
            images: imageUrls,
            author: userId,
            status: status || 'draft',
        });

        res.status(201).json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ 
            message: 'Error creating blog', 
            error: error instanceof Error ? error.message : error 
        });
    }
};

// Get all blogs with optional filters
export const getAllBlogs = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { status, author } = req.query;
        const query: any = {};

        // Add filters if provided
        if (status) query.status = status;
        if (author) query.author = author;

        const blogs = await Blog.find(query)
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ 
            message: 'Error fetching blogs', 
            error: error instanceof Error ? error.message : error 
        });
    }
};

// Get blog by ID
export const getBlogById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId)
            .populate('author', 'username avatar');

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ 
            message: 'Error fetching blog', 
            error: error instanceof Error ? error.message : error 
        });
    }
};

// Update blog
export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content, status } = req.body;
        const blogId = req.params.id;
        const user = req.user;
        const userId = user?.id || user?.uid;

        if (!user || !userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author or an admin
        if (blog.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission to update this blog' });
        }

        // Handle image uploads if any
        const files = req.files as Express.Multer.File[] | undefined;
        let imageUrls = blog.images;

        if (files && files.length > 0) {
            const newImageUrls = (await Promise.all(
                files.map(f => 
                    imagekit.upload({
                        file: f.buffer.toString('base64'),
                        fileName: f.originalname,
                        folder: 'blog-image',
                    })
                )
            )).map(r => r.url);

            imageUrls = [...imageUrls, ...newImageUrls];
        }

        // Update blog
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title: title || blog.title,
                content: content || blog.content,
                status: status || blog.status,
                images: imageUrls,
            },
            { new: true }
        ).populate('author', 'username avatar');

        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ 
            message: 'Error updating blog', 
            error: error instanceof Error ? error.message : error 
        });
    }
};

// Delete blog
export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const blogId = req.params.id;
        const user = req.user;
        const userId = user?.id || user?.uid;

        if (!user || !userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        // Check if user is the author or an admin
        if (blog.author.toString() !== userId && user.role !== 'admin') {
            return res.status(403).json({ message: 'You have no permission to delete this blog' });
        }

        // Delete images from imagekit if any
        if (blog.images && blog.images.length > 0) {
            await Promise.all(
                blog.images.map(async (imageUrl) => {
                    const fileId = imageUrl.split('/').pop()?.split('.')[0];
                    if (fileId) {
                        await imagekit.deleteFile(fileId);
                    }
                })
            );
        }

        await Blog.findByIdAndDelete(blogId);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ 
            message: 'Error deleting blog', 
            error: error instanceof Error ? error.message : error 
        });
    }
};