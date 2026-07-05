import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Polarity Project",
  description: "Practical essays on holding both sides of human and leadership tensions.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Polarity Project",
    description: "Practical essays on holding both sides of human and leadership tensions.",
    url: siteUrl,
    siteName: "Polarity Project",
    images: [
      {
        url: "/generated/home-hero.png",
        width: 1200,
        height: 630,
        alt: "Polarity Project"
      }
    ],
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
