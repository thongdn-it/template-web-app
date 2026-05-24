import "@utils";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { defaultLng } from "@constants";
import { AppProvider } from "@src/components/providers";
import Footer from "@src/components/shared/footer";
import { Header } from "@src/components/shared/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata, viewport } from "../constants/metadata";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLng} suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="TWA" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
