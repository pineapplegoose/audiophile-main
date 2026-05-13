import { ProductList } from "../../components/product-list"
import { ShopProducts } from "../../sections/shop-products"
import { BestAudioGear } from "../../sections/best-audio-gear"
import { AnimateOnScroll } from "../../components/animate-on-scroll"

export default function About() {
    return (<>
        <div className="w-full h-[239px] flex justify-center items-center" >
            <AnimateOnScroll variant="fadeDown">
                <h1 className="text-[40px]  uppercase font-bold tracking-[1.43px]">Headphones</h1>
            </AnimateOnScroll>
        </div>
        <div className="bg-white flex flex-col justify-center items-center px-[165px]">
            <ProductList category={"headphones"} />
        </div>
        <div className="bg-white flex flex-col justify-center items-center  ">
            <ShopProducts />
            <BestAudioGear />
        </div>
    </>)
}
