import mongoose from "mongoose";

const ProductSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Product Name is Required "],
    },
    description: {
      type: String,
      required: [true, "Product description is Required "],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required "],
      default: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required "],
      default: 0,
    },
    productImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
