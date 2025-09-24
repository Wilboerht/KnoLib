# KnoLib 鉴权系统文档

## 概述

KnoLib 现在配备了完整的基于 JWT 的鉴权系统，支持用户注册、登录、权限管理和路由保护。

## 功能特性

### 🔐 核心功能
- **用户注册和登录**：支持邮箱密码注册登录
- **JWT Token 认证**：无状态的 token 认证机制
- **密码安全**：使用 bcryptjs 进行密码哈希
- **权限管理**：支持 ADMIN、EDITOR、AUTHOR 三种角色
- **路由保护**：前端和后端双重保护
- **用户状态管理**：React Context 全局状态管理

### 👥 用户角色

| 角色 | 权限 | 描述 |
|------|------|------|
| ADMIN | 全部权限 | 系统管理员，可以管理用户、内容等 |
| EDITOR | 内容管理 | 编辑者，可以管理文章、分类等内容 |
| AUTHOR | 基础权限 | 作者，可以创建和编辑自己的内容 |

## 技术架构

### 后端组件

#### 1. JWT 工具 (`src/lib/auth/jwt.ts`)
- Token 生成、验证和解析
- 支持过期时间检查
- 从 Authorization header 提取 token

#### 2. 密码工具 (`src/lib/auth/password.ts`)
- 密码哈希和验证
- 密码强度验证
- 随机密码生成

#### 3. 鉴权中间件 (`src/lib/auth/middleware.ts`)
- API 路由保护
- 用户身份验证
- 权限检查
- 预定义的保护装饰器

#### 4. API 路由
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 退出登录
- `GET /api/users` - 获取用户列表（需要管理员权限）

### 前端组件

#### 1. 鉴权上下文 (`src/lib/auth/context.tsx`)
- 全局用户状态管理
- 登录/注册/退出功能
- Token 持久化存储

#### 2. 权限 Hooks (`src/lib/auth/hooks.ts`)
- `usePermission()` - 权限检查
- `useRequireAuth()` - 认证检查
- `useRequireAdmin()` - 管理员权限检查
- `useRequireEditor()` - 编辑权限检查

#### 3. 路由保护组件 (`src/components/auth/protected-route.tsx`)
- `ProtectedRoute` - 通用保护组件
- `AdminProtectedRoute` - 管理员保护
- `EditorProtectedRoute` - 编辑者保护
- `AuthorProtectedRoute` - 作者保护

#### 4. 用户界面
- 登录/注册模态框 - 通过 Header 组件中的按钮触发
- `/unauthorized` - 未授权页面
- `/admin/users` - 用户管理页面

## 使用指南

### 环境配置

在 `.env` 文件中添加以下配置：

```env
# JWT 配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# API 密钥
API_KEY="your-api-key-for-external-access"
```

### 保护 API 路由

```typescript
import { withAuth, withAdminAuth, withEditorAuth } from '@/lib/auth/middleware';

// 需要登录
export const POST = withAuth(async (request) => {
  // 可以通过 request.user 访问用户信息
  const user = request.user;
  // ... 处理逻辑
});

// 需要管理员权限
export const DELETE = withAdminAuth(async (request) => {
  // 只有管理员可以访问
});

// 需要编辑权限
export const PUT = withEditorAuth(async (request) => {
  // 管理员和编辑者可以访问
});
```

### 保护前端页面

```tsx
import { ProtectedRoute, AdminProtectedRoute } from '@/components/auth/protected-route';

// 需要登录
function MyPage() {
  return (
    <ProtectedRoute>
      <div>受保护的内容</div>
    </ProtectedRoute>
  );
}

// 需要管理员权限
function AdminPage() {
  return (
    <AdminProtectedRoute>
      <div>管理员内容</div>
    </AdminProtectedRoute>
  );
}
```

### 使用权限检查

```tsx
import { usePermission } from '@/lib/auth/hooks';

function MyComponent() {
  const { isAdmin, isEditor, canEditOwnContent } = usePermission();

  return (
    <div>
      {isAdmin() && <button>管理员功能</button>}
      {isEditor() && <button>编辑功能</button>}
      {canEditOwnContent(authorId) && <button>编辑</button>}
    </div>
  );
}
```

## 测试账户

系统已预设以下测试账户：

### 管理员账户
- **邮箱**: `demo@knolib.com`
- **密码**: `admin123`
- **角色**: ADMIN

### 普通用户账户
- **邮箱**: `user@knolib.com`
- **密码**: `user123`
- **角色**: AUTHOR

## 安全考虑

### 密码要求
- 最少 8 位字符
- 包含大写字母
- 包含小写字母
- 包含数字
- 包含特殊字符
- 不能是常见弱密码

### Token 安全
- JWT 使用 HS256 算法签名
- Token 有效期为 7 天
- 支持 Token 过期检查
- 客户端存储在 localStorage

### API 保护
- 所有敏感 API 都需要认证
- 基于角色的权限控制
- 输入验证和错误处理

## 开发工具

### 设置管理员用户
```bash
node scripts/setup-admin-user.js
```

### 测试鉴权 API
```bash
node scripts/test-auth-api.js
```

## 下一步计划

- [ ] 添加邮箱验证功能
- [ ] 实现密码重置功能
- [ ] 添加双因素认证
- [ ] 实现 OAuth 第三方登录
- [ ] 添加用户活动日志
- [ ] 实现 Token 黑名单机制

## 故障排除

### 常见问题

1. **Token 验证失败**
   - 检查 JWT_SECRET 是否正确设置
   - 确认 Token 格式正确（Bearer token）
   - 检查 Token 是否过期

2. **权限不足**
   - 确认用户角色是否正确
   - 检查权限检查逻辑
   - 验证用户状态是否活跃

3. **登录失败**
   - 检查邮箱和密码是否正确
   - 确认用户账户是否被禁用
   - 验证数据库连接

### 调试技巧

- 使用浏览器开发者工具查看网络请求
- 检查控制台错误信息
- 使用 JWT 解码工具验证 Token 内容
- 查看服务器日志获取详细错误信息
