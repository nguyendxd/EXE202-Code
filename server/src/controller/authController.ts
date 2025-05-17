import { Request, Response } from "express";
import { createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import User from "../model/User";
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, phone, address, socialLink, role, avatar, isDeleted } = req.body;

        // Kiểm tra role có tồn tại không, nếu không set mặc định là "customer"
        const userRole = role || "customer";

        // Tạo tài khoản Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const DEFAULT_AVATAR_URL = process.env.DEFAULT_AVATAR_URL || "https://ik.imagekit.io/nguyenn120404/default-avatar.jpg";
        if (firebaseUser) {
            // Gửi email xác minh
            await sendEmailVerification(firebaseUser);
         
            // Lưu thông tin người dùng vào Firestore
            const userRef = doc(db, "users", firebaseUser.uid);
            await setDoc(userRef, {
                avatar,
                username,
                email,
                phone,
                address,
                socialLink,
                role: userRole,
                isVerified: false,
                isDeleted: false,
                createdAt: new Date(),
            });

            // Lưu vào MongoDB
            const newUser = new User({
                firebaseUID: firebaseUser.uid,
                username,
                email,
                phone,
                address,
                socialLink,
                role: userRole,
                isVerified: false,
                createdAt: new Date(),
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
        } else {
            res.status(500).json({ error: "Failed to create Firebase user" });
        }
        
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    res.status(200).json({ message: "User logged in successfully", uid: firebaseUser.uid });
  } catch (error) {
    res.status(401).json({ error: "Invalid email or password" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
    try{
        const {email} = req.body;
        await sendPasswordResetEmail(auth, email);
        res.status(200).json({message: "Password reset email sent"});
    }catch (error){
        if (error instanceof Error) {
            res.status(500).json({error: error.message});
        } else {
            res.status(500).json({error: "An unknown error occurred"});
        }
        
    }

}
