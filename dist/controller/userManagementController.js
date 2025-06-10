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
exports.deleteUserController = exports.updateUserController = exports.getUserByIdController = exports.getUserByEmailController = exports.addUser = exports.getAllUsersFull = exports.getAllUsers = void 0;
const userRepository_1 = require("../repository/userRepository");
const User_1 = __importDefault(require("../model/User"));
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser) {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const users = yield (0, userRepository_1.getUsers)();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getAllUsersFull = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const users = yield User_1.default.find();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsersFull = getAllUsersFull;
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const user = yield (0, userRepository_1.createUser)(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.addUser = addUser;
const getUserByEmailController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const user = yield (0, userRepository_1.getUserByEmail)(req.params.email);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserByEmailController = getUserByEmailController;
const getUserByIdController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        const user = yield (0, userRepository_1.getUserById)(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserByIdController = getUserByIdController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const user = yield (0, userRepository_1.updateUserById)(req.params.id, req.body);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
const deleteUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (!authenticatedUser || authenticatedUser.role !== 'admin') {
            res.status(403).json({ message: 'You have no permission for this function' });
            return;
        }
        const user = yield (0, userRepository_1.softDeleteUserById)(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ message: "User Deleted" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUserController = deleteUserController;
