# KnoLib Vercel + Supabase 部署指南

本指南将帮助你将 KnoLib 应用部署到 Vercel（前端托管）和 Supabase（数据库）。

## 📋 部署前准备

### 必需账户
- [Vercel 账户](https://vercel.com) - 免费
- [Supabase 账户](https://supabase.com) - 免费
- [GitHub 账户](https://github.com) - 免费（用于代码托管）

### 本地环境要求
- Node.js 18+ 
- Git
- 项目代码已推送到 GitHub

## 🗄️ 第一步：设置 Supabase 数据库

### 1. 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 点击 "New Project"
3. 选择组织（或创建新组织）
4. 填写项目信息：
   - **Name**: `knolib-production`
   - **Database Password**: 生成强密码并保存
   - **Region**: 选择离你最近的区域（推荐 Singapore 或 Tokyo）
5. 点击 "Create new project"

### 2. 获取数据库连接信息

项目创建完成后：

1. 进入项目 Dashboard
2. 点击左侧 "Settings" → "Database"
3. 在 "Connection string" 部分找到 "URI" 格式的连接字符串
4. 复制连接字符串，格式类似：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. 配置数据库安全设置

1. 在 Supabase Dashboard 中，进入 "Authentication" → "Settings"
2. 在 "Site URL" 中添加你的域名（稍后从 Vercel 获取）
3. 在 "Redirect URLs" 中添加：
   - `https://your-app-name.vercel.app/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`（如果有自定义域名）

## 🚀 第二步：部署到 Vercel

### 1. 连接 GitHub 仓库

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 从 GitHub 导入你的 KnoLib 仓库
4. 选择仓库后点击 "Import"

### 2. 配置构建设置

在 Vercel 项目设置中：

1. **Framework Preset**: Next.js
2. **Root Directory**: `./` (默认)
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next` (默认)
5. **Install Command**: `npm install`

### 3. 配置环境变量

在 Vercel 项目设置的 "Environment Variables" 部分添加以下变量：

#### 必需的环境变量

```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=KnoLib

# NextAuth 配置
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-make-it-very-long-and-random
NEXTAUTH_URL=https://your-app-name.vercel.app

# 生产环境标识
NODE_ENV=production
```

#### 可选的环境变量（OAuth 登录）

```bash
# Google OAuth（如果需要）
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth（如果需要）
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. 部署项目

1. 配置完环境变量后，点击 "Deploy"
2. 等待构建完成（通常需要 2-5 分钟）
3. 部署成功后，你会获得一个 `.vercel.app` 域名

## 🔧 第三步：初始化数据库

### 1. 运行数据库迁移

部署成功后，需要初始化数据库结构：

1. 在本地克隆项目（如果还没有）
2. 更新本地 `.env.local` 文件，使用 Supabase 数据库 URL
3. 运行以下命令：

```bash
# 安装依赖
npm install

# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构到 Supabase
npm run db:push

# 运行种子数据（可选）
npm run db:seed
```

### 2. 验证数据库

1. 在 Supabase Dashboard 中，进入 "Table Editor"
2. 确认所有表都已创建
3. 检查是否有种子数据

## 🔐 第四步：配置认证（可选）

### 设置 Google OAuth

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建新项目或选择现有项目
3. 启用 "Google+ API"
4. 创建 OAuth 2.0 凭据：
   - **Application type**: Web application
   - **Authorized redirect URIs**: 
     - `https://your-app-name.vercel.app/api/auth/callback/google`
5. 复制 Client ID 和 Client Secret 到 Vercel 环境变量

### 设置 GitHub OAuth

1. 访问 GitHub Settings → Developer settings → OAuth Apps
2. 点击 "New OAuth App"
3. 填写信息：
   - **Application name**: KnoLib
   - **Homepage URL**: `https://your-app-name.vercel.app`
   - **Authorization callback URL**: `https://your-app-name.vercel.app/api/auth/callback/github`
4. 复制 Client ID 和 Client Secret 到 Vercel 环境变量

## 🎯 第五步：最终配置

### 1. 更新 Supabase 设置

回到 Supabase Dashboard：

1. 进入 "Authentication" → "Settings"
2. 更新 "Site URL" 为你的 Vercel 域名
3. 在 "Redirect URLs" 中添加所有回调 URL

### 2. 测试部署

1. 访问你的 Vercel 域名
2. 测试以下功能：
   - 页面加载
   - 用户注册/登录
   - 数据库连接
   - 文章创建/编辑

### 3. 设置自定义域名（可选）

1. 在 Vercel 项目设置中，进入 "Domains"
2. 添加你的自定义域名
3. 按照说明配置 DNS 记录
4. 更新所有环境变量中的 URL

## 📊 监控和维护

### Vercel 监控

- 在 Vercel Dashboard 查看部署日志
- 监控函数执行时间和错误
- 查看访问统计

### Supabase 监控

- 在 Supabase Dashboard 查看数据库使用情况
- 监控 API 请求量
- 查看认证统计

### 备份策略

1. Supabase 自动备份（免费版保留 7 天）
2. 定期导出重要数据
3. 使用 Git 管理代码版本

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查环境变量是否正确设置
   - 查看 Vercel 构建日志
   - 确认所有依赖都已安装

2. **数据库连接失败**
   - 验证 DATABASE_URL 格式
   - 检查 Supabase 项目状态
   - 确认网络连接

3. **认证问题**
   - 检查 OAuth 配置
   - 验证回调 URL
   - 确认 NEXTAUTH_SECRET 已设置

### 获取帮助

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)

## 🎉 完成！

恭喜！你的 KnoLib 应用现在已经成功部署到生产环境。你可以开始使用和分享你的知识库平台了。

记住定期更新依赖和监控应用性能，确保最佳的用户体验。
