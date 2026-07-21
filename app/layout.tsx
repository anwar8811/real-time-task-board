import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavHeader from "@/components/NavHeader";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { SocketProvider } from "@/components/SocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Realtime AI Task Board",
  description: "A realtime task management board with AI-powered summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-base-200 text-base-content">
        <AuthProvider>
          <SocketProvider>
            <NavHeader />
            <div className="flex-1 flex flex-col">{children}</div>
            <Footer />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
