import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBlog extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    images: string[];
    status: 'draft' | 'published' | 'archived';
    
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog> (
{
    title: {
        type:String,
        required:false,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: [{
         type: String, required: false 
        }],
    
},
    { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", BlogSchema);