# KnoLib 文章管理指南

## 概述

本指南介绍如何在 KnoLib 项目中添加、管理和发布文章内容。

## 📝 **当前如何写入文章**

### 方案一：使用管理界面（推荐）

#### 1. 访问管理页面
```
http://localhost:3000/admin/articles
```
**注意：** 此页面仅在开发环境中可用，生产环境会显示404。

#### 2. 添加新文章
1. 点击"添加文章"按钮
2. 填写文章信息：
   - **标题**：文章标题
   - **URL Slug**：自动生成，可手动修改
   - **分类**：选择文章分类
   - **难度**：Beginner/Intermediate/Advanced
   - **描述**：文章简短描述
   - **内容**：使用 Markdown 格式编写
   - **标签**：用逗号分隔的标签
   - **特色文章**：是否设为特色
   - **立即发布**：是否立即发布

3. 点击"创建文章"保存

#### 3. 编辑现有文章
1. 在文章列表中点击编辑按钮
2. 修改文章信息
3. 点击"更新文章"保存

### 方案二：直接编辑数据文件

#### 1. 编辑 `src/data/articles.ts`
在 `sampleArticles` 数组中添加新文章：

```typescript
{
  id: "your-article-id",
  title: "你的文章标题",
  slug: "your-article-slug",
  category: "Frontend Development",
  difficulty: "Beginner",
  href: "/knowledge/frontend/your-article-slug",
  readTime: "10 min read",
  lastUpdated: "2024-12-15",
  author: "你的名字",
  description: "文章描述",
  content: `# 文章标题

这里是文章内容，使用 Markdown 格式...

## 章节标题

内容...
`,
  featured: false,
  tags: ["React", "JavaScript"],
  domain: "Computer Science",
  published: true,
  createdAt: "2024-12-15",
  updatedAt: "2024-12-15"
}
```

#### 2. 重启开发服务器
```bash
npm run dev
```

## 📊 **数据结构说明**

### Article 接口
```typescript
interface Article {
  id: string;                    // 唯一标识符
  title: string;                 // 文章标题
  slug: string;                  // URL友好的标识符
  category: string;              // 分类
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  href: string;                  // 文章链接
  readTime: string;              // 阅读时间
  lastUpdated: string;           // 最后更新日期
  author: string;                // 作者
  description?: string;          // 描述
  content?: string;              // Markdown 内容
  featured?: boolean;            // 是否特色文章
  tags?: string[];              // 标签数组
  domain?: string;              // 知识域名
  published: boolean;           // 是否发布
  createdAt: string;            // 创建日期
  updatedAt: string;            // 更新日期
}
```

### 支持的分类
- Frontend Development
- Backend Development
- Database
- DevOps
- Mobile Development
- Machine Learning

### 支持的知识域名
- Computer Science
- Finance
- Photography
- Basic Sciences

## 🔧 **文章管理功能**

### ArticleManager 类
提供完整的文章管理功能：

```typescript
import { ArticleManager } from '@/lib/article-manager';
import { getPublishedArticles } from '@/data/articles';

const manager = new ArticleManager(getPublishedArticles());

// 获取所有文章
const articles = manager.getAllArticles();

// 按分类获取
const frontendArticles = manager.getArticlesByCategory('Frontend Development');

// 搜索文章
const searchResults = manager.searchArticles('React');

// 获取特色文章
const featured = manager.getFeaturedArticles();

// 获取统计信息
const stats = manager.getArticleStats();
```

## 📄 **Markdown 内容编写**

### 支持的 Markdown 语法
- 标题：`# ## ### ####`
- 段落和换行
- **粗体** 和 *斜体*
- 代码块：\`\`\`language
- 列表：有序和无序
- 链接：`[文本](URL)`
- 图片：`![alt](URL)`

### 示例内容
```markdown
# React Hooks 详解

React Hooks 是 React 16.8 引入的新特性...

## useState Hook

`useState` 是最基本的 Hook：

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## 最佳实践

1. **始终在组件顶层调用 Hooks**
2. **不要在循环、条件或嵌套函数中调用 Hooks**
3. **使用 ESLint 插件检查 Hooks 规则**
```

## 🚀 **部署和生产环境**

### 当前状态
- **开发环境**：使用静态数据文件
- **生产环境**：数据为空，需要集成 API

### 未来扩展
1. **添加 API 路由**：`/api/articles`
2. **集成数据库**：MongoDB/PostgreSQL
3. **添加 CMS**：Strapi/Sanity
4. **文件存储**：上传图片和附件

## 📋 **最佳实践**

### 1. 文章编写
- 使用清晰的标题层级
- 添加适当的代码示例
- 包含实用的标签
- 编写有吸引力的描述

### 2. 分类管理
- 选择合适的分类和难度
- 使用一致的标签命名
- 关联正确的知识域名

### 3. 内容质量
- 保持内容的时效性
- 定期更新过时信息
- 添加相关的外部链接

## 🔍 **调试和测试**

### 查看文章数据
在浏览器控制台中：
```javascript
// 获取文章管理器（开发环境）
const manager = window.KnoLibDebug?.articleManager;

// 查看所有文章
console.table(manager?.getAllArticles());

// 查看统计信息
console.log(manager?.getArticleStats());
```

### 验证文章格式
确保文章数据符合 TypeScript 接口要求，避免运行时错误。

## 📞 **获取帮助**

如果在文章管理过程中遇到问题：

1. 检查浏览器控制台错误
2. 验证数据格式是否正确
3. 确认开发环境设置
4. 查看相关文档和示例

---

**注意：** 当前系统主要用于开发和演示。在生产环境中，建议集成专业的内容管理系统或数据库。
