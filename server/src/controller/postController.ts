import { Request, Response } from 'express';
import Post, { IPost } from '../model/Post';
import { Types } from 'mongoose';
import  imagekit from '../config/imagekit';


export interface AuthenticatedRequest extends Request {
  user?: { id: string; uid: string; role: string; email: string };
}

// Create a new post
export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, status } = req.body;
    const user = req.user;
    const userId = user?.id || user?.uid;

  
    if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
      return res.status(403).json({ message: 'You have no permission for this function' });
    }

   
    const files = req.files as Express.Multer.File[] | undefined;
    const imageUrls = files && files.length > 0
      ? (await Promise.all(
          files.map(f =>
            imagekit.upload({
              file: f.buffer.toString('base64'),
              fileName: f.originalname,
              folder: 'post-image',
            })
          )
        )).map(r => r.url)
      : [];

    const post = await Post.create({
      title,
      content,
      images: imageUrls,
      author: userId,
      authorType: user.role,
      status: status || 'draft',
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post', error: error instanceof Error ? error.message : error });
  }
};

// Update a post
export const updatePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, content, status } = req.body;
    const user = req.user;
    const userId = user?.id || user?.uid;
    if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
      return res.status(403).json({ message: 'Only admin or shelter can update posts.' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }
    if (req.files && (req.files as Express.Multer.File[]).length > 0) {
      post.images = (req.files as Express.Multer.File[]).map(f => f.filename);
    }
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    post.status = status ?? post.status;
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error });
  }
};

// Delete a post
export const deletePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    const userId = user?.id || user?.uid;
    if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
      return res.status(403).json({ message: 'Only admin or shelter can delete posts.' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== userId && user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error });
  }
};

// Get all posts (admin only)
export const getPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can get all posts.' });
    }
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
};

// Get a single post by ID (admin only)
export const getPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can get post by id.' });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
}; 