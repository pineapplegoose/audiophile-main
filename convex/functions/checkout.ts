// convex/functions/checkout.ts
import { query, mutation } from "../_generated/server"
import { v } from "convex/values"
import { api } from "../_generated/api"

export const createOrder = mutation({
  args: {
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
  },
  handler: async (ctx, { customer, items, total }) => {
    try {
      if (!items || items.length === 0) {
        throw new Error("Order must have at least one item")
      }

      console.log("📝 Inserting order:", {
        customer,
        itemCount: items.length,
        total,
      })

      for (const item of items) {
        const product = await ctx.db.get(item.productId)
        if (!product) {
          throw new Error(`Product ${item.productId} not found`)
        }
      }

      const orderData = {
        customer,
        items,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      const orderId = await ctx.db.insert("orders", orderData)

      console.log("✅ Order inserted with ID:", orderId)

      if (!orderId) {
        throw new Error("Failed to insert order into database - no ID returned")
      }

      const verifyOrder = await ctx.db.get(orderId)
      if (!verifyOrder) {
        throw new Error("Order was not persisted in database")
      }

      console.log("✅ Order verified in database")
      return orderId
    } catch (error) {
      console.error("❌ Error in createOrder:", error)
      throw error
    }
  },
})

export const listOrdersByCustomer = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("customer.email"), email))
      .collect()

    return orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },
})

export const completeOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    try {
      console.log("🔄 Starting completeOrder for:", orderId)

      const order = await ctx.db.get(orderId)
      if (!order) {
        throw new Error("Order not found")
      }

      console.log("✅ Order found, updating status to completed")

      await ctx.db.patch(orderId, {
        status: "completed",
      })

      console.log("✅ Order status updated, scheduling email...")

      // ✅ Schedule email with 1 second delay to ensure data is persisted
      await ctx.scheduler.runAfter(
        1000,
        api.actions.order.sendOrderCompletedEmail,
        {
          orderId,
        }
      )

      console.log("✅ Email scheduled successfully")

      return { success: true, total: order.total }
    } catch (error) {
      console.error("❌ Error in completeOrder:", error)
      throw error
    }
  },
})

export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    return await ctx.db.get(orderId)
  },
})

export const getProductById = query({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    return await ctx.db.get(productId)
  },
})
