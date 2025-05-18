import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPet extends Document {
  name: string;                 
  age: string;                  
  gender: "male" | "female";    
  color: string;                
  breed: string;                
  weight: string;              
  temperament: string;          
  healthStatus: string[];       
  address: string;             
  contactPhone: string;        
  story: string;                
  images: string[];             
  shelterId: Types.ObjectId;   
  isAdopted: boolean;           
  createdAt: Date;
  updatedAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    name:          { type: String, required: true },
    age:           { type: String, required: true },
    gender:        { type: String, enum: ["male", "female"], required: true },
    color:         { type: String, required: true },
    breed:         { type: String, required: true },
    weight:        { type: String, required: true },
    temperament:   { type: String, required: true },
    healthStatus:  { type: [String], default: [] },
    address:       { type: String, required: true },
    contactPhone:  { type: String, required: true },
    story:         { type: String, required: false, maxlength: 2000 },
    images:        [{ type: String, required: false }],
    shelterId:     { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAdopted:     { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPet>("Pet", petSchema);

