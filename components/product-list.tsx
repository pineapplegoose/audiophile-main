'use client'
import { useQuery } from "convex/react"
import { api } from "../convex/_generated/api"
import Link from "next/link"

export const ProductList = ({ category }: { category: string }) => {
    const products = useQuery(api.functions.getProducts.getProductsByCategory, { category })
    if (products === undefined) return <p className="text-black text-[24px] tracking-widest">Loading...</p>;
    if (products.length === 0) return <p className="text-black text-[24px] tracking-widest">No products found.</p>;

    return (
        <div className="grid grid-cols-1 mb-0 gap-10">
            {products.map((product) => (
                <div key={product._id} className="flex group even:flex-row-reverse mt-40 justify-center items-center">
                    <img className="w-[540px] h-[560px] " src={product.imageUrl} alt="" />
                    <div className=" w-[445px] group-odd:ml-[125px] group-even:mr-[125px] ">
                        <p className="text-black text-[40px] font-bold uppercase mb-5 tracking-[1.43px]">{product.name}</p>
                        <p className="text-[#00000079] ">{product.description}</p>
                        <Link href={`/products/${product._id}`}><button className="bg-[#D87D4A] mt-8 hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] font-bold uppercase w-40 h-12">See Product</button></Link>
                    </div>
                </div>
            ))}
        </div>)

}