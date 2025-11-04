import { v } from "convex/values"
import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
  product: defineTable({
    name: v.string(),
    description: v.string(),
    features: v.array(v.string()),
    inTheBox: v.array(v.object({ quantity: v.number(), item: v.string() })),
    imageUrl: v.string(),
    gallery: v.array(v.string()),
    category: v.string(),
    moreLikeThis: v.optional(v.array(v.id("products"))),
    stock: v.number(),
    price: v.number(),
    isActive: v.boolean(),
    createdAt: v.string(),
  }),
})
