import { Request, Response } from "express";
import multer from "multer";
import * as repo from "../repository/petRepository";
import Pet, {IPet} from '../model/Pet';

const upload = multer({ storage: multer.memoryStorage() });
export interface AuthenticatedRequest extends Request {
  user?: {id: string; uid: string; role: string; email: string}
}
/**
 * POST /pets
 */
export const createPetController =
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
        return res.status(403).json({message: "You have no permission for this function "})
      }
      const pet = await repo.createPet(
        req.body,
        req.files as Express.Multer.File[]
      );
      res.status(201).json(pet);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };


/**
 * GET /pets
 */
export const getAllPetsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
        return res.status(403).json({message: "You have no permission for this function "})
      }
    const pets = await repo.getAllPets();
    res.json(pets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /pets/:id
 */
export const getPetByIdController = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
     const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
         res.status(403).json({message: "You have no permission for this function "})
      }
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
export const updatePetController = 
  async (req: AuthenticatedRequest, res: Response):Promise<void> => {
    try {
      const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
         res.status(403).json({message: "You have no permission for this function "})
      }
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
}

/**
 * DELETE /pets/:id
 */
export const deletePetController = async (req: AuthenticatedRequest, res: Response):Promise<void> => {
  try {
    const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
         res.status(403).json({message: "You have no permission for this function "})
      }
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
