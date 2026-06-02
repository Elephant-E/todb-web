"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="rounded-full bg-accent/10 p-6 mb-6">
        <FileQuestion className="h-16 w-16 text-accent" />
      </div>
      <h1 className="text-4xl font-bold text-text-primary mb-2">404 - 页面未找到</h1>
      <p className="text-text-secondary max-w-md mb-8">
        抱歉，我们找不到您要访问的页面。它可能已被移动、删除，或者您输入的网址有误。
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-accent-hover transition-colors"
        >
          <Home className="h-4 w-4" />
          返回首页
        </Link>
        <button 
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 rounded-lg bg-bg-secondary border border-border-primary px-6 py-3 text-text-primary font-medium hover:bg-bg-hover transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回上一页
        </button>
      </div>
    </div>
  );
}
