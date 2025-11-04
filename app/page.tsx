import { BestAudioGear } from "../sections/best-audio-gear";
import { Hero } from "../sections/hero";
import { ProductAds } from "../sections/product-ad";
import { ShopProducts } from "../sections/shop-products";

export default function Home() {
  return (
    <main className="items-center justify-center font-sans">
      <Hero />
      <ShopProducts />
      <ProductAds />
      <BestAudioGear />
    </main>
  );
}
