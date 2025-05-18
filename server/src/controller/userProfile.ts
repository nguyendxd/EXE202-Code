import {Request, Response} from "express";
import User from "../model/User";
import imagekit from "../config/imagekit";
import dotenv from "dotenv";

dotenv.config();


//lay tat ca profile nguoi dung (admin)
export const getAllProfile = async (req:Request, res:Response) => {
    try{
        const user = await User.find();
        res.status(200).json(user);

    } catch (error){
        console.error("Error fetching user profiles:", error);
        res.status(500).json({error: "Failed to fetch user profiles"});
    }
};
//lay profile nguoi dung hien tai
export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            res.status(404).json({error: "User not found"});
            return;
        }
    }catch(error) {
        console.error("Failed to fetch user profiles:", error);
        res.status(500).json({error:"Failed to fetch user profiles"});
        
    }
};
//cap nhat profile nguoi dung (co the up ava)
// Cập nhật profile người dùng (có thể upload avatar)
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const { username, phone, address, socialLink, description } = req.body;

        // Tìm user theo ID
        const user = await User.findById(userId);
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
        let avatarUrl: string = user.avatar || defaultAvatarUrl;

        // Xử lý upload avatar nếu có file
        if (req.file) {
            try {
                const fileBuffer = req.file.buffer;
                const fileName = `${Date.now()}-${req.file.originalname}`;

                const result = await imagekit.upload({
                    file: fileBuffer.toString("base64"),
                    fileName,
                    folder: "avatars",
                    useUniqueFileName: true,

                });

                if (!result.url) {
                    res.status(500).json({ error: "Failed to get URL from ImageKit" });
                    return;
                }
                avatarUrl = result.url;
            } catch (uploadError) {
                console.error("Upload avatar failed:", uploadError);
                res.status(500).json({ error: "Failed to upload avatar" });
                return;
            }
        }

        // Cập nhật thông tin profile
        user.username = username || user.username;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.socialLink = socialLink || user.socialLink;
        user.description = description || user.description;
        user.avatar = avatarUrl;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Profile update failed:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};
