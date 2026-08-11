import type { Metadata } from "next";
import { Inter, Playfair_Display, Montserrat, Oswald, Raleway, Poppins, IM_Fell_English, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import TopBar from "@/components/TopBar";
import Providers from "./providers";
import AmbientBackground from "@/components/AmbientBackground";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: 'swap',
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: 'swap',
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-stallman",
  weight: ["700"],
  display: 'swap',
});

const imFellEnglish = IM_Fell_English({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-im-fell",
  display: 'swap',
});

const brotheric = localFont({
  src: "../public/font/brotheric.regular.otf",
  variable: "--font-brotheric",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "John David | Engineer, Public Speaker & Researcher",
  description: "Official portfolio of John David - Engineer, Public Speaker, and Researcher.",
  keywords: "John David, Engineer, Public Speaker, Researcher, Ghana",
  authors: [{ name: "John David" }],
  openGraph: {
    title: "John David ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${playfair.variable} ${montserrat.variable} ${oswald.variable} ${raleway.variable} ${imFellEnglish.variable} ${brotheric.variable} ${cormorant.variable} font-sans antialiased bg-[#FDFBD4] text-[#38240D] overflow-x-hidden`}
      >
        <AmbientBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <TopBar />
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </div>
      </body>
    </html>
  );
}



