import type { Metadata } from "next";
import "./globals.css";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "Fixly — Trusted Local Service Professionals",
    template: "%s | Fixly",
  },
  description:
    "Fixly connects you with verified, top-rated local service professionals. Book AC repair, electricians, plumbers, cleaners, and more in under 60 seconds.",
  keywords: [
    "home services",
    "local professionals",
    "electrician",
    "plumber",
    "AC repair",
    "house cleaning",
    "book a professional",
  ],
  openGraph: {
    title: "Fixly — Trusted Local Service Professionals",
    description:
      "Discover, compare, and book verified local service professionals. Same-day bookings available across 200+ cities.",
    type: "website",
    siteName: "Fixly",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <LocaleProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <LanguageToggle />
        </LocaleProvider>
      </body>
    </html>
  );
}
