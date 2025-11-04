import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Link from "next/link";

export const ProductAds = () => {
    const id1 = 'j97fdym2a3ahn2qxg8q9hjw7zs7tsat0';
    const id2 = 'j97fkykdw9h36g8yvat0ewe1t97tsajr'
    const id3 = 'j97b51jrtrp2a11dvv6q0xqcmd7tsryt'

    return (
        <div className="flex flex-col items-center justify-center pb-24  bg-white">
            <div className="flex relative px-[118px] w-[1110px] mb-12 overflow-hidden rounded-lg pt-24 bg-[#D87D4A]">
                <img src='/assets/home/desktop/pattern-circles.svg' className="absolute z-0 -top-8 -left-40 " alt="" />
                <div className="flex z-10">
                    <img className="w-[410px]" src={'/assets/home/desktop/image-removebg-preview.png'} />
                    <div className="w-[349px] ml-[138px]">
                        <h1 className="text-[56px] mb-6 font-bold uppercase leading-[58px]">ZX9 SPEAKER</h1>
                        <p className="text-[#FFFFFF] mb-10 text-[15px] w-[349px] opacity-75">Upgrade to premium speakers that are phenomenally built to deliver truly remarkable sound.</p>
                        <Link key={id1} href={`/products/${id1}`}><button className="bg-black hover:bg-[#FBAF85] hover:cursor-pointer text-[13px] font-bold uppercase w-40 h-12">See Product</button>
                        </Link>
                    </div>
                </div>

            </div>
            <div className='flex px-2.5 mb-12 overflow-hidden rounded-lg pt-24 relative w-[1110px] h-80'>
                <div className=' z-10 w-[400px] ml-[95px]'>
                    <p className="text-[28px] mb-6 text-black font-bold tracking-[2px] ">ZX7 SPEAKER</p>
                    <Link key={id2} href={`/products/${id2}`}><button className="bg-transparent border border-black hover:cursor-pointer text-black text-[13px] font-bold uppercase w-40 h-12">See Product</button>
                    </Link></div>
                <img src="/assets/home/desktop/image-speaker-zx7.jpg" className=" inset-0 absolute z-0 " alt="" />
            </div>
            <div className="flex w-[1110px] relative mb-[200px] overflow-hidden rounded-lg pt-0">
                <img src="/assets/home/desktop/image-earphones-yx1.jpg" className='w-[540px] rounded-lg' alt="" />
                <div className='bg-[#F1F1F1] rounded-lg pl-[95px] py-[101px] z-10 w-[540px] ml-[30px]'>
                    <p className="text-[28px] mb-6 text-black font-bold tracking-[2px] ">YX1 EARPHONES</p>
                    <Link key={id3} href={`/products/${id3}`}><button className="bg-transparent border border-black hover:cursor-pointer text-black text-[13px] font-bold uppercase w-40 h-12">See Product</button>
                    </Link>
                </div>
            </div>





        </div>
    )
}