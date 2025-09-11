import type { Metadata } from "next";
import { Playfair, Lato, Sen } from "next/font/google";
import "./globals.css";

const sen = Sen({
  variable: "--font-sen",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const playfair = Playfair({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Yard",
  description:
    "The Yard Picnic Park Enugu – a serene outdoor venue for picnics, parties & intimate events. Book online, view dates & enjoy unforgettable moments.",
  keywords: [
    "The Yard Enugu",
    "picnic park Enugu",
    "event space Enugu",
    "outdoor events Enugu",
    "party venue Enugu",
    "intimate events Enugu",
    "serene picnic spot",
    "picturesque event venue",
    "picnic packages Enugu",
    "birthday venue Enugu",
    "romantic picnic Enugu",
    "family picnic Enugu",
    "event booking Enugu",
    "Enugu picnic location",
    "outdoor party space Enugu",
    "The Yard booking",
    "Enugu event calendar",
    "catering services Enugu",
    "decor services Enugu",
    "event services Enugu",
    "Enugu picnic experience",
    "best picnic park Enugu",
    "garden event space",
    "corporate events Enugu",
    "private events Enugu",
    "Enugu event planning",
    "outdoor gatherings Enugu",
    "social events Enugu",
    "wedding reception Enugu",
    "Enugu hangout spot",
    "picnic Enugu",
    "The Yard picnic park",
    "outdoor celebration Enugu",
    "The Yard Independence Layout",
  ],
  alternates: {
    canonical: "https://www.theyard.com",
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
  openGraph: {
    title: "The Yard",
    description:
      "The Yard Picnic Park Enugu – a serene outdoor venue for picnics, parties & intimate events. Book online, view dates & enjoy unforgettable moments.",
    url: "https://www.theyard.com",
    type: "website",
    siteName: "The Yard Enugu",
    locale: "en_NG",
    images: [
      {
        url: "https://example.com/images/theyard-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Yard Picnic Park Enugu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Yard",
    description:
      "The Yard Picnic Park Enugu – a serene outdoor venue for picnics, parties & intimate events. Book online, view dates & enjoy unforgettable moments.",
    images: ["https://example.com/images/theyard-twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  authors: [
    {
      name: "Blueducks Team",
      url: "https://blueducksltd.com/",
    },
  ],
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EventVenue",
      name: "The Yard Picnic Park",
      description:
        "Serene outdoor event venue in Enugu for picnics, parties, weddings, and private gatherings.",
      url: "https://www.theyard.com",
      image: "https://example.com/images/theyard-banner.jpg",
      address: {
        "@type": "PostalAddress",
        streetAddress: "21 Umuawulu Street, Independence Layout",
        addressLocality: "Enugu",
        addressCountry: "NG",
      },
      sameAs: ["https://www.instagram.com/theyardenugu/"],
    }),
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
        className={`${sen.variable} ${lato.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
