import mongoose, { Document, Schema } from "mongoose";

export interface IPetWishlist extends Document {
  user: mongoose.Types.ObjectId;
  pet: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PetWishlistSchema = new Schema<IPetWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Đảm bảo mỗi cặp (user, pet) chỉ tồn tại một lần
PetWishlistSchema.index({ user: 1, pet: 1 }, { unique: true });

export default mongoose.model<IPetWishlist>(
  "PetWishlist",
  PetWishlistSchema
);
