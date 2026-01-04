import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScanIt - Verify Before You Buy",
  description: "Nigeria's product authentication platform. Scan any product to verify its authenticity and protect yourself from counterfeits.",
  keywords: ["product verification", "counterfeit", "fake products", "Nigeria", "barcode scanner", "authenticity"],
  openGraph: {
    title: "ScanIt - Verify Before You Buy",
    description: "Scan products to verify authenticity. Fight counterfeits together.",
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
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
