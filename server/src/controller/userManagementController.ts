import { Request, Response, NextFunction } from "express";
import { createUser, getUsers, getUserByEmail, getUserById, updateUserById, softDeleteUserById } from "../repository/userRepository";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

export const addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByEmailController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserByEmail(req.params.email);
        if (!user)  res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await getUserById(req.params.id);
        if (!user)  res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await updateUserById(req.params.id, req.body);
        if (!user)  res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await softDeleteUserById(req.params.id);
        if (!user)  res.status(404).json({ message: "Không tìm thấy người dùng" });
        res.json({ message: "Đã xóa người dùng" });
    } catch (error) {
        next(error);
    }
};
