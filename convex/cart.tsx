import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return []; 
  
      const userId = identity.subject; 

      const cart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();
  
      return cart.length > 0 ? cart[0].items : [];
    },
  });


  export const update = mutation({
    args: {
      items: v.array(
        v.object({
          productId: v.id("products"),
          quantity: v.number(),
          isBox: v.boolean(),
        })
      ),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

      if (!identity) throw new Error("Not authenticated");

      const userId = identity.subject; 
  
      const existingCart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
  
      if (existingCart) {
        await ctx.db.patch(existingCart._id, { items: args.items });
      } else {
        await ctx.db.insert("cart", {
          userId,
          items: args.items,
        });
      }
    },
  });


  export const clear = mutation({
    args: {},
    handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Not authenticated");

      const userId = identity.subject; 
  
      const existingCart = await ctx.db
        .query("cart")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .first();
  
      if (existingCart) {
        await ctx.db.patch(existingCart._id, { items: [] });
      }
    },
  });
  