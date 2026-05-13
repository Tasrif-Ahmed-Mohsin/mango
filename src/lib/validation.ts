import { z } from "zod";

// Category Validation Schema
export const categorySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bgColor: z.string().optional(),
});

// Product Validation Schema
export const productSchema = z.object({
  id: z.string().min(1, "ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().optional(),
  stock: z.number().nonnegative("Stock cannot be negative").default(0),
  unit: z.string().min(1, "Unit is required"),
  farmer: z.string().min(2, "Farmer name must be at least 2 characters"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  emoji: z.string().optional(),
});

// Order Item Validation Schema
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be greater than 0"),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

// Order Validation Schema
export const orderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  customer: z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().optional(),
    zip: z.string().optional(),
  }),
  items: z.array(orderItemSchema).min(1, "At least one item is required in the order"),
  totals: z.object({
    subtotal: z.number().nonnegative(),
    shipping: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }),
  paymentMethod: z.enum(["cod", "bkash", "nagad"]).default("cod"),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).default("pending"),
});

