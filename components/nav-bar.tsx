'use client'
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { PiShoppingCart } from "react-icons/pi";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { Popup } from "./popup";
export const NavBar = () => {
    const cartItems = useQuery(api.functions.cart.getCartItems, { userId: "guest" });
    const addToCart = useMutation(api.functions.cart.addToCart);

    const [quantity, setQuantity] = useState(1);
    const updateCartQuantity = useMutation(api.functions.cart.updateCartQuantity);
    const ClearCart = useMutation(api.functions.cart.emptyCart);

    const handleQuantityChange = (cartItemId: string, newQty: number) => {
        updateCartQuantity({
            cartItemId: cartItemId as Id<"cart">,
            quantity: newQty,
        });
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleOpen = () => setIsPopupOpen(true);
    const handleClose = () => setIsPopupOpen(false);


    const cart = () => {
        return (
            <div className=" h-fit p-5 text-black">
                <div className="flex justify-between mb-[31px]">
                    <p className="text-[18px] text-black uppercase font-bold tracking-[1.3px] ">CART ({cartItems?.length})</p>
                    <p onClick={() => ClearCart({ userId: "guest" })} className="text-[15px] text-[#00000079] underline">Remove all</p>
                </div>
                <div>
                    {cartItems?.map((item) => {
                        if (!item) {
                            return <>No items</>
                        }
                        return (
                            <div className="flex my-4" key={item?._id}>
                                <div className="flex mr-20">
                                    <img src={item.product?.imageUrl} className="size-16 rounded-lg" alt="" />
                                    <div className="ml-4">
                                        <p className="text-[15px] font-bold uppercase w-[105px] truncate" >{item.product?.name}</p>
                                        <p className="text-[#00000079] font-bold">$ {item.product?.price}</p>
                                    </div>
                                </div>
                                <div className="flex h-12 mr-4 items-center bg-gray-100 ">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                        className="px-4 py-2 font-bold text-gray-600"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 font-bold text-gray-600">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        className="px-4 py-2 font-bold text-gray-600"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Link href={'/checkout'}><button onClick={handleClose} className="bg-[#D87D4A] hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] text-white font-bold uppercase w-full h-12">Checkout</button></Link> </div>)
    }


    return (
        <nav className='flex pt-10 bg-transparent pb-0 px-[165px] text-white justify-between items-end p-4'>
            <div className='border-b pb-10  border-[#ffffff2a] w-full flex justify-between items-center'>
                <img src={'/Audiophile-logo.png'} className='w-[143px]' alt="audiophile logo" />
                <ul className='flex gap-9'>
                    <Link href='/' className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Home</Link>
                    <Link href='/headphones' className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Headphones</Link>
                    <Link href='/speakers' className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Speakers</Link>
                    <Link href='/earphones' className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Earphones</Link>
                </ul>
                <div onClick={handleOpen}><PiShoppingCart className='text-2xl' /></div>
            </div>

            {isPopupOpen && <Popup children={cart()} onClose={handleClose} />}
        </nav>
    )
}

