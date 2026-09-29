import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import FluidBackground from "@/components/FluidBackground";
import Navbar from "@/components/Navbar";
import PageReveal from "@/components/PageReveal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const humane = localFont({
  variable: "--font-humane",
  display: "swap",
  src: [
    { path: "../fonts/humane/Humane-Thin.woff2", weight: "100", style: "normal" },
    { path: "../fonts/humane/Humane-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../fonts/humane/Humane-Light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/humane/Humane-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/humane/Humane-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/humane/Humane-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/humane/Humane-Bold.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio site",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${humane.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FluidBackground />
        <Navbar />
        {children}
        <PageReveal />
      </body>
    </html>
  );
}
