'use client';
import { useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../convex/_generated/api";

export const Hero = () => {
    const id = 'j97fpwsfw64n3k1mk9fhpmrme57tr7s8';
    const product = useQuery(api.functions.getProducts.getProductById, id ? { _id: id } : "skip");

    return (
        <div className="flex justify-start w-full h-[632px] items-center bg-transparent">
            <div className="z-10 w-[400px] ml-[165px]">
                <p className="text-[14px] mb-6 text-[#FFFFFF] opacity-50 tracking-[10px] ">NEW PRODUCT</p>
                <h1 className="text-[56px] mb-6 font-bold uppercase leading-[58px]">XX99 Mark II Headphones</h1>
                <p className="text-[#FFFFFF] mb-10 text-[15px] w-[349px] opacity-75">Experience natural, lifelike audio and exceptional build quality made for the passionate music enthusiast.</p>
                <Link key={product?._id} href={`/products/${product?._id}`}><button className="bg-[#D87D4A] hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] font-bold uppercase w-40 h-12">See Product</button></Link>
            </div>
            <img src={'/assets/home/desktop/image-hero.jpg'} className="absolute -z-10 inset-0 w-full h-full object-cover" alt="hero" />
        </div>
    );
};