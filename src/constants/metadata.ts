import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Template Web App",
    template: "%s | Template Web App",
  },
  description:
    "A modern Next.js 16 starter template with TypeScript, Firebase Authentication, i18n, shadcn/ui components and TanStack Query — built for fast development.",
  keywords: [
    "Next.js",
    "Next.js 16",
    "TypeScript",
    "Firebase Authentication",
    "i18n",
    "shadcn/ui",
    "TanStack Query",
    "React",
    "Starter Template",
  ],
  authors: [{ name: "Thong Dang", url: "https://github.com/thongdn-it" }],
  publisher: "Thong Dang",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
  ),
  applicationName: "Template Web App",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    title: "Template Web App",
    description:
      "A modern Next.js starter template with TypeScript, Firebase Authentication, i18n, shadcn/ui components and TanStack Query — built for fast development.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    siteName: "Template Web App",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/web-app-manifest-192x192.png`,
        width: 1200,
        height: 630,
        alt: "Template Web App — Open Graph Image",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Template Web App",
    description:
      "Next.js starter template with TypeScript, Firebase Auth, i18n and shadcn/ui components.",
    creator: "@thongdn_it",
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/web-app-manifest-192x192.png`,
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

const metadataWithViewport = {
  metadata,
  viewport,
};

export default metadataWithViewport;
