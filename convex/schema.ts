import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  products: defineTable({
    name: v.string(),
    description: v.string(),
    pricePerUnit: v.number(),
    itemsPerBox: v.number(),
    isActive: v.boolean(),
  }),
  
  orders: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        isBox: v.boolean(),
      })
    ),
    totalAmount: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  issues: defineTable({
    orderId: v.id("orders"),
    userId: v.id("users"),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_review"),
      v.literal("resolved")
    ),
    createdAt: v.number(),
  }).index("by_order", ["orderId"]),


  cart: defineTable({
    userId: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        isBox: v.boolean(),
      })
    ),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...applicationTables,
});
