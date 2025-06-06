import { Request, Response, NextFunction } from "express";
import { createUser, getUsers, getUserByEmail, getUserById, updateUserById, softDeleteUserById } from "../repository/userRepository";

export interface AuthenticatedRequest extends Request {
    user?: { id: string, uid: string, role: string, email: string }
}

export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser) {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }

        const users = await getUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }

        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByEmailController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }

        const user = await getUserByEmail(req.params.email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;


        const user = await getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }

        const user = await updateUserById(req.params.id, req.body);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }

        const user = await softDeleteUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User Deleted" });
    } catch (error) {
        next(error);
    }
};
