"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, LogIn, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

export default function SignInPage() {
  const [status, setStatus] = useState<"checking" | "signed" | "unsigned">("checking");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.sign.check();
        if (res.data.is_sign) {
          setStatus("signed");
          return;
        }
      } catch {}
      setStatus("unsigned");
    })();
  }, []);

  if (status === "checking") {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center">
        <Loader2 size={32} className="text-white/60 animate-spin mb-4" />
        <p className="text-sm text-text-tertiary">检查登录状态...</p>
      </div>
    );
  }

  if (status === "signed") {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <CheckCircle2 size={40} className="text-emerald-400" />
        <p className="text-lg font-medium">已登录</p>
        <Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">
          返回首页 →
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6">
      <LogIn size={40} className="text-white/60" />
      <p className="text-lg font-medium">未登录</p>
      <p className="text-sm text-text-tertiary">点击下方按钮跳转到 Soby 账户中心登录</p>
      <Link
        href="/api/web/sign"
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111] rounded-xl font-medium text-sm hover:bg-white/90 transition-all"
      >
        登录 <LogIn size={14} />
      </Link>
      <Link href="/" className="text-sm text-white/40 hover:text-white/60 transition-colors mt-2">
        ← 返回首页
      </Link>
    </div>
  );
}
