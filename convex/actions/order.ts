// convex/actions/order.ts
"use node"

import { action } from "../_generated/server"
import { v } from "convex/values"
import { Resend } from "resend"
import { api } from "../_generated/api"

interface OrderItem {
  productId: string
  quantity: number
  subtotal: number
}

interface Order {
  _id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  items: OrderItem[]
  total: number
  status: string
  createdAt: string
}

export const sendOrderCompletedEmail = action({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, { orderId }) => {
    try {
      // ✅ Fetch order document using a query
      const order = (await ctx.runQuery(api.functions.checkout.getOrderById, {
        orderId,
      })) as Order | null

      if (!order) {
        throw new Error("Order not found")
      }

      // ✅ Setup Resend - make sure RESEND_API_KEY is set
      const resend = new Resend(process.env.RESEND_API_KEY)

      // ✅ Fetch product names in parallel (since items have productId)
      const itemNames = await Promise.all(
        order.items.map(async (item: OrderItem) => {
          try {
            const product = await ctx.runQuery(
              api.functions.checkout.getProductById,
              {
                productId: item.productId as any,
              }
            )
            return {
              ...item,
              name: product?.name || "Unknown product",
              price: product?.price || item.subtotal / item.quantity,
            }
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error)
            return {
              ...item,
              name: "Unknown product",
              price: item.subtotal / item.quantity,
            }
          }
        })
      )

      // ✅ Build email HTML with better formatting
      const itemsHtml = itemNames
        .map(
          (item) =>
            `<tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}x</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">€${item.price.toFixed(2)}</td>
            </tr>`
        )
        .join("")

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order, ${order.customer.name}!</h2>
          <p style="color: #666;">Your order has been successfully completed.</p>
          
          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background-color: #f9f9f9; padding: 12px; border-radius: 4px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #D87D4A;">
              Total: €${order.total.toFixed(2)}
            </p>
          </div>

          <p style="color: #666; margin-top: 20px;">We'll contact you soon when your order ships.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            If you have any questions, please contact us at support@audiophile.com
          </p>
        </div>
      `

      // ✅ Send email with proper error handling
      const emailResult = await resend.emails.send({
        from: "Audiophile <onboarding@resend.dev>", // ✅ Use Resend's onboarding domain for testing
        to: order.customer.email,
        subject: `Order Confirmed - Order #${orderId.toString().slice(-8).toUpperCase()}`,
        html: emailHtml,
      })

      console.log("📧 Resend API response:", emailResult)

      if (emailResult.error) {
        console.error("❌ Resend error:", emailResult.error)
        throw new Error(`Failed to send email: ${emailResult.error.message}`)
      }

      if (!emailResult.data?.id) {
        throw new Error("No message ID returned from Resend")
      }

      console.log(`✅ Order completion email sent to ${order.customer.email}`)
      console.log(`📧 Email Message ID: ${emailResult.data?.id}`)
      console.log(`📧 Recipient: ${order.customer.email}`)
      console.log(
        `📧 Subject: Order Confirmed - Order #${orderId.toString().slice(-8).toUpperCase()}`
      )

      return {
        success: true,
        messageId: emailResult.data?.id || "unknown",
        email: order.customer.email,
      }
    } catch (error) {
      console.error("Error in sendOrderCompletedEmail:", error)
      throw error
    }
  },
})
