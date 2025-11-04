import { ProductList } from "../../components/product-list";
import { BestAudioGear } from "../../sections/best-audio-gear";
import { ShopProducts } from "../../sections/shop-products";

export default function EarphonesPage() {
    return (<>
        <div className="w-full h-[239px] flex justify-center items-center" >
            <h1 className="text-[40px] uppercase font-bold tracking-[1.43px]">Earphones</h1>
        </div>
        <div className="bg-white flex flex-col justify-center items-center px-[165px]">
            <ProductList category={"earphones"} />
        </div>
        <div className="bg-white flex flex-col justify-center items-center  ">
            <ShopProducts />
            <BestAudioGear />
        </div>
    </>)
}