import { Request, Response } from "express";
import multer from "multer";
import * as repo from "../repository/petRepository";

const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /pets
 */
export const createPetController = [
  upload.array("images", 5),
  async (req: Request, res: Response) => {
    try {
      const pet = await repo.createPet(
        req.body,
        req.files as Express.Multer.File[]
      );
      res.status(201).json(pet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
];

/**
 * GET /pets
 */
export const getAllPetsController = async (_: Request, res: Response) => {
  try {
    const pets = await repo.getAllPets();
    res.json(pets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /pets/:id
 */
export const getPetByIdController = async (req: Request, res: Response):Promise<void> => {
  try {
    const pet = await repo.getPetById(req.params.id);
    if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
    } 
    res.json(pet);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /pets/:id
 */
export const updatePetController = [
  upload.array("images", 5),
  async (req: Request, res: Response):Promise<void> => {
    try {
      // Nếu có files, gán vào data.images để repo xử lý upload/fallback
      const dataWithImages = {
        ...req.body,
        images: req.files && (req.files as Express.Multer.File[]).length > 0
          ? (req.files as Express.Multer.File[]).map(f => f.originalname) 
          : undefined
      };

      const pet = await repo.updatePetById(
        req.params.id,
        dataWithImages
      );
      if (!pet){
        res.status(404).json({ error: "Pet not found" });
        return;
      } 
      res.json(pet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  },
];

/**
 * DELETE /pets/:id
 */
export const deletePetController = async (req: Request, res: Response):Promise<void> => {
  try {
    const pet = await repo.softDeletePetById(req.params.id);
    if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
    } 
    res.json({ message: "Pet marked as adopted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
