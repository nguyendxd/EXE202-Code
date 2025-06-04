import mongoose, { Document, Schema } from 'mongoose';

// Interface for RescueStation document
export interface IRescueStation extends Document {
    name: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    location: {
        type: string;
        coordinates: [number, number]; // [longitude, latitude]
    };
    images: string[];
    operatingHours: {
        [key: string]: {
            open: string;
            close: string;
        };
    };
    services: string[];
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Schema definition
const RescueStationSchema = new Schema<IRescueStation>(
    {
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
            required: [true, 'Phone number is required'],
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
                    validator: function(coords: number[]) {
                        return coords.length === 2 &&
                               coords[0] >= -180 && coords[0] <= 180 && // longitude
                               coords[1] >= -90 && coords[1] <= 90;    // latitude
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
    },
    {
        timestamps: true
    }
);

// Create 2dsphere index for geospatial queries
RescueStationSchema.index({ location: '2dsphere' });

// Create text index for search functionality
RescueStationSchema.index({ 
    name: 'text', 
    address: 'text', 
    description: 'text' 
});

const RescueStation = mongoose.model<IRescueStation>('RescueStation', RescueStationSchema);

export default RescueStation; 