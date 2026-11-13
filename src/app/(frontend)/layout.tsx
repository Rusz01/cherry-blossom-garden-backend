import type { Metadata } from "next";
import {
  Inter,
  Cormorant_Garamond,
  Allura,
} from "next/font/google";

import "./globals.css";
import Footer from "@/components/frontend/footer";
import MotionProvider from "@/components/frontend/motion/motionProvider";


import { getExploreNavigation } from
    "@/lib/explore/get-pages";

import {
  ExploreNavigationProvider,
} from "@/components/frontend/explore/ExploreNavigationProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Cherry Blossom Garden",
  description: "Where Every Moment Blooms",
};

export default async function RootLayout({
                                           children,
                                         }: LayoutProps<"/">) {
  const exploreNavigation =
    await getExploreNavigation();
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorantGaramond.variable} ${allura.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
    <body className="min-h-full flex flex-col">
    {/* Without JavaScript, Motion's initial hidden styles would never clear. */}
    <noscript>
      <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
    </noscript>
    <ExploreNavigationProvider
      items={exploreNavigation}
    >
      <MotionProvider>
        {children}
        <Footer />
      </MotionProvider>
    </ExploreNavigationProvider>
    </body>
    </html>
  );
}