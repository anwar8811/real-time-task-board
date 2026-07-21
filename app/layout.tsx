import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavHeader from "@/components/NavHeader";
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
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <SocketProvider>
            <NavHeader />
            <div className="flex-1">{children}</div>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
