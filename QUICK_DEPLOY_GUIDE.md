# 🚀 KnoLib 快速部署指南

## 📋 部署前准备清单

- [ ] GitHub 账户
- [ ] Vercel 账户  
- [ ] Supabase 账户
- [ ] 代码已推送到 GitHub

## ⚡ 快速部署步骤

### 1️⃣ 设置 Supabase 数据库 (5 分钟)

1. 访问 [Supabase](https://app.supabase.com)
2. 创建新项目：`knolib-production`
3. 复制数据库连接字符串：
   ```
   Settings → Database → Connection string → URI
   ```

### 2️⃣ 部署到 Vercel (3 分钟)

1. 访问 [Vercel](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：

```bash
# 必需变量
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters-long
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_APP_NAME=KnoLib
NODE_ENV=production
```

5. 点击 "Deploy"

### 3️⃣ 初始化数据库 (2 分钟)

部署成功后，在本地运行：

```bash
# 1. 更新本地环境变量
cp .env.example .env.local
# 编辑 .env.local，填入 Supabase 数据库 URL

# 2. 安装依赖
npm install

# 3. 初始化数据库
npm run db:generate
npm run db:push
npm run db:seed
```

### 4️⃣ 验证部署 (1 分钟)

1. 访问你的 Vercel 域名
2. 测试页面加载
3. 测试用户注册/登录
4. 检查管理面板

## 🔧 可选配置

### OAuth 登录 (Google)

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建 OAuth 2.0 凭据
3. 添加回调 URL：`https://your-app.vercel.app/api/auth/callback/google`
4. 在 Vercel 中添加环境变量：
   ```bash
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 自定义域名

1. 在 Vercel 项目设置中添加域名
2. 配置 DNS 记录
3. 更新环境变量中的 URL

## 🚨 常见问题

### 构建失败
- 检查环境变量是否正确设置
- 查看 Vercel 构建日志

### 数据库连接失败
- 验证 DATABASE_URL 格式
- 确认 Supabase 项目状态

### 认证问题
- 检查 NEXTAUTH_SECRET 是否设置
- 验证 NEXTAUTH_URL 是否正确

## 📞 获取帮助

- [完整部署指南](./VERCEL_SUPABASE_DEPLOYMENT.md)
- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)

## 🎉 完成！

恭喜！你的 KnoLib 应用现在已经在线运行了。

**下一步：**
- 创建管理员账户
- 添加第一篇文章
- 配置 OAuth 登录
- 设置自定义域名
