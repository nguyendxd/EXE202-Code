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
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const {username, phone, address, socialLink, description} = req.body;

        const user = await User.findById(userId);
        if(!user){
         res.status(404).json({error: "User not found"});
         return;
        }
        let avatarUrl = user.avatar || process.env.DEFAULT_AVATAR_URL;
        if (req.file){

        }
    } catch (error) {
        
    }
}
