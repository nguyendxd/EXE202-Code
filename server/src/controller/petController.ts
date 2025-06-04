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
      console.log('Inside createPetController');
      console.log('req.user:', req.user);
      console.log('req.user?.role:', req.user?.role);

      const user = req.user;
      const userId = user?.id || user?.uid;

      if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')){
        console.log('Permission check failed in createPetController');
        return res.status(403).json({message: "You have no permission for this function "})
      }
      const pet = await repo.createPet(
        req.body,
        req.files as Express.Multer.File[]
      );
      res.status(201).json(pet);
    } catch (err: any) {
      console.error('Error in createPetController:', err);
      res.status(500).json({ error: err.message });
    }
  };


/**
 * GET /pets
 */
export const getAllPetsController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pets = await repo.getAllPets();
    res.json({
      success: true,
      data: pets,
      total: pets.length
    });
  } catch (err: any) {
    console.error('Error in getAllPetsController:', err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

/**
 * GET /pets/:id
 */
export const getPetByIdController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log('Starting getPetByIdController');
    console.log('Request params:', req.params);
    const user = req.user;
    console.log('User in getPetByIdController:', user);
    console.log('User role:', user?.role);
    const userId = user?.id || user?.uid;
    console.log('UserId:', userId);
    console.log('Permission check passed, fetching pet with ID:', req.params.id);
    const pet = await repo.getPetById(req.params.id);
    console.log('Pet found:', pet);
    
    if (!pet) {
      console.log('Pet not found for ID:', req.params.id);
      return res.status(404).json({ error: "Pet not found" });
    }
    
    console.log('Sending pet response:', pet);
    res.json(pet);
  } catch (err: any) {
    console.error('Error in getPetByIdController:', err);
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

/**
 * GET /pets/search
 */
export const searchPetsController = async (req: Request, res: Response) => {
    try {
        const {
            breed,
            gender,
            color,
            address,
            age
        } = req.query;

        const query: any = {};

        // Tìm kiếm theo giống (breed)
        if (breed) {
            query.breed = { 
                $regex: new RegExp(breed.toString().trim(), 'i') 
            };
        }

        // Tìm kiếm theo giới tính (gender)
        if (gender) {
            const normalizedGender = gender.toString().toLowerCase().trim();
            if (['male', 'female'].includes(normalizedGender)) {
                query.gender = normalizedGender;
            }
        }

        // Tìm kiếm theo màu sắc (color)
        if (color) {
            query.color = { 
                $regex: new RegExp(color.toString().trim(), 'i') 
            };
        }

        // Tìm kiếm theo địa chỉ (address)
        if (address) {
            query.address = { 
                $regex: new RegExp(address.toString().trim(), 'i') 
            };
        }

        // Tìm kiếm theo tuổi (age)
        if (age) {
            query.age = { 
                $regex: new RegExp(age.toString().trim(), 'i') 
            };
        }

        console.log('Search query:', JSON.stringify(query, null, 2));

        const pets = await Pet.find(query)
            .sort({ createdAt: -1 })
            .populate('shelterId', 'name address phone email');

        console.log(`Found ${pets.length} pets matching the criteria`);

        res.json({
            success: true,
            data: pets,
            total: pets.length
        });
    } catch (err: any) {
        console.error('Error in searchPetsController:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
