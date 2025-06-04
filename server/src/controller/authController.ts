import { Request, Response } from "express";
import { createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import User from "../model/User";
import jwt from 'jsonwebtoken';
import { getUserByFirebaseUID } from "../repository/userRepository";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, phone, address,  role, avatar, isDeleted } = req.body;
        const userRole = role || "customer";
        const avatarUrl = avatar || process.env.DEFAULT_AVATAR_URL || "https://ik.imagekit.io/nguyenn120404/default-avatar.jpg";
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        if (firebaseUser) {
            await sendEmailVerification(firebaseUser);

            const userRef = doc(db, "users", firebaseUser.uid);
            await setDoc(userRef, {
                avatar: avatarUrl,
                username,
                email,
                phone,
                address,
                role: userRole,
                isVerified: false,
                isDeleted: false,
                createdAt: new Date(),
                password: password,
            });

            const newUser = new User({
                firebaseUID: firebaseUser.uid,
                username,
                email,
                phone,
                address,
                role: userRole,
                isVerified: false,
                createdAt: new Date(),
                password: password,
                avatar: avatarUrl,
            });

            await newUser.save();

            res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
        } else {
            res.status(500).json({ error: "Failed to create Firebase user" });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during registration:", error);
            res.status(500).json({ error: error.message });
        } else {
            console.error("An unknown error occurred during registration:", error);
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};



export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user data from MongoDB
    const user = await getUserByFirebaseUID(firebaseUser.uid);

    if (!user) {
      // This case should ideally not happen if user is in Firebase Auth but good for robustness
      return res.status(404).json({ error: "User data not found in database" });
    }

    const token = jwt.sign(
      { 
        uid: firebaseUser.uid,
        role: user.role, // Use role from MongoDB
        email: user.email // Use email from MongoDB
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      message: "User logged in successfully", 
      token,
      user: {
        uid: firebaseUser.uid,
        role: user.role, // Use role from MongoDB for response
        email: user.email // Use email from MongoDB for response
      }
    });
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
