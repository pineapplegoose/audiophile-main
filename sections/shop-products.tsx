'use client'
import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";
import { motion } from "motion/react";

export const ShopProducts = () => {
    return (
        <div className="flex w-full h-[632px] px-[165px] mt-24 items-center bg-white">
            <div className="grid grid-cols-3 w-full text-black">
                {Categories.map((category, i) => (
                    <motion.div
                        key={category.title}
                        className="relative flex items-end justify-center h-[284px]"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5, delay: i * 0.12, ease: 'easeOut' }}
                    >
                        <div className="absolute flex flex-col justify-end h-[167px] top-0 z-10">
                            <img className="w-[123px]" src={category.img} alt="" />
                            <div className="w-[122px] h-5 bg-black blur-[23px] rounded-full" />
                        </div>
                        <div className="flex flex-col pb-5 justify-end rounded-lg bg-[#F1F1F1] h-[204px] px-28 ">
                            <p className="text-[18px] uppercase mb-3 font-bold tracking-[1.3px]">{category.title}</p>
                            <Link href={category.url} className="flex justify-center uppercase tracking-[1px] text-[#00000070] items-center">Shop<BiChevronRight size={'20px'} color="#D87D4A" /></Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

const Categories = [
    {
        img: '/assets/home/desktop/image-headphones.png',
        title: 'Headphones',
        url: '/headphones'
    },
    {
        img: '/assets/home/desktop/image-removebg-preview.png',
        title: 'Speakers',
        url: '/speakers'
    },
    {
        img: '/assets/home/desktop/image-earphones.png',
        title: 'Earphones',
        url: '/earphones'
    }
]
