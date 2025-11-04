'use client';
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import { ShopProducts } from "../../../sections/shop-products";
import { BestAudioGear } from "../../../sections/best-audio-gear";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";


export default function ProductPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const product = useQuery(api.functions.getProducts.getProductById, id ? { _id: id } : "skip");

    const addToCart = useMutation(api.functions.cart.addToCart);

    const [quantity, setQuantity] = useState(1);



    const relatedProducts = useQuery(
        api.functions.getProducts.getRelatedProducts,
        product?.moreLikeThis?.length
            ? { ids: product.moreLikeThis.map(id => id as Id<"products">) }
            : "skip"
    );
    if (!product) {
        return <div className="bg-white p-10 text-center">Product not found.</div>;
    }
    const handleAddToCart = async () => {
        await addToCart({
            userId: "guest", // replace later with actual user id when auth is ready
            productId: product._id,
            quantity,
        });
        alert(`${quantity} item(s) added to cart!`);
    };
    return (
        <div className="bg-white text-black ">
            <Link className="px-[165px] text-[#00000079] py-14" href={'/'}>Go Back</Link>
            <div className="px-[165px]">
                <section className="flex justify-center items-center h-fit">
                    <img className="w-[540px] h-[560px]" src={product?.imageUrl} alt="" />
                    <div className="w-[445px] h-full flex flex-col justify-center ml-[125px]">
                        {product?.name === "XX99 Mark II Headphones" && <p className="text-[14px] text-[#D87D4A] leading-[100%] tracking-[10px] uppercase mb-4 ">New Product</p>}
                        <p className="text-black text-[40px] font-bold uppercase mb-5 tracking-[1.43px]">{product?.name}</p>
                        <p className="text-[#00000079] ">{product?.description}</p>
                        <p className="text-[18px] my-8 font-bold tracking-[1.3px]">${product?.price}</p>
                        <div className="flex items-end">
                            <div className="flex h-12 mr-4 items-center bg-gray-100 ">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="px-4 py-2 font-bold text-gray-600"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min={1}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setQuantity(isNaN(val) || val < 1 ? 1 : val);
                                    }}
                                    className="w-12 text-center bg-transparent border-none outline-none font-semibold"
                                />
                                <button
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="px-4 py-2 font-bold text-gray-600"
                                >
                                    +
                                </button>
                            </div>
                            <button onClick={handleAddToCart} className="bg-[#D87D4A] text-white mt-8 hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] font-bold uppercase w-40 h-12">Add to cart</button>
                        </div>
                    </div>

                </section>
                <section className="flex justify-center  h-fit my-[120px] ">
                    <div className="w-[635px] mr-[125px]">
                        <h3 className="text-3xl font-bold tracking-[1.14px] uppercase">Features</h3>
                        <div className="text-[#00000079] text-[15px]">{product?.features.map((feature: string, index: number) => <p className="my-4 leading-[25px]" key={index}>{feature}</p>)}</div>
                    </div>
                    <div className="w-[350px] ">
                        <h3 className="text-3xl font-bold tracking-[1.14px] uppercase">In the box</h3>
                        <ul>
                            {product?.inTheBox.map((item: { quantity: number; item: string }) =>
                                <li className="flex text-[15px] leading-[25px] my-1 " key={item.item}>
                                    <p className="text-[#D87D4A] font-bold mr-6">{item.quantity}x</p>
                                    <p>{item.item}</p>
                                </li>
                            )}
                        </ul>
                    </div>
                </section>
                <section className="flex justify-center items-center">
                    <div className="flex h-fit mb-24">
                        <div>
                            <img className="rounded-lg mb-8 mr-4" src={product?.gallery[0]} alt="" />
                            <img className="rounded-lg mt-8 mr-4" src={product?.gallery[1]} alt="" />
                        </div>
                        <img className="rounded-lg h-full  ml-4" src={product?.gallery[2]} alt="" />
                    </div>
                </section>
                <section className="flex justify-center items-center">
                    {relatedProducts && relatedProducts.length > 0 && (
                        <section className="my-24">
                            <h3 className="text-3xl text-center font-bold uppercase mb-16">You may also like</h3>
                            <div className="grid grid-cols-3 gap-8">
                                {relatedProducts.map((rp) => (
                                    <Link key={rp?._id} href={`/products/${rp?._id}`}>
                                        <div className="flex flex-col items-center">
                                            <img src={rp?.imageUrl} alt={rp?.name} className="rounded-lg w-[350px] mb-4" />
                                            <p className="text-lg my-10 font-bold uppercase">{rp?.name}</p>
                                            <button className="bg-[#D87D4A] text-white hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] font-bold uppercase w-40 h-12">See Product</button>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                </section>
            </div>
            <ShopProducts />
            <BestAudioGear />

        </div>)
}