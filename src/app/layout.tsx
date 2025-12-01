import "@utils";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { AppProvider, Footer, Header } from "@components";
import { defaultLng } from "@constants";

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
