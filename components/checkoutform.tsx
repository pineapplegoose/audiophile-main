'use client'
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../convex/_generated/api";
import { OrderSuccess } from "./order-success";

type CheckoutFormValues = {
    name: string;
    email: string;
    phone: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    payment: "eMoney" | "cash";
    eMoneyNumber?: string;
    eMoneyPin?: string;
};

export default function CheckoutForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<CheckoutFormValues>({
        defaultValues: { payment: "eMoney" },
    });

    const cartItems = useQuery(api.functions.cart.getCartItems, { userId: "guest" });

    const paymentMethod = watch("payment");
    const createOrder = useMutation(api.functions.checkout.createOrder);
    const completeOrder = useMutation(api.functions.checkout.completeOrder);
    const clearCart = useMutation(api.functions.cart.emptyCart);

    const [loading, setLoading] = useState(false);

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [successData, setSuccessData] = useState<{
        orderId: string;
        total: number;
        email: string;
    } | null>(null);

    const onSubmit = async (data: CheckoutFormValues) => {
        setLoading(true);
        try {
            if (!cartItems || cartItems.length === 0) {
                alert("Your cart is empty!");
                setLoading(false);
                return;
            }

            // Filter out invalid items
            const orderItems = cartItems
                .filter(item => item.product?._id && item.product?.price)
                .map(item => {
                    console.log("Cart item:", {
                        productId: item.product?._id,
                        productIdType: typeof item.product?._id,
                        quantity: item.quantity,
                        subtotal: item.quantity * item.product!.price!,
                    })
                    return {
                        productId: item.product!._id,
                        quantity: item.quantity,
                        subtotal: item.quantity * item.product!.price!,
                    }
                });

            if (orderItems.length === 0) {
                throw new Error("No valid items in cart");
            }

            const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

            console.log("📦 Creating order with items:", {
                items: orderItems,
                total,
                customerName: data.name,
                customerEmail: data.email,
            });

            // ✅ Step 1: Create order and wait for orderId
            const orderId = await createOrder({
                customer: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone || undefined
                },
                items: orderItems,
                total,
            });

            console.log("📦 Order created with ID:", orderId, "Type:", typeof orderId);

            // ✅ Check if orderId is valid (Convex returns strings for IDs)
            if (!orderId || typeof orderId !== "string") {
                console.error("Invalid orderId received:", orderId);
                throw new Error("Failed to create order - invalid ID received");
            }

            console.log("✅ Starting order completion...");

            // ✅ Step 2: Complete the order
            await completeOrder({ orderId });

            console.log("✅ Order completed, clearing cart...");

            // ✅ Step 3: Clear the cart
            await clearCart({ userId: "guest" });

            // ✅ Reset form after successful order
            reset();

            console.log("✅ Checkout process complete!");

            // ✅ Show success popup instead of alert
            setSuccessData({
                orderId,
                total,
                email: data.email,
            });
            setShowSuccessPopup(true);
        } catch (error) {
            console.error("❌ Checkout error:", error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(`❌ Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-row-reverse gap-8"
            >
                {/* Summary Section */}
                <div className="flex flex-col h-fit p-9 bg-white rounded-lg shadow-md">
                    <div className="p-5 text-black">
                        <p className="text-[18px] font-bold tracking-[1.3px] uppercase mb-6">
                            Order Summary
                        </p>
                        <div className="space-y-4">
                            {cartItems?.map((item) => {
                                if (!item?.product) {
                                    return <div key={item?._id}>No items</div>
                                }
                                return (
                                    <div className="flex items-start justify-between" key={item._id}>
                                        <div className="flex gap-4">
                                            <img
                                                src={item.product.imageUrl}
                                                className="w-16 h-16 rounded-lg object-cover"
                                                alt={item.product.name}
                                            />
                                            <div>
                                                <p className="text-[15px] font-bold uppercase w-[105px] truncate">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-[#00000079] font-bold">
                                                    €{item.product.price}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-[#00000079]">
                                            {item.quantity}x
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !cartItems || cartItems.length === 0}
                        className="w-full bg-[#D87D4A] text-white py-3 uppercase font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Processing..." : "Continue & Pay"}
                    </button>
                </div>

                {/* Checkout Form */}
                <div className="flex-1 max-w-3xl bg-white p-8 rounded-xl shadow-md space-y-8">
                    <h1 className="text-3xl font-bold tracking-wide">Checkout</h1>

                    {/* Billing Details */}
                    <section>
                        <h2 className="text-lg font-semibold text-orange-500 mb-4">
                            Billing Details
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 font-bold">Name</label>
                                <input
                                    {...register("name", { required: "Name is required" })}
                                    type="text"
                                    placeholder="Alexei Ward"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-bold">
                                    Email Address
                                </label>
                                <input
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^@]+@[^@]+\.[^@]+$/,
                                            message: "Enter a valid email",
                                        },
                                    })}
                                    type="email"
                                    placeholder="alexei@mail.com"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm mb-1 font-bold">
                                    Phone Number
                                </label>
                                <input
                                    {...register("phone", { required: "Phone number is required" })}
                                    type="tel"
                                    placeholder="+1 202-555-0136"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Shipping Info */}
                    <section>
                        <h2 className="text-lg font-semibold text-orange-500 mb-4">
                            Shipping Info
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-sm mb-1 font-bold">Address</label>
                                <input
                                    {...register("address", { required: "Address is required" })}
                                    type="text"
                                    placeholder="1137 Williams Avenue"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.address && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-bold">ZIP Code</label>
                                <input
                                    {...register("zip", { required: "ZIP code is required" })}
                                    type="text"
                                    placeholder="10001"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.zip && (
                                    <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-bold">City</label>
                                <input
                                    {...register("city", { required: "City is required" })}
                                    type="text"
                                    placeholder="New York"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1 font-bold">Country</label>
                                <input
                                    {...register("country", { required: "Country is required" })}
                                    type="text"
                                    placeholder="United States"
                                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.country.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Payment Details */}
                    <section>
                        <h2 className="text-lg font-semibold text-orange-500 mb-4">
                            Payment Details
                        </h2>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <p className="font-medium mb-2 sm:mb-0">Payment Method</p>
                            <div className="space-y-2">
                                <label className="flex items-center font-bold gap-3 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50">
                                    <input
                                        {...register("payment")}
                                        type="radio"
                                        value="eMoney"
                                        defaultChecked
                                    />
                                    e-Money
                                </label>
                                <label className="flex items-center font-bold gap-3 border rounded-md px-3 py-2 cursor-pointer hover:bg-gray-50">
                                    <input {...register("payment")} type="radio" value="cash" />
                                    Cash on Delivery
                                </label>
                            </div>
                        </div>
                        {paymentMethod === "eMoney" && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1 font-bold">
                                        e-Money Number
                                    </label>
                                    <input
                                        {...register("eMoneyNumber", {
                                            required: "e-Money number is required",
                                        })}
                                        type="text"
                                        placeholder="238521993"
                                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                    />
                                    {errors.eMoneyNumber && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.eMoneyNumber.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 font-bold">
                                        e-Money PIN
                                    </label>
                                    <input
                                        {...register("eMoneyPin", {
                                            required: "e-Money PIN is required",
                                        })}
                                        type="password"
                                        placeholder="6891"
                                        className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D87D4A] h-14 font-bold"
                                    />
                                    {errors.eMoneyPin && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.eMoneyPin.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {paymentMethod === "cash" && (
                            <div className="mt-4 flex items-start gap-3 text-sm text-gray-600">
                                <img
                                    src="/assets/checkout/icon-cash-on-delivery.svg"
                                    alt="Cash Icon"
                                    className="w-10 h-10 shrink-0"
                                />
                                <p>
                                    The 'Cash on Delivery' option enables you to pay in cash when our delivery courier arrives at your residence. Just make sure your address is correct so that your order will not be cancelled.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </form>
        </>
    );
}