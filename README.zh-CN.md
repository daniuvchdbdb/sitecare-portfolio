# 守站云 SiteCare

守站云是面向没有专职技术团队的中小企业的网站、小程序与在线业务系统长期维护平台。本仓库当前完成第一阶段：企业注册登录、组织与角色、多租户隔离基础、运行 Dashboard、项目档案管理和演示数据。

## 1. 产品介绍

客户可在一个企业控制台内管理网站、小程序、后台和 API 项目。后续阶段将接入自动监控、故障事件、服务工单、维护记录、服务额度和月报，形成“监控 SaaS + 人工技术服务”的长期维护订阅产品。

## 2. 技术架构

- Next.js 16、React 19、TypeScript、App Router、Server Actions
- Tailwind CSS 4、shadcn/ui 结构、Lucide Icons
- Auth.js 5（Credentials + JWT Session）与 bcrypt 密码哈希
- PostgreSQL、Prisma 6
- Zod 输入验证
- Redis/BullMQ、SMTP 和 Worker 已在接口与环境变量层预留，第二/三阶段接入

当前请求链路：浏览器 → Next.js Server Component/Action → Auth.js 会话 → 租户权限守卫 → Prisma → PostgreSQL。

## 3. 项目目录

```text
SiteCare/
├─ prisma/
│  ├─ schema.prisma       # 完整核心关系模型
│  └─ seed.ts             # 演示账号、企业、项目和套餐
├─ src/
│  ├─ app/                # App Router 页面、Server Actions、Auth API
│  ├─ components/         # shadcn 风格 UI、认证和控制台导航
│  ├─ lib/auth/           # 登录用户与租户权限守卫
│  ├─ lib/dal/            # 强制组织过滤的数据访问层
│  ├─ lib/validations/    # Zod Schema
│  ├─ auth.ts             # Auth.js 配置
│  └─ proxy.ts            # 受保护路由入口
├─ .env.example
├─ components.json
└─ package.json
```

## 4. 本地环境要求

- Windows 10/11 或 Linux
- Node.js 20.9+（推荐当前 LTS）
- npm 10+
- PostgreSQL 15+
- 第二阶段 Worker 需要 Redis 7+

## 5. Windows 启动方式

```powershell
cd D:\CodexProjects\SiteCare
Copy-Item .env.example .env
npm install
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

浏览器访问 `http://localhost:3000`。

## 6. PostgreSQL 配置

创建数据库和专用账号后修改 `.env`：

```env
DATABASE_URL="postgresql://sitecare:your-password@localhost:5432/sitecare?schema=public"
```

首次使用运行 `npm run db:migrate -- --name init`；仅做本地原型同步也可用 `npm run db:push`。

## 7. Redis 配置

当前阶段不读取 Redis。请保留 `REDIS_URL=redis://localhost:6379`，第二阶段的监控调度、并发限制与重试队列将使用它。

## 8. Docker 运行方式

Docker Compose 属于第五阶段交付，本阶段按任务要求没有提前实现或声称可用。当前可以用 Docker 单独启动 PostgreSQL/Redis，再按 Windows 或 Linux 本地步骤运行 Web 应用。完整的 Web、Worker、PostgreSQL、Redis Compose 编排将在第五阶段加入。

## 9. 环境变量

复制 `.env.example` 为 `.env`。第一阶段运行必需：`DATABASE_URL`、`AUTH_SECRET`、`APP_URL`。其余变量为后续监控、邮件、加密和上传模块预留。真实密码、Token 和加密密钥不得提交到 Git。

## 10. Seed 数据

```powershell
npm run db:seed
```

Seed 可重复执行，包含 4 个套餐、10 家名称自然的虚拟企业、20 个项目以及正常/警告/异常状态。第一阶段不会伪造真实 MonitorCheck；监控数据将在 Worker 实际检测后产生。

## 11. 演示账号

| 权限 | 邮箱 | 密码 |
|---|---|---|
| 企业管理员 | `demo@sitecare.example` | `SiteCare@2026` |
| 平台管理员（角色预置） | `admin@sitecare.example` | `SiteCare@2026` |

演示密码只用于本地 Seed；部署前必须删除或更换。

## 12. 监控 Worker 启动方式

第二阶段将新增独立 Worker 命令和 BullMQ 队列。当前没有使用页面 `setInterval` 或伪装后台监控；因此也没有可启动的 Worker。

## 13. Production 部署

当前可执行 `npm run build && npm run start` 部署 Next.js Web 层。生产环境必须使用高熵 `AUTH_SECRET`、TLS、受限数据库账户与反向代理。完整 Docker、Worker 健康检查和 Redis 编排在第五阶段交付。

## 14. 常见问题

- **登录提示账号错误**：先确认已执行迁移和 `npm run db:seed`。
- **Prisma 无法连接**：检查 PostgreSQL 服务、端口、数据库名和 `DATABASE_URL`。
- **修改 Schema 后类型未更新**：运行 `npm run db:generate`。
- **普通成员看不到项目**：普通成员只返回 `ProjectAccess` 明确授权的项目；企业管理员可查看本企业全部项目。
- **能否查看其他企业数据**：业务 DAL 与写操作均从服务端会话取得 `organizationId`，不接受客户端传入组织 ID。

## 第一阶段边界与路线图

已完成：初始化、完整基础 Schema、Auth.js、组织/RBAC、多租户 DAL、中文响应式 Dashboard、项目创建与列表、暗色模式、Seed 和文档。

尚未实现：真实 HTTP/SSL/API 检测、Worker/Redis 队列、Incident 引擎、工单与维护记录页面、通知、月报/PDF、套餐管理、报价、平台管理后台、文件上传、速率限制与 Docker Compose。这些严格按后续阶段逐步实现。

