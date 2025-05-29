import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends Document {
    firebaseUID: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    address: string;
    socialLink: string;
    avatar: string;
    role: "guest" | "customer" | "shelter" | "admin";
    isVerified: boolean;
    isAdmin: boolean;
    createdAt: Date;
    description: string;
    isDeleted: boolean;
    fcmToken?: string; 
}

const userSchema = new Schema<IUser>({
    firebaseUID: { type: String, required: false, unique: true },
    username: { type: String, required: true, minlength: 2, maxlength: 50 },
    password: { type: String, required: true, select: false, minlength: 2, maxlength: 50  },
    email: { type: String, required: true, unique: true, minlength: 5, maxlength: 50 },
    phone: { type: String, required: true, minlength: 8, maxlength: 50 },
    address: { type: String, required: true, minlength: 5, maxlength: 50 },
    socialLink: { type: String, required: false, minlength: 5, maxlength: 50 },
    avatar: { type: String, default: process.env.DEFAULT_AVATAR_URL },
    role: { type: String, enum: ["guest", "customer", "shelter", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    isDeleted: {type: Boolean, default: false},
    description: { type: String, required: false, minlength: 0, maxlength: 100 },
    fcmToken: { type: String, required: false },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
export type {IUser};