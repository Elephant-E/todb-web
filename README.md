# Todb Web — The Other DB 前端

> 开源影视元数据库 [theotherdb.org](https://theotherdb.org) 的 Next.js 前端项目。

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19 + TypeScript 5
- **样式**: Tailwind CSS v4
- **图标**: Lucide React
- **数据请求**: Axios
- **动画**: Motion (Framer Motion)
- **包管理器**: pnpm

## 开发环境搭建

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置认证

本项目通过 Bearer Token 与后端 API 通信。登录完成后，后端会跳转回首页并在 URL 中携带 `api_key`，前端会自动保存到 `localStorage`：

1. 浏览器访问 [https://theotherdb.org/api/sign](https://theotherdb.org/api/sign) 登录
2. 授权完成后会返回 `https://theotherdb.org/?api_key=1005_xxxx`
3. 前端读取 `api_key` 并保存，随后所有 Web API 请求会自动带上 `Authorization: Bearer <api_key>`
4. 开发时，在控制台使用  `localStorage.setItem("todb_api_key", "你的token")` 来写入token

本地开发如需通过 Next.js 代理转发 API 请求，可在 `.env.local` 中配置：

```env
NEXT_PUBLIC_WEB_URL=/api/web
```

> Token 过期后后端会返回 401，前端会清理本地 token 并要求重新登录。

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)。

## Vercel 部署

推荐使用 Vercel 部署本项目。构建配置：

- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: 使用 Vercel 默认 Next.js 输出

建议配置环境变量：

```env
NEXT_PUBLIC_SITE_URL=https://你的域名
NEXT_PUBLIC_WEB_URL=/api/web
NEXT_PUBLIC_API_URL=https://api.theotherdb.org
UPSTREAM_API_URL=https://theotherdb.org/api
```

生产环境默认通过 `/api/web` 代理转发 Web API 请求，可避免浏览器端 CORS 问题。登录回调域名需要在后端账户系统中允许。

## 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页
│   ├── browse/             # 浏览页（影视列表）
│   ├── movies/             # 电影分类页
│   ├── tv-shows/           # 电视分类页
│   ├── video/[id]/         # 影视详情页
│   │   └── modals/         # 详情页弹窗组件
│   ├── music/              # 音乐列表页
│   │   └── album/[id]/     # 专辑详情页
│   ├── people/             # 人物列表页
│   ├── person/[id]/        # 人物详情页
│   ├── books/              # 书籍（开发中）
│   ├── comics/             # 漫画（开发中）
│   ├── games/              # 游戏（开发中）
│   ├── api-docs/           # API 文档页
│   ├── profile/            # 个人中心
│   ├── sign/               # 登录检查
│   └── api/web/[...path]/  # API 代理路由
├── components/             # 共享组件
│   ├── Modal.tsx           # 通用弹窗
│   ├── DetailHero.tsx      # 详情页 Hero 区域
│   ├── ToggleSwitch.tsx    # 开关组件
│   ├── Navbar.tsx          # 导航栏
│   ├── FilterPanel.tsx     # 筛选面板
│   ├── SearchBar.tsx       # 搜索栏
│   ├── VideoCard.tsx       # 影视卡片
│   ├── AddVideoModal.tsx   # 添加影视弹窗
│   ├── AddPersonModal.tsx  # 添加人物弹窗
│   ├── AddMusicModal.tsx   # 添加音乐弹窗
│   └── ...
├── lib/                    # 工具库
│   ├── api.ts              # API 客户端（74 个端点）
│   ├── utils.ts            # 工具函数
│   ├── i18n.ts             # 国际化
│   ├── modal-styles.ts     # 弹窗样式常量
│   ├── filter-styles.ts    # 筛选样式常量
│   ├── useDetailColors.ts  # 详情页颜色 hook
│   └── useInfiniteScroll.ts # 无限滚动 hook
└── types/
    └── index.ts            # TypeScript 类型定义（27 个）
```

## 功能完成度

### 已完成功能

| 模块 | 功能 | 状态 |
|------|------|------|
| **影视** | 列表浏览（无限滚动 + 筛选 + 搜索） | ✅ |
| **影视** | 详情页（hero + 信息 + 季集 + 图片 + 演员） | ✅ |
| **影视** | 添加影视（TV/电影 + 状态 + 标签） | ✅ |
| **影视** | 编辑（别名/类型/同步/删除/季/集） | ✅ |
| **影视** | TMDB 同步（按 ID / 按标题搜索） | ✅ |
| **影视** | 图片管理（设为默认/删除） | ✅ |
| **人物** | 列表浏览（无限滚动 + 筛选 + 搜索） | ✅ |
| **人物** | 详情页（hero + 信息 + 编辑/删除） | ✅ |
| **人物** | 添加人物（含虚拟人物/成人标记） | ✅ |
| **音乐** | 专辑列表浏览（筛选 + 搜索） | ✅ |
| **音乐** | 专辑详情页（歌曲列表 + 时长） | ✅ |
| **音乐** | 添加音乐（歌曲/专辑 + 歌手搜索 + 封面上传） | ✅ |
| **导航** | Navbar（首页/非首页双模式 + Plus下拉） | ✅ |
| **导航** | 书籍/漫画/游戏入口（开发中提示） | ✅ |
| **通用** | 中英文切换 | ✅ |
| **通用** | 深色主题（mobbin 风格） | ✅ |
| **通用** | 通用 Modal 组件（深色毛玻璃） | ✅ |
| **通用** | API 代理（本地开发免 CORS） | ✅ |
| **通用** | API 文档页 | ✅ |
| **通用** | 个人中心（成人设置 + API Key） | ✅ |

### 开发中功能

| 模块 | 功能 | 状态 |
|------|------|------|
| **书籍** | 列表浏览 + 详情页 | 🚧 占位页 |
| **漫画** | 列表浏览 + 详情页 | 🚧 占位页 |
| **游戏** | 列表浏览 + 详情页 | 🚧 占位页 |

### 待开发功能

| 模块 | 功能 | 优先级 |
|------|------|--------|
| **影视** | 图片上传（当前仅管理已有图片） | 高 |
| **影视** | 分段(Part)编辑 | 中 |
| **人物** | 人物图片管理 | 中 |
| **音乐** | 歌曲详情页 | 中 |
| **音乐** | 音乐编辑/删除 | 中 |
| **音乐** | 无限滚动（当前 all 模式不支持） | 中 |
| **通用** | profile/sign 页 i18n | 中 |
| **通用** | 首页动态数据（当前硬编码统计） | 低 |
| **通用** | 响应式优化（移动端详情页） | 低 |
| **通用** | 错误边界 + 全局 loading | 低 |
| **通用** | SEO 元数据 | 低 |

## API 覆盖

- **Web Token 认证 API**: 59 个端点（影视/人物/音乐/图片/用户/同步/字典）
- **Token 认证 API**: 15 个端点（公开数据查询）
- **总计**: 74 个端点

## 代码统计

| 指标 | 数值 |
|------|------|
| 页面路由 | 15 |
| 组件 | 17 |
| 工具库文件 | 7 |
| 类型定义 | 27 |
| 源码文件 | 48 |
| 代码行数 | ~5,155 |

## License

MIT
