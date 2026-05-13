import type { Metadata } from "next";
import { Manrope as Geist } from "next/font/google";
import "./globals.css";
import { NavBar } from "../components/nav-bar";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Footer } from "../components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export const metadata: Metadata = {
  title: "AudioPhile",
  description: "E-commerce for audio products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} bg-[#000000] antialiased`}
      >
        <ConvexClientProvider>
          <NavBar />
          {children}
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
