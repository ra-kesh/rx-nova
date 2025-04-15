import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return []; 

    const userId = identity.subject; 
    if (!userId) throw new Error("Not authenticated");
    
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        isBox: v.boolean(),
      })
    ),
    totalAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return []; 

    const userId = identity.subject; 
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("orders", {
      userId,
      status: "pending",
      items: args.items,
      totalAmount: args.totalAmount,
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.orderId, { status: args.status });
  },
});

