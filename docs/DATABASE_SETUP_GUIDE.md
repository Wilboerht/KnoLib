# 数据库设置指南

## 🎯 **推荐方案：PostgreSQL + Prisma ORM**

基于您的 KnoLib 项目特点，我们推荐使用 PostgreSQL 作为主数据库，配合 Prisma ORM 进行开发。

## 📊 **方案对比**

| 方案 | 优势 | 劣势 | 适用场景 |
|------|------|------|----------|
| **PostgreSQL + Prisma** ⭐ | 类型安全、关系完整、全文搜索 | 需要服务器 | 生产环境推荐 |
| **SQLite + Prisma** | 零配置、轻量级 | 功能限制、单用户 | 本地开发 |
| **Supabase** | 免费、实时功能 | 依赖第三方 | 快速原型 |
| **PlanetScale** | 无服务器、分支功能 | 付费、复杂 | 大型项目 |

## 🚀 **快速开始**

### 选项 1：本地 PostgreSQL（推荐开发）

```bash
# 1. 安装 PostgreSQL
# Windows: 下载 PostgreSQL 安装包
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# 2. 创建数据库
createdb knolib

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，设置 DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/knolib"

# 4. 安装依赖
npm install

# 5. 生成 Prisma 客户端
npm run db:generate

# 6. 推送数据库结构
npm run db:push

# 7. 播种初始数据
npm run db:seed

# 8. 启动开发服务器
npm run dev
```

### 选项 2：Supabase（推荐云端）

```bash
# 1. 注册 Supabase 账号
# 访问 https://supabase.com

# 2. 创建新项目
# 项目名称: KnoLib
# 数据库密码: 设置强密码

# 3. 获取数据库连接字符串
# 在 Settings > Database 中找到连接字符串

# 4. 配置环境变量
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# 5. 继续执行步骤 4-8（同选项1）
```

### 选项 3：Neon（免费云数据库）

```bash
# 1. 注册 Neon 账号
# 访问 https://neon.tech

# 2. 创建数据库
# 选择免费计划

# 3. 获取连接字符串
DATABASE_URL="postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"

# 4. 继续执行步骤 4-8（同选项1）
```

## 🛠️ **数据库管理命令**

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送 schema 到数据库（开发环境）
npm run db:push

# 创建和运行迁移（生产环境）
npm run db:migrate

# 播种数据
npm run db:seed

# 打开 Prisma Studio（数据库可视化工具）
npm run db:studio

# 重置数据库
npm run db:reset
```

## 📋 **数据库结构**

### 核心表

1. **users** - 用户管理
2. **domains** - 知识域名（一级分类）
3. **categories** - 分类（二级分类）
4. **subcategories** - 子分类（三级分类）
5. **articles** - 文章内容
6. **tags** - 标签系统
7. **article_tags** - 文章标签关联
8. **code_examples** - 代码示例
9. **article_seo** - SEO 元数据

### 关系设计

```
Domain (1) ──→ (N) Category ──→ (N) Subcategory
   │                │               │
   └──→ (N) Article ←┘               │
           │                        │
           └────────────────────────┘
           │
           ├──→ (N) ArticleTag ←──→ (N) Tag
           ├──→ (N) CodeExample
           ├──→ (1) ArticleSEO
           └──→ (1) User (author)
```

## 🔧 **开发工作流**

### 1. 修改数据结构

```bash
# 1. 编辑 prisma/schema.prisma
# 2. 生成迁移
npm run db:migrate

# 3. 更新 Prisma 客户端
npm run db:generate
```

### 2. 查看数据

```bash
# 启动 Prisma Studio
npm run db:studio
# 访问 http://localhost:5555
```

### 3. 重置开发数据

```bash
# 重置数据库并重新播种
npm run db:reset
```

## 🚀 **生产部署**

### Vercel + Supabase

```bash
# 1. 在 Vercel 中设置环境变量
VERCEL_ENV=production
DATABASE_URL=your-supabase-connection-string

# 2. 在 package.json 中添加构建脚本
"build": "prisma generate && next build"

# 3. 部署
vercel --prod
```

### Railway + PostgreSQL

```bash
# 1. 连接 GitHub 仓库到 Railway
# 2. 添加 PostgreSQL 插件
# 3. 设置环境变量
# 4. 自动部署
```

## 🔍 **性能优化**

### 1. 数据库索引

```sql
-- 文章搜索索引
CREATE INDEX idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || excerpt || ' ' || content));

-- 分类查询索引
CREATE INDEX idx_articles_category ON articles(category_id, published, published_at);

-- 标签查询索引
CREATE INDEX idx_article_tags_lookup ON article_tags(tag_id, article_id);
```

### 2. 查询优化

```typescript
// 使用 select 减少数据传输
const articles = await prisma.article.findMany({
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    // 只选择需要的字段
  }
});

// 使用 include 预加载关联数据
const article = await prisma.article.findUnique({
  where: { slug },
  include: {
    author: true,
    category: true,
    tags: { include: { tag: true } }
  }
});
```

## 🔒 **安全考虑**

1. **环境变量保护**
   ```bash
   # 永远不要提交 .env.local 到版本控制
   echo ".env.local" >> .gitignore
   ```

2. **数据库连接池**
   ```typescript
   // 在 prisma/schema.prisma 中配置
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // 连接池配置
     relationMode = "prisma"
   }
   ```

3. **输入验证**
   ```typescript
   // 使用 Zod 进行输入验证
   import { z } from 'zod';
   
   const articleSchema = z.object({
     title: z.string().min(1).max(255),
     content: z.string().min(1),
     // ...
   });
   ```

## 📚 **相关资源**

- [Prisma 文档](https://www.prisma.io/docs)
- [PostgreSQL 文档](https://www.postgresql.org/docs/)
- [Supabase 文档](https://supabase.com/docs)
- [数据库设计最佳实践](https://www.prisma.io/dataguide)

## 🆘 **常见问题**

### Q: 如何在不同环境间迁移数据？

```bash
# 导出数据
pg_dump knolib_dev > backup.sql

# 导入数据
psql knolib_prod < backup.sql
```

### Q: 如何处理大量数据的性能问题？

```typescript
// 使用分页
const articles = await prisma.article.findMany({
  skip: (page - 1) * limit,
  take: limit,
  // ...
});

// 使用游标分页（更高效）
const articles = await prisma.article.findMany({
  cursor: { id: lastId },
  take: limit,
  // ...
});
```

### Q: 如何备份数据库？

```bash
# 自动备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_$DATE.sql"
```
