import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LocaleProvider } from "@/components/LocaleProvider";
import { AuthCallbackHandler } from "@/components/AuthCallbackHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://theotherdb.org"),
  title: {
    template: "%s | Todb",
    default: "Todb — Video Metadata Database",
  },
  description: "Discover and explore video metadata. A comprehensive database of movies and TV shows.",
  keywords: ["Todb", "TMDB", "movies", "TV shows", "metadata", "影视数据库", "影视元数据"],
  openGraph: {
    title: {
      template: "%s | Todb",
      default: "Todb — Video Metadata Database",
    },
    description: "Discover and explore video metadata. A comprehensive database of movies and TV shows.",
    url: "/",
    siteName: "Todb",
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Todb",
      default: "Todb — Video Metadata Database",
    },
    description: "Discover and explore video metadata. A comprehensive database of movies and TV shows.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
          <AuthCallbackHandler />
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
