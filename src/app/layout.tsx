import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = "https://cincinnatilacrosseacademy.com"

export const metadata: Metadata = {
  // Basic SEO
  title: {
    default: "Cincinnati Lacrosse Academy | Where Leaders Are Formed",
    template: "%s | Cincinnati Lacrosse Academy"
  },
  description: "World-class lacrosse training in Cincinnati. Weekend sessions, strength training, and remote coaching. More than training—join the family. 50+ college commits.",
  keywords: [
    "Cincinnati lacrosse",
    "lacrosse training",
    "youth lacrosse Ohio",
    "lacrosse academy",
    "college lacrosse prep",
    "lacrosse coaching",
    "weekend lacrosse training",
    "strength training for lacrosse",
    "Cincinnati youth sports",
    "lacrosse camp Cincinnati"
  ],
  authors: [{ name: "Cincinnati Lacrosse Academy" }],
  creator: "Cincinnati Lacrosse Academy",
  publisher: "Cincinnati Lacrosse Academy",

  // Favicon and icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Cincinnati Lacrosse Academy",
    title: "Cincinnati Lacrosse Academy | Where Leaders Are Formed",
    description: "World-class lacrosse training in Cincinnati. Weekend sessions, strength training, and remote coaching. More than training—join the family.",
    images: [
      {
        url: `${siteUrl}/images/community/top-banner.jpg`,
        width: 4096,
        height: 2734,
        alt: "Cincinnati Lacrosse Academy athletes training together",
        type: "image/jpeg",
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Cincinnati Lacrosse Academy | Where Leaders Are Formed",
    description: "World-class lacrosse training in Cincinnati. Weekend sessions, strength training, and remote coaching. 50+ college commits.",
    images: [`${siteUrl}/images/community/top-banner.jpg`],
    creator: "@theschertzingertwins",
  },

  // Robots
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

  // Verification (add your IDs when you have them)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Canonical URL
  alternates: {
    canonical: siteUrl,
  },

  // Category
  category: "Sports",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <div className="page-transition">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
