"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.resetPassword = exports.login = exports.register = void 0;
const auth_1 = require("firebase/auth");
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
const User_1 = __importDefault(require("../model/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username, phone, address, role, avatar, isDeleted } = req.body;
        const userRole = role || "customer";
        const avatarUrl = avatar || process.env.DEFAULT_AVATAR_URL || "https://ik.imagekit.io/nguyenn120404/default-avatar.jpg";
        // Create user in Firebase Auth
        const userCredential = yield (0, auth_1.createUserWithEmailAndPassword)(firebase_1.auth, email, password);
        const firebaseUser = userCredential.user;
        if (firebaseUser) {
            // Send verification email
            yield (0, auth_1.sendEmailVerification)(firebaseUser);
            // Store temporary user data in Firestore
            const userRef = (0, firestore_1.doc)(firebase_1.db, "pending_users", firebaseUser.uid);
            yield (0, firestore_1.setDoc)(userRef, {
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
        }
        else {
            res.status(500).json({ error: "Failed to create Firebase user" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during registration:", error);
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("An unknown error occurred during registration:", error);
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Sign in with Firebase
        const userCredential = yield (0, auth_1.signInWithEmailAndPassword)(firebase_1.auth, email, password);
        const firebaseUser = userCredential.user;
        if (!firebaseUser.emailVerified) {
            // If email is not verified, sign out the user
            yield firebase_1.auth.signOut();
            return res.status(401).json({
                error: "Please verify your email before logging in. Check your inbox for the verification link."
            });
        }
        // Check if user exists in MongoDB (không filter isDeleted)
        const user = yield User_1.default.findOne({ firebaseUID: firebaseUser.uid });
        // Nếu user bị xóa mềm thì không cho đăng nhập
        if (user && user.isDeleted) {
            yield firebase_1.auth.signOut();
            return res.status(403).json({ error: "Tài khoản đã bị khóa hoặc xóa." });
        }
        if (!user) {
            // If user doesn't exist in MongoDB but email is verified, create the user
            const pendingUserRef = (0, firestore_1.doc)(firebase_1.db, "pending_users", firebaseUser.uid);
            const pendingUserDoc = yield (0, firestore_1.getDoc)(pendingUserRef);
            if (pendingUserDoc.exists()) {
                const pendingUserData = pendingUserDoc.data();
                // Create user in MongoDB
                const newUser = new User_1.default({
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
                yield newUser.save();
                // Move user data from pending_users to users collection
                const userRef = (0, firestore_1.doc)(firebase_1.db, "users", firebaseUser.uid);
                yield (0, firestore_1.setDoc)(userRef, Object.assign(Object.assign({}, pendingUserData), { isVerified: true }));
                // Delete from pending_users
                yield (0, firestore_1.deleteDoc)(pendingUserRef);
            }
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ uid: firebaseUser.uid, email: firebaseUser.email }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        res.status(200).json({
            message: "Login successful",
            token,
            userId: user === null || user === void 0 ? void 0 : user._id,
            user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                role: (user === null || user === void 0 ? void 0 : user.role) || "customer"
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        if (error instanceof Error) {
            res.status(401).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred during login" });
        }
    }
});
exports.login = login;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield (0, auth_1.sendPasswordResetEmail)(firebase_1.auth, email);
        res.status(200).json({ message: "Password reset email sent" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.resetPassword = resetPassword;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.body;
        // Get user from Firebase Auth
        const user = firebase_1.auth.currentUser;
        if (!user || user.uid !== uid) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        // Check if email is verified
        if (!user.emailVerified) {
            return res.status(400).json({ error: "Email not verified" });
        }
        // Get pending user data from Firestore
        const pendingUserRef = (0, firestore_1.doc)(firebase_1.db, "pending_users", uid);
        const pendingUserDoc = yield (0, firestore_1.getDoc)(pendingUserRef);
        if (!pendingUserDoc.exists()) {
            return res.status(404).json({ error: "Pending user data not found" });
        }
        const pendingUserData = pendingUserDoc.data();
        // Create user in MongoDB
        const newUser = new User_1.default({
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
        yield newUser.save();
        // Move user data from pending_users to users collection
        const userRef = (0, firestore_1.doc)(firebase_1.db, "users", uid);
        yield (0, firestore_1.setDoc)(userRef, Object.assign(Object.assign({}, pendingUserData), { isVerified: true }));
        // Delete from pending_users
        yield (0, firestore_1.deleteDoc)(pendingUserRef);
        res.status(200).json({
            message: "Email verified successfully. You can now log in.",
            user: {
                uid: newUser.firebaseUID,
                email: newUser.email,
                role: newUser.role
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error during email verification:", error);
            res.status(500).json({ error: error.message });
        }
        else {
            console.error("An unknown error occurred during email verification:", error);
            res.status(500).json({ error: "An unknown error occurred" });
        }
    }
});
exports.verifyEmail = verifyEmail;
