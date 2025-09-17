import { Request, Response } from "express";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import User from "../model/User";
import jwt from 'jsonwebtoken';
import { getUserByFirebaseUID } from "../repository/userRepository";

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, phone, address, role, avatar, isDeleted } = req.body;
        const userRole = role || "customer";
        const avatarUrl = avatar || process.env.DEFAULT_AVATAR_URL || "https://ik.imagekit.io/nguyenn120404/default-avatar.jpg";

        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        if (firebaseUser) {
            // Send verification email
            await sendEmailVerification(firebaseUser);

            // Store temporary user data in Firestore
            const userRef = doc(db, "pending_users", firebaseUser.uid);
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

            res.status(201).json({
                message: "Registration successful. Please check your email to verify your account before logging in.",
                uid: firebaseUser.uid
            });
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

        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        if (!firebaseUser.emailVerified) {
            // If email is not verified, sign out the user
            await auth.signOut();
            return res.status(401).json({
                error: "Please verify your email before logging in. Check your inbox for the verification link."
            });
        }

        // Check if user exists in MongoDB (không filter isDeleted)
        const user = await User.findOne({ firebaseUID: firebaseUser.uid });

        // Nếu user bị xóa mềm thì không cho đăng nhập
        if (user && user.isDeleted) {
            await auth.signOut();
            return res.status(403).json({ error: "Tài khoản đã bị khóa hoặc xóa." });
        }

        if (!user) {
            // If user doesn't exist in MongoDB but email is verified, create the user
            const pendingUserRef = doc(db, "pending_users", firebaseUser.uid);
            const pendingUserDoc = await getDoc(pendingUserRef);

            if (pendingUserDoc.exists()) {
                const pendingUserData = pendingUserDoc.data();

                // Create user in MongoDB
                const newUser = new User({
                    firebaseUID: firebaseUser.uid,
                    username: pendingUserData.username,
                    email: pendingUserData.email,
                    phone: pendingUserData.phone,
                    address: pendingUserData.address,
                    role: pendingUserData.role,
                    isVerified: true,
                    createdAt: new Date(),
                    password: pendingUserData.password,
                    avatar: pendingUserData.avatar,
                });

                await newUser.save();

                // Move user data from pending_users to users collection
                const userRef = doc(db, "users", firebaseUser.uid);
                await setDoc(userRef, {
                    ...pendingUserData,
                    isVerified: true
                });

                // Delete from pending_users
                await deleteDoc(pendingUserRef);
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { uid: firebaseUser.uid, email: firebaseUser.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            userId: user?._id,
            user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                role: user?.role || "customer"
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred during login" });
        }
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmail(auth, email);
        res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: "An unknown error occurred" });
        }

    }

}

export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { uid } = req.body;

        // Get user from Firebase Auth
        const user = auth.currentUser;
        if (!user || user.uid !== uid) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(400).json({ error: "Email not verified" });
        }

        // Get pending user data from Firestore
        const pendingUserRef = doc(db, "pending_users", uid);
        const pendingUserDoc = await getDoc(pendingUserRef);

        if (!pendingUserDoc.exists()) {
            return res.status(404).json({ error: "Pending user data not found" });
        }

        const pendingUserData = pendingUserDoc.data();

        // Create user in MongoDB
        const newUser = new User({
            firebaseUID: uid,
            username: pendingUserData.username,
            email: pendingUserData.email,
            phone: pendingUserData.phone,
            address: pendingUserData.address,
            role: pendingUserData.role,
            isVerified: true,
            createdAt: new Date(),
            password: pendingUserData.password,
            avatar: pendingUserData.avatar,
        });

        await newUser.save();

        // Move user data from pending_users to users collection
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, {
            ...pendingUserData,
            isVerified: true
        });

        // Delete from pending_users
        await deleteDoc(pendingUserRef);

        res.status(200).json({
            message: "Email verified successfully. You can now log in.",
            user: {
                uid: newUser.firebaseUID,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during email verification:", error);
            res.status(500).json({ error: error.message });
        } else {
            console.error("An unknown error occurred during email verification:", error);
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
};
