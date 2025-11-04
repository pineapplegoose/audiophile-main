'use client'
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import CheckoutForm from "../../components/checkoutform";

export default function CartPage() {
    const cartItems = useQuery(api.functions.cart.getCartItems, { userId: "guest" });
    return (

        <div className=" bg-[#F1F1F1] text-black px-[165px]">
            <CheckoutForm />
        </div>)
}