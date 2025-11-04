import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    inTheBox: v.array(v.object({ quantity: v.number(), item: v.string() })),
    imageUrl: v.string(),
    gallery: v.array(v.string()),
    category: v.string(),
    moreLikeThis: v.optional(v.array(v.string())),
    stock: v.number(),
    price: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
  }),
  cart: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    createdAt: v.string(),
  }).index("by_user_product", ["userId", "productId"]),

  orders: defineTable({
    createdAt: v.string(),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
    }),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        subtotal: v.number(),
      })
    ),
    total: v.number(),
    status: v.string(),
  }).index("by_createdAt", ["createdAt"]),
})
