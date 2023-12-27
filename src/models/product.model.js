import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    images: {
      type: Array,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Products = mongoose.model("products", productSchema);
