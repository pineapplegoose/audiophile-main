import { Id } from "../_generated/dataModel"
import { query } from "../_generated/server"
import { v } from "convex/values"

export const getProductsByCategory = query({
  args: { category: v.string() },
  handler: async ({ db }, { category }) => {
    return await db
      .query("products")
      .filter((q) => q.eq(q.field("category"), category))
      .collect()
  },
})

export const getProductById = query({
  args: { _id: v.string() },
  handler: async (ctx, { _id }) => {
    return await ctx.db.get(_id as Id<"products">)
  },
})

export const getRelatedProducts = query({
  args: { ids: v.array(v.id("products")) },
  handler: async (ctx, args) => {
    const products = await Promise.all(args.ids.map((id) => ctx.db.get(id)))
    return products.filter(Boolean)
  },
})
