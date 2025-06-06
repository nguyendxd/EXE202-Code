// src/repository/petRepository.ts

import Pet, { IPet } from "../model/Pet";
import imagekit from "../config/imagekit";
import { Types } from "mongoose";

const DEFAULT_PET_IMAGE_URL =
  "https://ik.imagekit.io/nguyenn120404/default-pet-image/download.png?updatedAt=1747539753753";

// Tạo pet mới (upload ảnh nếu có, ngược lại dùng ảnh mặc định)
export const createPet = async (
  data: Partial<IPet>,
  files?: {
    images?: Express.Multer.File[];
    avatar?: Express.Multer.File[];
  }
): Promise<IPet> => {
  const imageUrls = files?.images && files.images.length > 0
    ? (await Promise.all(
        files.images.map(f =>
          imagekit.upload({
            file: f.buffer.toString("base64"),
            fileName: f.originalname,
            folder: "/pet-image",
          })
        )
      )).map(r => r.url)
    : [DEFAULT_PET_IMAGE_URL];
    
  const avatarUrls = files?.avatar && files.avatar.length > 0
  ? (await Promise.all(
        files.avatar.map(f =>
          imagekit.upload({
            file: f.buffer.toString("base64"),
            fileName: f.originalname,
            folder: "/pet-image",
          })
        )
      )).map(r => r.url)
    : [DEFAULT_PET_IMAGE_URL];

  return new Pet({
    ...data,
    shelterId: data.shelterId && Types.ObjectId.isValid(String(data.shelterId))
      ? new Types.ObjectId(String(data.shelterId))
      : undefined,
    images: imageUrls,
    avatar: avatarUrls[0],
  }).save();
};

// Lấy tất cả pet chưa được nhận nuôi
export const getAllPets = () =>
  Pet.find({ isAdopted: false })
    .sort({ createdAt: -1 })
    .populate('shelterId', 'name address phone email');

export const getPetById = (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid pet ID");
    }
    return Pet.findOne({ _id: id }).populate('shelterId');
};

export const updatePetById = async (
  id: string,
  data: Partial<IPet>,
  files?: { images?: Express.Multer.File[]; avatar?: Express.Multer.File[] }
): Promise<IPet | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid pet ID");
  }

   if (files?.images && files.images.length > 0) {
    const uploadResults = await Promise.all(
      files.images.map((file) =>
        imagekit.upload({
          file: file.buffer.toString("base64"),
          fileName: file.originalname,
          folder: "/pet-image",
        })
      )
    );
    const newUrls = uploadResults.map((r) => r.url);
    data.images = newUrls;
  }

  if (files?.avatar && files.avatar.length > 0) {
    const avatarResult = await imagekit.upload({
      file: files.avatar[0].buffer.toString("base64"),
      fileName: files.avatar[0].originalname,
      folder: "/pet-avatar",
    });
    data.avatar = avatarResult.url;
  }


  return Pet.findByIdAndUpdate(id, data, { new: true });
};

export const softDeletePetById = (id: string) =>
  Pet.findByIdAndUpdate(id, { isAdopted: true }, { new: true });

export const searchPets = async (filters: {
    breed?: string;
    gender?: string;
    color?: string;
    isAdopted?: boolean;
    address?: string;
    age?: string;
}) => {
    try {
        const query: any = { isDeleted: false };

        // Tìm kiếm theo giống
        if (filters.breed) {
            query.breed = { $regex: new RegExp(filters.breed, 'i') };
        }

        // Tìm kiếm theo giới tính
        if (filters.gender) {
            query.gender = filters.gender.toLowerCase();
        }

        // Tìm kiếm theo màu sắc
        if (filters.color) {
            query.color = { $regex: new RegExp(filters.color, 'i') };
        }

        // Tìm kiếm theo trạng thái nhận nuôi
        if (filters.isAdopted !== undefined) {
            query.isAdopted = filters.isAdopted;
        }

        // Tìm kiếm theo địa chỉ
        if (filters.address) {
            query.address = { $regex: new RegExp(filters.address, 'i') };
        }

        // Tìm kiếm theo tuổi
        if (filters.age) {
            query.age = { $regex: new RegExp(filters.age, 'i') };
        }

        console.log('Search query:', JSON.stringify(query, null, 2));

        const pets = await Pet.find(query)
            .sort({ createdAt: -1 })
            .populate('shelterId', 'name address phone email');

        console.log(`Found ${pets.length} pets matching the criteria`);

        return pets;
    } catch (error) {
        console.error('Error in searchPets:', error);
        throw error;
    }
};

// Lấy tất cả pet theo shelterId (userId)
export const getPetsByUserId = (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }
  return Pet.find({ shelterId: userId, isAdopted: false })
    .sort({ createdAt: -1 })
    .populate('shelterId', 'name address phone email');
};