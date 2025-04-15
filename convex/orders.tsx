import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.isAdmin) {
      throw new Error("Unauthorized: Only admins can view all orders");
    }
    const allOrders = await ctx.db.query("orders").collect();

    return allOrders;
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    if (!userId) throw new Error("Not authenticated");

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        // Fetch product details for each item
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await ctx.db.get(item.productId);
            return {
              ...item,
              product: product
                ? {
                    _id: product._id,
                    name: product.name,
                    description: product.description,
                    pricePerUnit: product.pricePerUnit,
                    itemsPerBox: product.itemsPerBox,
                    isActive: product.isActive,
                    totalPrice: item.quantity * product.pricePerUnit,
                  }
                : null, // Handle case where product is deleted
            };
          })
        );

        return {
          ...order,
          items: itemsWithProducts,
        };
      })
    );

    return ordersWithProducts;
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
