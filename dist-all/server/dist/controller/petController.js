"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getPetsByUserIdController = exports.searchPetsController = exports.deletePetController = exports.updatePetController = exports.getPetByIdController = exports.getAllPetsController = exports.createPetController = void 0;
const multer_1 = __importDefault(require("multer"));
const repo = __importStar(require("../repository/petRepository"));
const Pet_1 = __importDefault(require("../model/Pet"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * POST /pets
 */
const createPetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Inside createPetController');
        console.log('req.user:', req.user);
        console.log('req.user?.role:', (_a = req.user) === null || _a === void 0 ? void 0 : _a.role);
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter' && user.role !== 'customer')) {
            console.log('Permission check failed in createPetController');
            return res.status(403).json({ message: "You have no permission for this function " });
        }
        const files = req.files;
        const pet = yield repo.createPet(Object.assign(Object.assign({}, req.body), { shelterId: userId }), {
            images: (files === null || files === void 0 ? void 0 : files.images) || [],
            avatar: (files === null || files === void 0 ? void 0 : files.avatar) || []
        });
        res.status(201).json(pet);
    }
    catch (err) {
        console.error('Error in createPetController:', err);
        res.status(500).json({ error: err.message });
    }
});
exports.createPetController = createPetController;
/**
 * GET /pets
 */
const getAllPetsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pets = yield repo.getAllPets();
        res.json({
            success: true,
            data: pets,
            total: pets.length
        });
    }
    catch (err) {
        console.error('Error in getAllPetsController:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.getAllPetsController = getAllPetsController;
/**
 * GET /pets/:id
 */
const getPetByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Starting getPetByIdController');
        console.log('Request params:', req.params);
        const user = req.user;
        console.log('User in getPetByIdController:', user);
        console.log('User role:', user === null || user === void 0 ? void 0 : user.role);
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        console.log('UserId:', userId);
        console.log('Permission check passed, fetching pet with ID:', req.params.id);
        const pet = yield repo.getPetById(req.params.id);
        console.log('Pet found:', pet);
        if (!pet) {
            console.log('Pet not found for ID:', req.params.id);
            return res.status(404).json({ error: "Pet not found" });
        }
        console.log('Sending pet response:', pet);
        res.json(pet);
    }
    catch (err) {
        console.error('Error in getPetByIdController:', err);
        res.status(500).json({ error: err.message });
    }
});
exports.getPetByIdController = getPetByIdController;
/**
 * PUT /pets/:id
 */
const updatePetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== "admin" && user.role !== "shelter")) {
            res.status(403).json({ message: "You have no permission for this function" });
            return;
        }
        // Ép kiểu files đúng định dạng để xử lý riêng images và avatar
        const files = req.files;
        const updatedPet = yield repo.updatePetById(req.params.id, req.body, {
            images: (files === null || files === void 0 ? void 0 : files.images) || [],
            avatar: (files === null || files === void 0 ? void 0 : files.avatar) || [],
        });
        if (!updatedPet) {
            res.status(404).json({ error: "Pet not found" });
            return;
        }
        res.json(updatedPet);
    }
    catch (err) {
        console.error("Error in updatePetController:", err);
        res.status(500).json({ error: err.message });
    }
});
exports.updatePetController = updatePetController;
/**
 * DELETE /pets/:id
 */
const deletePetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const userId = (user === null || user === void 0 ? void 0 : user.id) || (user === null || user === void 0 ? void 0 : user.uid);
        if (!user || !userId || (user.role !== 'admin' && user.role !== 'shelter')) {
            res.status(403).json({ message: "You have no permission for this function " });
        }
        const pet = yield repo.softDeletePetById(req.params.id);
        if (!pet) {
            res.status(404).json({ error: "Pet not found" });
            return;
        }
        res.json({ message: "Pet marked as adopted" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.deletePetController = deletePetController;
/**
 * GET /pets/search
 */
const searchPetsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { breed, gender, color, address, age } = req.query;
        const query = {};
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
        const pets = yield Pet_1.default.find(query)
            .sort({ createdAt: -1 })
            .populate('shelterId', 'name address phone email');
        console.log(`Found ${pets.length} pets matching the criteria`);
        res.json({
            success: true,
            data: pets,
            total: pets.length
        });
    }
    catch (err) {
        console.error('Error in searchPetsController:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
exports.searchPetsController = searchPetsController;
/**
 * GET /pets/user/:userId
 */
const getPetsByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const pets = yield repo.getPetsByUserId(userId);
        res.json({
            success: true,
            data: pets,
            total: pets.length
        });
    }
    catch (err) {
        console.error('Error in getPetsByUserIdController:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});
exports.getPetsByUserIdController = getPetsByUserIdController;
