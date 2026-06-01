import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LocaleProvider } from "@/components/LocaleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todb — Video Metadata Database",
  description: "Discover and explore video metadata. A comprehensive database of movies and TV shows.",
};

const themeScript = `
(function(){
  var t=localStorage.getItem('theme');
  if(t==='dark'||(!t)){
    document.documentElement.classList.add('dark');
  }else if(t==='light'){
    return;
  }else if(window.matchMedia('(prefers-color-scheme:dark)').matches){
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <LocaleProvider>
          <Suspense>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <ScrollToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
