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
exports.getMyWishlist = exports.removeFromWishlist = exports.addToWishlist = void 0;
const PetWishlist_1 = __importDefault(require("../model/PetWishlist"));
const Pet_1 = __importDefault(require("../model/Pet"));
// Thêm pet vào wishlist
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const petId = req.params.petId;
        // Kiểm tra pet tồn tại
        const pet = yield Pet_1.default.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: "Pet not found" });
        }
        // Kiểm tra pet đã được nhận nuôi chưa
        if (pet.isAdopted) {
            return res.status(400).json({ message: "Pet is already adopted" });
        }
        // Tạo wishlist entry (unique index sẽ chặn duplicate)
        const wish = yield PetWishlist_1.default.create({
            user: user.id || user.uid,
            pet: petId,
        });
        res.status(201).json(wish);
    }
    catch (err) {
        // handle duplicate key
        if (err.code === 11000) {
            return res.status(409).json({ message: "Already in wishlist" });
        }
        res.status(500).json({ message: "Error adding to wishlist", error: err.message });
    }
});
exports.addToWishlist = addToWishlist;
// Xóa pet khỏi wishlist
const removeFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const petId = req.params.petId;
        const wish = yield PetWishlist_1.default.findOneAndDelete({
            user: user.id || user.uid,
            pet: petId,
        });
        if (!wish) {
            return res.status(404).json({ message: "Not found in wishlist" });
        }
        res.json({ message: "Removed from wishlist" });
    }
    catch (err) {
        res.status(500).json({ message: "Error removing from wishlist", error: err.message });
    }
});
exports.removeFromWishlist = removeFromWishlist;
// Lấy toàn bộ wishlist của user hiện tại
const getMyWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const items = yield PetWishlist_1.default.find({ user: user.id || user.uid })
            .populate("pet")
            .sort({ createdAt: -1 });
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching wishlist", error: err.message });
    }
});
exports.getMyWishlist = getMyWishlist;
