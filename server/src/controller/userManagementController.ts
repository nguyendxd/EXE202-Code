import { Request, Response, NextFunction } from "express";
import { createUser, getUsers, getUserByEmail, getUserById, updateUserById, softDeleteUserById } from "../repository/userRepository";

export interface AuthenticatedRequest extends Request {
    user?: {id: string, uid: string, role: string, email: string}
} 

export const getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const users = await getUsers();

        const user = req.user;
        const userId = user?.id; 
        if (!user || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await createUser(req.body);

        const users = req.user;
        const userId = user?.id; 
        if (!users || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByEmailController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserByEmail(req.params.email);
        const users = req.user;
        const userId = user?.id; 
        if (!users || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        if (!user)  res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserById(req.params.id);
         const users = req.user;
        const userId = user?.id; 
        if (!users || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        if (!user)  res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        
        const user = await updateUserById(req.params.id, req.body);
        const users = req.user;
        const userId = user?.id; 
        if (!users || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        if (!user)  res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await softDeleteUserById(req.params.id);
        const users = req.user;
        const userId = user?.id; 
        if (!users || !userId || user.role !== 'admin'){
            res.status(403).json({message: "You have no permission for this function "});
        }
        if (!user)  res.status(404).json({ message: "User not found" });
        res.json({ message: "User Deleted" });
    } catch (error) {
        next(error);
    }
};
