import Link from "next/link";
import { HomeTrending } from "@/components/HomeTrending";
import { SearchBar } from "@/components/SearchBar";
import {
  ArrowRight, Film, Tv, Database, RefreshCw, Search,
  Globe2, Languages, Tags, Link2, Pencil,
  BarChart3, Layers, Workflow, Shield, Code2, Zap,
  ChevronRight,
} from "lucide-react";

const stats = [
  { icon: Film, label: "影视作品", value: "1,150+", color: "text-white" },
  { icon: Database, label: "元数据记录", value: "619K+", color: "text-white" },
  { icon: RefreshCw, label: "数据源", value: "TMDB", color: "text-white" },
  { icon: Tv, label: "电视 & 电影", value: "双类型", color: "text-white" },
];

const features = [
  {
    icon: Search,
    title: "搜索影视",
    desc: "通过标题、年份、类型快速检索影视元数据",
    href: "/browse",
  },
  {
    icon: Database,
    title: "浏览数据库",
    desc: "浏览完整影视列表，支持多维筛选和排序",
    href: "/browse",
  },
  {
    icon: RefreshCw,
    title: "TMDB 同步",
    desc: "从 TMDB 同步最新元数据，保持数据新鲜度",
    href: "/browse",
  },
];

const dataModelSections = [
  {
    icon: Film,
    title: "Movies",
    desc: "电影元数据：标题、简介、评分、时长、海报、背景图、外部 ID",
    fields: ["video_title", "origin_title", "vote_average", "runtime", "image_poster", "image_backdrop", "external_ids"],
    color: "border-emerald-500/30 bg-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Tv,
    title: "TV Shows",
    desc: "电视剧元数据：多季多集结构、每集独立元数据",
    fields: ["seasons[]", "episodes[]", "episode_count", "season_number", "episode_number", "image_poster"],
    color: "border-blue-500/30 bg-blue-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: Layers,
    title: "Parts",
    desc: "分段结构：电影多版本（加长版、导演剪辑版等）、剧集分段",
    fields: ["part_number", "part_title", "runtime", "image_poster", "vote_average"],
    color: "border-amber-500/30 bg-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Tags,
    title: "Titles & Genres",
    desc: "多语言标题：中文译名、原名、别名管理；类型标签分类",
    fields: ["titles[]", "genre_ids[]", "is_lock", "is_can_edit"],
    color: "border-violet-500/30 bg-violet-500/5",
    iconColor: "text-violet-400",
  },
];

const workflowSteps = [
  {
    icon: Search,
    title: "搜索 & 发现",
    desc: "按标题、年份、类型搜索，或浏览完整列表",
  },
  {
    icon: RefreshCw,
    title: "TMDB 同步",
    desc: "一键从 TMDB 拉取元数据，自动填充海报与详情",
  },
  {
    icon: Pencil,
    title: "编辑 & 审核",
    desc: "补充中文译名、校验元数据、锁定防篡改",
  },
  {
    icon: Link2,
    title: "外部 ID 关联",
    desc: "关联 TMDB / IMDB / TVDB / 官网等多源 ID",
  },
];

const apiEndpoints = [
  { method: "GET", path: "/video/list", desc: "视频列表（分页、筛选、排序）" },
  { method: "GET", path: "/video/{id}", desc: "视频详情" },
  { method: "POST", path: "/video/updateOrCreate", desc: "新增或编辑视频" },
  { method: "GET", path: "/video/{id}/season/all", desc: "获取季列表" },
  { method: "GET", path: "/video/{id}/season/{n}/episode/all", desc: "获取集列表" },
  { method: "POST", path: "/video/sync/tmdb", desc: "TMDB 同步" },
  { method: "GET", path: "/video/search", desc: "高级搜索" },
  { method: "PUT", path: "/common/lock", desc: "锁定/解锁记录" },
];

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-400 border border-red-500/30",
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-white/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-xs font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            开源影视元数据库
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            <span className="text-text-primary">Discover real-world</span>
            <br />
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              video metadata.
            </span>
          </h1>

          <p className="text-lg text-text-secondary max-w-lg mx-auto mb-10 animate-slide-up stagger-2">
            来自 TMDB 的影视元数据，涵盖电影与电视节目。
            搜索、浏览、编辑——一站完成。
          </p>

          <div className="flex items-center justify-center gap-4 mb-12 animate-slide-up stagger-3">
            <a
              href="#stats"
              className="inline-flex items-center gap-2 px-6 py-3 bg-bg-card hover:bg-bg-hover text-text-primary rounded-xl font-medium text-sm border border-border-primary hover:border-border-secondary transition-all"
            >
              了解更多
            </a>
            <Link
              id="hero-cta"
              href="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-[#111] rounded-xl font-medium text-sm transition-all"
            >
              开始探索 <ArrowRight size={16} />
            </Link>
          </div>

          <div className="flex justify-center mb-16 animate-slide-up stagger-4">
            <SearchBar large placeholder="搜索电影、电视节目..." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="px-6 pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-card border border-border-primary animate-fade-in stagger-${i + 1}`}
              >
                <stat.icon size={24} className={stat.color} />
                <span className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs text-text-tertiary">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Preview - Mobbin style screen previews */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">A growing library of</h2>
            <p className="text-text-secondary">Movies &amp; TV shows with rich metadata — updated weekly from TMDB.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <HomeTrending />
          </div>

          <div className="text-center">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              查看全部影视 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Data Model */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">数据模型</h2>
            <p className="text-text-secondary">为影视元数据管理精心设计的四层数据结构</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {dataModelSections.map((section, i) => (
              <div
                key={section.title}
                className={`group p-6 rounded-2xl border transition-all duration-300 hover:shadow-elevated animate-fade-in stagger-${i + 1} ${section.color}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-bg-card flex items-center justify-center">
                    <section.icon size={20} className={section.iconColor} />
                  </div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{section.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {section.fields.map((field) => (
                    <code key={field} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-bg-card/80 text-text-tertiary border border-border-primary">
                      {field}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">从发现到管理</h2>
            <p className="text-text-secondary">完整的影视元数据工作流</p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {workflowSteps.map((step, i) => (
              <div
                key={step.title}
                className={`relative p-6 rounded-2xl bg-bg-card border border-border-primary animate-fade-in stagger-${i + 1}`}
              >
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2.5 -translate-y-1/2 z-10">
                    <ChevronRight size={16} className="text-text-tertiary" />
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4">
                  <step.icon size={20} className="text-white/70" />
                </div>
                <div className="text-xs font-mono text-text-tertiary mb-2">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-base font-semibold mb-2">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">快速开始</h2>
            <Link
              href="/browse"
              className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              查看全部 <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <Link
                key={item.title}
                href={item.href}
                className={`group p-8 rounded-2xl bg-bg-card border border-border-primary hover:border-border-secondary transition-all duration-300 hover:shadow-elevated animate-fade-in stagger-${i + 1}`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
                  <item.icon size={22} className="text-white/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities - rich metadata */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">丰富的元数据</h2>
            <p className="text-text-secondary">不只是标题和海报——每一部影视都有深度的结构化数据</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Globe2, title: "多语言 & 多地区", desc: "原始语言、上映国家、多语言标题管理。支持中文译名补充和锁定保护", tags: ["original_languages", "origin_countrys", "titles[]"] },
              { icon: Languages, title: "别名管理", desc: "一部影视可拥有多个标题：中文名、原名、当地译名。支持锁定防误改", tags: ["title", "is_lock", "is_can_edit"] },
              { icon: BarChart3, title: "评分 & 统计", desc: "TMDB 评分、投票数、时长、季数、集数——数据一目了然", tags: ["vote_average", "vote_count", "runtime"] },
              { icon: Link2, title: "外部 ID 关联", desc: "关联 TMDB、IMDB、TVDB、官网等多个外部 ID，方便跨平台检索", tags: ["tmdb_id", "imdb_id", "homepage"] },
              { icon: Shield, title: "权限 & 锁定", desc: "基于角色的访问控制。锁定记录防止误操作，仅授权角色可编辑", tags: ["roles", "is_lock", "is_can_edit"] },
              { icon: Workflow, title: "TMDB 自动同步", desc: "搜索 TMDB 选择匹配结果，一键同步元数据、海报、季集信息", tags: ["sync/tmdb", "sync/tmdbSearch"] },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`group p-6 rounded-2xl bg-bg-card border border-border-primary hover:border-border-secondary transition-all duration-300 hover:shadow-elevated animate-fade-in stagger-${(i % 6) + 1}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                  <item.icon size={18} className="text-white/60" />
                </div>
                <h3 className="text-base font-semibold mb-2 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{item.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <code key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-bg-hover text-text-tertiary">
                      {tag}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Preview */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-3">RESTful API</h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                完整的 Web API 和独立的 Token API，覆盖所有数据操作。
                Bearer Token 用于 Web 端和外部集成。
              </p>
              <div className="space-y-3">
                {[
                  { icon: Code2, title: "Web API", desc: "Bearer Token 认证，用于前端界面操作" },
                  { icon: Zap, title: "Token API", desc: "Bearer Token，用于外部程序调用" },
                  { icon: Shield, title: "角色权限", desc: "view / edit / admin 三级权限控制" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-bg-hover transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon size={16} className="text-white/60" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.title}</h4>
                      <p className="text-xs text-text-tertiary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-bg-card border border-border-primary overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border-primary">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                <span className="text-[11px] text-text-tertiary ml-2 font-mono">api/routes</span>
              </div>
              <div className="p-4 space-y-2.5 max-h-[360px] overflow-y-auto">
                {apiEndpoints.map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 py-1.5 px-2 rounded-lg hover:bg-bg-hover transition-colors">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${methodColors[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="text-[11px] font-mono text-text-primary flex-1 truncate">{ep.path}</code>
                    <span className="text-[10px] text-text-tertiary hidden sm:block">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-border-primary p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                永远不会缺少灵感
              </h2>
              <p className="text-text-secondary max-w-md mx-auto mb-8">
                Todb 为你提供完整的影视元数据管理体验。
                开源、免费、持续更新。
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#111] hover:bg-white/90 rounded-xl font-medium text-sm transition-all"
                >
                  开始探索 <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary px-6 py-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-[#111] flex items-center justify-center text-white text-[10px] font-bold">
                  T
                </div>
                <span className="text-sm font-semibold">Todb</span>
              </div>
              <p className="text-xs text-text-tertiary leading-relaxed">
                开源影视元数据库，数据来源 TMDB。
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">产品</h4>
              <div className="space-y-2">
                <Link href="/browse" className="block text-sm text-text-secondary hover:text-text-primary transition-colors">浏览</Link>
                <Link href="/browse" className="block text-sm text-text-secondary hover:text-text-primary transition-colors">搜索</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">数据</h4>
              <div className="space-y-2">
                <span className="block text-sm text-text-secondary">TMDB 同步</span>
                <span className="block text-sm text-text-secondary">RESTful API</span>
                <span className="block text-sm text-text-secondary">Token API</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">功能</h4>
              <div className="space-y-2">
                <span className="block text-sm text-text-secondary">多语言标题</span>
                <span className="block text-sm text-text-secondary">权限管理</span>
                <span className="block text-sm text-text-secondary">数据锁定</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border-primary">
            <p className="text-xs text-text-tertiary">
              &copy; Todb {new Date().getFullYear()}
            </p>
            <p className="text-xs text-text-tertiary">
              影视元数据库 · 数据来源 TMDB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
