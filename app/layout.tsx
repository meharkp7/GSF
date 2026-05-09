import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import ClientLayout from "@/components/layout/ClientLayout";
import { Navbar } from "@/components/layout/Navbar";
import ToastProvider from "@/components/ui/ToastProvider";
import Breadcrumb from "@/components/ui/Breadcrumb";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GSF — Global Society of Founders",
    template: "%s | GSF",
  },
  description:
    "GSF is a global-first digital platform for student founders. Validate ideas, connect with world-class experts, and build with confidence.",
  keywords: [
    "startup",
    "founders",
    "cohort",
    "idea validation",
    "entrepreneurship",
    "student startups",
    "expert mentorship",
    "venture marketplace",
  ],
  metadataBase: new URL("https://gsf.community"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gsf.community",
    siteName: "Global Society of Founders",
    title: "GSF — Global Society of Founders",
    description:
      "A Society for Founders — Not Talkers. Join the global founder development ecosystem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GSF — Global Society of Founders",
    description:
      "A Society for Founders — Not Talkers. Join the global founder development ecosystem.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
        <body className="min-h-full font-sans" style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}>
          <ThemeProvider>
            <PageTransition>

              <ToastProvider />
              <ClientLayout>
                <Navbar />
                <Breadcrumb />
                {children}
                </ClientLayout>
            </PageTransition>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}