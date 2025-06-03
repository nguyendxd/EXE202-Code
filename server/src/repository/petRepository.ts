// src/repository/petRepository.ts

import Pet, { IPet } from "../model/Pet";
import imagekit from "../config/imagekit";
import { Types } from "mongoose";

const DEFAULT_PET_IMAGE_URL =
  "https://ik.imagekit.io/nguyenn120404/default-pet-image/download.png?updatedAt=1747539753753";

// Tạo pet mới (upload ảnh nếu có, ngược lại dùng ảnh mặc định)
export const createPet = async (
  data: Partial<IPet>,
  files?: Express.Multer.File[]
): Promise<IPet> => {
  const imageUrls = files && files.length > 0
    ? (await Promise.all(
        files.map(f =>
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
  }).save();
};

// Lấy tất cả pet chưa được nhận nuôi
export const getAllPets = () =>
  Pet.find({ isAdopted: false });

export const getPetById = (id: string) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid pet ID");
    }
    return Pet.findOne({ _id: id });
};

export const updatePetById = async (
  id: string,
  data: Partial<IPet>,
  files?: Express.Multer.File[]
): Promise<IPet | null> => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid pet ID");
  }

  if (files && files.length > 0) {
    const uploadResults = await Promise.all(
      files.map((file) =>
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


  return Pet.findByIdAndUpdate(id, data, { new: true });
};

export const softDeletePetById = (id: string) =>
  Pet.findByIdAndUpdate(id, { isAdopted: true }, { new: true });