"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Key, Eye, EyeOff, ToggleLeft, ToggleRight, Loader2, LogOut } from "lucide-react";
import { useLocale } from "@/components/LocaleProvider";
import api from "@/lib/api";
import type { UserInfo } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const { locale } = useLocale();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.user.info();
        setUser(res.data);
      } catch {
        setErrorMsg("加载失败");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleAdult = async () => {
    try {
      const res = await api.user.updateAdult();
      if (user) setUser({ ...user, show_adult: res.data.show_adult });
    } catch {
      setErrorMsg("操作失败");
    }
  };

  const handleGenerateKey = async () => {
    if (!confirm(locale === "zh" ? "重新生成会使旧密钥失效，确定？" : "Regenerating will invalidate the old key. Continue?")) return;
    try {
      const res = await api.user.generateApiKey();
      setApiKey(res.data.api_key);
      setShowKey(true);
    } catch {
      setErrorMsg("生成失败");
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-text-tertiary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-text-tertiary">
        <p className="text-lg mb-4">未登录</p>
        <a href={api.sign.redirect()} className="text-accent hover:text-accent-hover text-sm">
          去登录
        </a>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">个人中心</h1>

        {errorMsg && (
          <p className="text-xs text-red-400 bg-red-400/10 px-4 py-2.5 rounded-xl border border-red-400/20 mb-4">{errorMsg}</p>
        )}

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-bg-card border border-border-primary">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-bg-hover flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-text-tertiary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.nickname || "未设置昵称"}</h2>
                <p className="text-sm text-text-tertiary mt-0.5">ID: {user.oauth_id}</p>
                {user.roles.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {user.roles.map((role) => (
                      <span key={role} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-accent/15 text-accent border border-accent/30">
                        {role}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-bg-card border border-border-primary">
            <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">设置</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">显示成人内容</p>
                  <p className="text-xs text-text-tertiary mt-0.5">控制是否显示 18+ 标记的影视</p>
                </div>
                <button
                  onClick={handleToggleAdult}
                  className="text-text-secondary hover:text-accent transition-colors"
                >
                  {user.show_adult ? <ToggleRight size={28} className="text-accent" /> : <ToggleLeft size={28} />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-bg-card border border-border-primary">
            <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">API Key</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">外部调用密钥</p>
                  <p className="text-xs text-text-tertiary mt-0.5">
                    {user.has_api_key ? "已生成密钥" : "尚未生成密钥"}
                  </p>
                </div>
                <button
                  onClick={handleGenerateKey}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-bg-input border border-border-primary hover:border-border-secondary text-text-secondary hover:text-text-primary transition-all"
                >
                  <Key size={14} /> 重新生成
                </button>
              </div>

              {apiKey && (
                <div className="p-3 rounded-xl bg-bg-input border border-border-primary">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-xs font-mono text-text-primary break-all">
                      {showKey ? apiKey : "••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="shrink-0 text-text-tertiary hover:text-text-secondary transition-colors"
                    >
                      {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-bg-card border border-border-primary">
            <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider mb-4">账户</h3>
            <a
              href={user.account_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm bg-bg-input border border-border-primary hover:border-border-secondary text-text-secondary hover:text-text-primary transition-all"
            >
              账户中心
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
