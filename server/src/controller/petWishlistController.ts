import { Request, Response } from "express";
import PetWishlist, { IPetWishlist } from "../model/PetWishlist";
import Pet from "../model/Pet";

export interface AuthenticatedRequest extends Request {
  user?: { id: string; uid: string; role: string; email: string };
}

// Thêm pet vào wishlist
export const addToWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const petId = req.params.petId;
    // Kiểm tra pet tồn tại
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    // Kiểm tra pet đã được nhận nuôi chưa
    if (pet.isAdopted) {
      return res.status(400).json({ message: "Pet is already adopted" });
    }
    // Tạo wishlist entry (unique index sẽ chặn duplicate)
    const wish = await PetWishlist.create({
      user: user.id || user.uid,
      pet: petId,
    });
    res.status(201).json(wish);
  } catch (err: any) {
    // handle duplicate key
    if (err.code === 11000) {
      return res.status(409).json({ message: "Already in wishlist" });
    }
    res.status(500).json({ message: "Error adding to wishlist", error: err.message });
  }
};

// Xóa pet khỏi wishlist
export const removeFromWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const petId = req.params.petId;
    const wish = await PetWishlist.findOneAndDelete({
      user: user.id || user.uid,
      pet: petId,
    });
    if (!wish) {
      return res.status(404).json({ message: "Not found in wishlist" });
    }
    res.json({ message: "Removed from wishlist" });
  } catch (err: any) {
    res.status(500).json({ message: "Error removing from wishlist", error: err.message });
  }
};

// Lấy toàn bộ wishlist của user hiện tại
export const getMyWishlist = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const items = await PetWishlist.find({ user: user.id || user.uid })
      .populate("pet")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching wishlist", error: err.message });
  }
};
