import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    firebaseUID: string;
    username: string;
    email: string;
    phone: string;
    address: string;
    socialLink: string;
    role: "guest" | "customer" | "shelter" | "admin";
    isVerified: boolean;
    isAdmin: boolean;
    createdAt: Date;
}

const userSchema = new Schema<IUser>({
    firebaseUID: { type: String, required: true, unique: true },
    username: { type: String, required: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, minlength: 5, maxlength: 50 },
    phone: { type: String, required: true, minlength: 8, maxlength: 50 },
    address: { type: String, required: true, minlength: 5, maxlength: 50 },
    socialLink: { type: String, required: false, minlength: 5, maxlength: 50 },
    role: { type: String, enum: ["guest", "customer", "shelter", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", userSchema);
