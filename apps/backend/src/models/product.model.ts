import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProductVariant {
  label: string; // e.g., 250g
  price: number;
  originalPrice?: number;
  isActive: boolean;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: Types.ObjectId;
  images: string[];
  variants: IProductVariant[];
  isActive: boolean;
  createdAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    label: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: { type: String, required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [{ type: String }],
    variants: [variantSchema],
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);
