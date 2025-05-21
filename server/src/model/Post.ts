import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  images: string[];
  author: string;
  authorType: 'shelter' | 'admin';
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      trim: true,
    }],
    author: {
      type: String,
      required: true,
    },
    authorType: {
      type: String,
      enum: ['shelter', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IPost>('Post', PostSchema); 