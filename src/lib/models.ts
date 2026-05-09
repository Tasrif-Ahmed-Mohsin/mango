import mongoose from "mongoose";

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      zip: String,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totals: {
      subtotal: Number,
      shipping: Number,
      tax: Number,
      total: Number,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: String,
    description: String,
    icon: String,
    image: String,
    bgColor: String,
  },
  {
    timestamps: true,
  }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    categoryId: {
      type: String,
      index: true,
    },
    name: String,
    price: Number,
    description: String,
    stock: Number,
    unit: String,
    farmer: String,
    image: String,
    emoji: String,
    tag: String,
    tagColor: String,
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
