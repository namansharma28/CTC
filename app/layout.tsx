import './globals.css';
import '../styles/md-editor.css'; // Import custom MD Editor styles
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';


const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'CTC - Coding Thinker',
  description: 'Transform your future with our innovative coding education platform',
  keywords: [
    "CTC",
    "coding education",
    "programming courses",
    "web development",
    "MERN stack",
    "data analytics",
    "Java programming",
    "Python programming",
    "C++ programming",
    "coding bootcamp",
    "online learning",
    "technical skills",
    "software development",
    "coding community",
    "programming mentorship",
    "career development",
    "coding certification",
    "learn to code",
  ],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "CTC - Coding Thinker",
    description:
      "Transform your future with our innovative coding education platform. Learn from industry experts and join a community of passionate developers.",
    url: baseUrl,
    siteName: "CTC - Coding Thinker",
    images: [
      {
        url: `${baseUrl}/icons/icon-512x512.png`,
        width: 512,
        height: 512,
        alt: "CTC - Coding Thinker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CTC - Coding Thinker",
    description:
      "Transform your future with our innovative coding education platform. Learn from industry experts and join a community of passionate developers.",
    images: [`${baseUrl}/icons/icon-512x512.png`],
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
    icon: [
      { url: "/icons/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/icons/favicon.ico",
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152" },
      { url: "/icons/icon-192x192.png", sizes: "192x192" },
    ],
    other: [
      { rel: "icon", url: "/icons/icon-128x128.png", sizes: "128x128" },
      { rel: "icon", url: "/icons/icon-144x144.png", sizes: "144x144" },
      { rel: "icon", url: "/icons/icon-384x384.png", sizes: "384x384" },
      { rel: "icon", url: "/icons/icon-512x512.png", sizes: "512x512" },
    ],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f0f4fa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0e1a' },
  ],
};



// Use local Inter font files to avoid network timeouts


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <title>CTC - Coding Thinker</title>
        <link rel="icon" href="/icons/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" sizes="152x152" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" sizes="192x192" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'CTC - Coding Thinker',
              description: 'Transform your future with our innovative coding education platform',
              url: baseUrl,
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD'
              },
              author: {
                '@type': 'Organization',
                name: 'CTC - Coding Thinker',
                url: baseUrl
              },
              image: `${baseUrl}/icons/icon-512x512.png`
            })
          }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
