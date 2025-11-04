import { Id } from "../_generated/dataModel"
import { mutation, query } from "../_generated/server"
import { v } from "convex/values"

export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async ({ db }, { userId, productId, quantity }) => {
    // Check if the product is already in the user's cart
    const existingItem = await db
      .query("cart")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("productId"), productId)
        )
      )
      .first()

    if (existingItem) {
      // ✅ Update the quantity
      await db.patch(existingItem._id, {
        quantity: existingItem.quantity + quantity,
      })
      return
    }

    // ✅ Otherwise, create new cart item
    await db.insert("cart", {
      userId,
      productId,
      quantity,
      createdAt: new Date().toISOString(),
    })
  },
})

// ✅ Update quantity directly (for +/- buttons)
export const updateCartQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async ({ db }, { cartItemId, quantity }) => {
    const item = await db.get(cartItemId)
    if (!item) return

    if (quantity <= 0) {
      // Remove item if quantity hits 0
      await db.delete(cartItemId)
    } else {
      await db.patch(cartItemId, { quantity })
    }
  },
})

export const emptyCart = mutation({
  args: { userId: v.string() },
  handler: async ({ db }, { userId }) => {
    const items = await db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()

    for (const item of items) {
      await db.delete(item._id as Id<"cart">)
    }
    return { message: "Cart emptied successfully" }
  },
})

export const removeFromCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("cart")
      .withIndex("by_user_product", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first()

    if (!item) return null

    await ctx.db.delete(item._id)
    return item._id
  },
})

export const getCartItems = query({
  args: {
    userId: v.string(),
  },
  handler: async ({ db }, { userId }) => {
    const cartItems = await db
      .query("cart")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect()

    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        // Ensure productId is correctly typed
        const productId = item.productId as Id<"products"> | undefined
        const product = productId ? await db.get(productId) : null
        return { ...item, product }
      })
    )

    return itemsWithProducts
  },
})

/**
 * Compute total cost of items in an order
 */
export function calcTotal(items: { quantity: number; subtotal: number }[]) {
  return items.reduce((sum, item) => sum + item.subtotal, 0)
}
