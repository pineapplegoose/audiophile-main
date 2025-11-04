import { RiFacebookBoxFill, RiFacebookFill, RiInstagramFill, RiInstagramLine, RiTwitterFill } from "react-icons/ri";

export const Footer = () => {
    return (
        <footer className="flex h-[365px] px-[165px]  w-full items-center justify-center">
            <div className="flex w-full ">
                <div>
                    <img src="/Audiophile-logo.png" className="w-[143px] mb-[24px]" alt="" />
                    <p className="w-[540px] text-[15px] text-white opacity-50">Audiophile is an all in one stop to fulfill your audio needs. We're a small team of music lovers and sound specialists who are devoted to helping you get the most out of personal audio. Come and visit our demo facility - we’re open 7 days a week.</p>
                    <p className="text-white font-bold opacity-50 mt-14">Copyright 2021. All Rights Reserved</p>
                </div>
                <div className="ml-[141px]">
                    <ul className='flex gap-9'>
                        <li className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Home</li>
                        <li className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Headphones</li>
                        <li className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Speakers</li>
                        <li className='text-[13px] hover:text-[#D87D4A] hover:cursor-pointer uppercase font-bold font tracking-[2px]'>Earphones</li>
                    </ul>
                    <div className=" mt-[105px] place-self-end flex">
                        <RiFacebookBoxFill size={'24px'} className="mx-1" />
                        <RiTwitterFill size={'24px'} className="mx-1" />
                        <RiInstagramLine size={'24px'} className="mx-1" />
                    </div>
                </div>
            </div>
        </footer>
    );
};