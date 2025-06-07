"use strict";
// src/repository/petRepository.ts
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
exports.getPetsByUserId = exports.searchPets = exports.softDeletePetById = exports.updatePetById = exports.getPetById = exports.getAllPets = exports.createPet = void 0;
const Pet_1 = __importDefault(require("../model/Pet"));
const imagekit_1 = __importDefault(require("../config/imagekit"));
const mongoose_1 = require("mongoose");
const DEFAULT_PET_IMAGE_URL = "https://ik.imagekit.io/nguyenn120404/default-pet-image/download.png?updatedAt=1747539753753";
// Tạo pet mới (upload ảnh nếu có, ngược lại dùng ảnh mặc định)
const createPet = (data, files) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrls = (files === null || files === void 0 ? void 0 : files.images) && files.images.length > 0
        ? (yield Promise.all(files.images.map(f => imagekit_1.default.upload({
            file: f.buffer.toString("base64"),
            fileName: f.originalname,
            folder: "/pet-image",
        })))).map(r => r.url)
        : [DEFAULT_PET_IMAGE_URL];
    const avatarUrls = (files === null || files === void 0 ? void 0 : files.avatar) && files.avatar.length > 0
        ? (yield Promise.all(files.avatar.map(f => imagekit_1.default.upload({
            file: f.buffer.toString("base64"),
            fileName: f.originalname,
            folder: "/pet-image",
        })))).map(r => r.url)
        : [DEFAULT_PET_IMAGE_URL];
    return new Pet_1.default(Object.assign(Object.assign({}, data), { shelterId: data.shelterId && mongoose_1.Types.ObjectId.isValid(String(data.shelterId))
            ? new mongoose_1.Types.ObjectId(String(data.shelterId))
            : undefined, images: imageUrls, avatar: avatarUrls[0] })).save();
});
exports.createPet = createPet;
// Lấy tất cả pet chưa được nhận nuôi
const getAllPets = () => Pet_1.default.find({ isAdopted: false })
    .sort({ createdAt: -1 })
    .populate('shelterId', 'name address phone email');
exports.getAllPets = getAllPets;
const getPetById = (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid pet ID");
    }
    return Pet_1.default.findOne({ _id: id }).populate('shelterId');
};
exports.getPetById = getPetById;
const updatePetById = (id, data, files) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid pet ID");
    }
    if ((files === null || files === void 0 ? void 0 : files.images) && files.images.length > 0) {
        const uploadResults = yield Promise.all(files.images.map((file) => imagekit_1.default.upload({
            file: file.buffer.toString("base64"),
            fileName: file.originalname,
            folder: "/pet-image",
        })));
        const newUrls = uploadResults.map((r) => r.url);
        data.images = newUrls;
    }
    if ((files === null || files === void 0 ? void 0 : files.avatar) && files.avatar.length > 0) {
        const avatarResult = yield imagekit_1.default.upload({
            file: files.avatar[0].buffer.toString("base64"),
            fileName: files.avatar[0].originalname,
            folder: "/pet-avatar",
        });
        data.avatar = avatarResult.url;
    }
    return Pet_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updatePetById = updatePetById;
const softDeletePetById = (id) => Pet_1.default.findByIdAndUpdate(id, { isAdopted: true }, { new: true });
exports.softDeletePetById = softDeletePetById;
const searchPets = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = { isDeleted: false };
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
        const pets = yield Pet_1.default.find(query)
            .sort({ createdAt: -1 })
            .populate('shelterId', 'name address phone email');
        console.log(`Found ${pets.length} pets matching the criteria`);
        return pets;
    }
    catch (error) {
        console.error('Error in searchPets:', error);
        throw error;
    }
});
exports.searchPets = searchPets;
// Lấy tất cả pet theo shelterId (userId)
const getPetsByUserId = (userId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }
    return Pet_1.default.find({ shelterId: userId, isAdopted: false })
        .sort({ createdAt: -1 })
        .populate('shelterId', 'name address phone email');
};
exports.getPetsByUserId = getPetsByUserId;
