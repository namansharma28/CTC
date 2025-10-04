import type { Metadata } from "next";

const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: "CTC – Discover, Join & Create Communities and Events",
  description:
    "CTC is your all-in-one community and event management platform. Discover vibrant communities, explore upcoming events, connect with like-minded people, and create meaningful experiences. Join CTC to build, share, and grow together.",
  keywords: [
    "CTC",
    "community platform",
    "event management",
    "online communities",
    "social events",
    "group activities",
    "networking platform",
    "connect with people",
    "discover events",
    "create events",
    "community building",
    "event organization",
    "social networking",
    "interest groups",
    "local events",
    "online groups",
    "event discovery",
    "community engagement",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "CTC – Discover, Join & Create Communities and Events",
    description:
      "CTC is your all-in-one community and event management platform. Discover vibrant communities, explore upcoming events, connect with like-minded people, and create meaningful experiences. Join CTC to build, share, and grow together.",
    url: baseUrl,
    siteName: "CTC",
    images: [
      {
        url: `${baseUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "CTC Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CTC – Discover, Join & Create Communities and Events",    description:
      "CTC is your all-in-one community and event management platform. Discover vibrant communities, explore upcoming events, connect with like-minded people, and create meaningful experiences. Join CTC to build, share, and grow together.",
    images: [`${baseUrl}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: `${baseUrl}/manifest.json`,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
};
