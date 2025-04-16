import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.isAdmin) {
      throw new Error("Unauthorized: Only admins can view all orders");
    }
    return await ctx.db.query("issues").collect();
  },
});

export const create = mutation({
  args: {
    orderId: v.id("orders"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return []; 

    const userId = identity.subject; 

    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);

    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Not authorized");
    if (order.status !== "completed") throw new Error("Can only report issues for completed orders");

    return await ctx.db.insert("issues", {
      orderId: args.orderId,
      userId,
      description: args.description,
      status: "open",
      createdAt: Date.now(),
    });
  },
});

export const listByOrder = query({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return []; 

    const userId = identity.subject; 

    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);

    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Not authorized");

    return await ctx.db
      .query("issues")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();
  },
});



export const updateStatus = mutation({
  args: {
    issueId: v.id("issues"),
    status: v.union(
      v.literal("open"),
      v.literal("in_review"),
      v.literal("resolved")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.isAdmin) {
      throw new Error("Unauthorized: Only admins can uppdate status of issues");
    }
    return await ctx.db.patch(args.issueId, { status: args.status });
  },
});
