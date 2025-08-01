import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chatbot",
  description: "ye this is also free",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <div className="grid place-items-center">
          <p className="text-2xl text-gray-300 font-sans font-thin">
            This is a development version and this AI might not give correct
            information, so do your own research
          </p>
          <p className="text-xl text-gray-300 font-sans font-thin">
            Note that long prompts will be interrupted because of the limitation
            of tokens since this is a free version
          </p>
        </div>
      </body>
    </html>
  );
}
