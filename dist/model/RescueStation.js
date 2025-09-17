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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Schema definition
const RescueStationSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'Station name is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [false, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        required: [false, 'Email is required'],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function (coords) {
                    return coords.length === 2 &&
                        coords[0] >= -180 && coords[0] <= 180 && // longitude
                        coords[1] >= -90 && coords[1] <= 90; // latitude
                },
                message: 'Invalid coordinates'
            }
        }
    },
    images: [{
            type: String,
            trim: true
        }],
    operatingHours: {
        type: Map,
        of: {
            open: String,
            close: String
        },
        default: {
            monday: { open: '09:00', close: '17:00' },
            tuesday: { open: '09:00', close: '17:00' },
            wednesday: { open: '09:00', close: '17:00' },
            thursday: { open: '09:00', close: '17:00' },
            friday: { open: '09:00', close: '17:00' },
            saturday: { open: '09:00', close: '17:00' },
            sunday: { open: '09:00', close: '17:00' }
        }
    },
    services: [{
            type: String,
            trim: true
        }],
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Create 2dsphere index for geospatial queries
RescueStationSchema.index({ location: '2dsphere' });
// Create text index for search functionality
RescueStationSchema.index({
    name: 'text',
    address: 'text',
    description: 'text'
});
const RescueStation = mongoose_1.default.model('RescueStation', RescueStationSchema);
exports.default = RescueStation;
