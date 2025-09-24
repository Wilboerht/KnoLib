# KnoLib 第三方登录系统文档

## 概述

KnoLib 现在支持完整的第三方登录系统，管理员可以在后台配置和管理多种 OAuth 提供商，用户可以使用第三方账户快速登录。

## 支持的登录方式

### 🔐 已集成的提供商

| 提供商 | 状态 | 图标 | 描述 |
|--------|------|------|------|
| Google | ✅ 支持 | 🔍 | Google OAuth 2.0 |
| GitHub | ✅ 支持 | 🐙 | GitHub OAuth |
| Microsoft | ✅ 支持 | 🪟 | Microsoft Azure AD |
| 微信 | ✅ 支持 | 💬 | 微信开放平台 |
| 支付宝 | ✅ 支持 | 💰 | 支付宝开放平台 |

### 🎯 核心功能

- **动态配置**：管理员可在后台启用/禁用登录方式
- **安全认证**：支持 OAuth 2.0 标准协议
- **账户关联**：用户可关联多个第三方账户
- **错误处理**：完善的错误提示和处理机制
- **权限管理**：与现有角色系统无缝集成

## 系统架构

### 数据库模型

```sql
-- OAuth 提供商配置表
CREATE TABLE oauth_providers (
  id VARCHAR PRIMARY KEY,
  name VARCHAR UNIQUE,           -- 提供商标识
  display_name VARCHAR,          -- 显示名称
  client_id VARCHAR,             -- OAuth Client ID
  client_secret VARCHAR,         -- OAuth Client Secret
  enabled BOOLEAN DEFAULT false, -- 是否启用
  order INTEGER DEFAULT 0,       -- 显示顺序
  icon VARCHAR,                  -- 图标
  color VARCHAR,                 -- 主题色
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- NextAuth 账户关联表
CREATE TABLE accounts (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR,               -- 关联用户ID
  type VARCHAR,                  -- 账户类型
  provider VARCHAR,              -- 提供商
  provider_account_id VARCHAR,   -- 提供商账户ID
  refresh_token TEXT,            -- 刷新令牌
  access_token TEXT,             -- 访问令牌
  expires_at INTEGER,            -- 过期时间
  token_type VARCHAR,            -- 令牌类型
  scope VARCHAR,                 -- 权限范围
  id_token TEXT,                 -- ID 令牌
  session_state VARCHAR          -- 会话状态
);

-- NextAuth 会话表
CREATE TABLE sessions (
  id VARCHAR PRIMARY KEY,
  session_token VARCHAR UNIQUE,  -- 会话令牌
  user_id VARCHAR,               -- 用户ID
  expires TIMESTAMP              -- 过期时间
);
```

### API 接口

#### 管理员接口

```typescript
// 获取 OAuth 提供商列表
GET /api/admin/oauth-providers
Authorization: Bearer <admin_token>

// 创建/更新 OAuth 提供商配置
POST /api/admin/oauth-providers
Authorization: Bearer <admin_token>
{
  "name": "google",
  "displayName": "Google",
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "enabled": true,
  "order": 1
}

// 更新单个提供商配置
PUT /api/admin/oauth-providers/{id}
Authorization: Bearer <admin_token>

// 删除提供商配置
DELETE /api/admin/oauth-providers/{id}
Authorization: Bearer <admin_token>
```

#### 公开接口

```typescript
// 获取启用的登录方式
GET /api/auth/providers

// NextAuth OAuth 回调
GET/POST /api/auth/[...nextauth]

// 账户关联
GET /api/auth/link-account
POST /api/auth/link-account
DELETE /api/auth/unlink-account/{id}
```

## 配置指南

### 1. 环境变量配置

```env
# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"

# OAuth 提供商配置（可选）
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""
WECHAT_CLIENT_ID=""
WECHAT_CLIENT_SECRET=""
ALIPAY_CLIENT_ID=""
ALIPAY_CLIENT_SECRET=""
```

### 2. 初始化 OAuth 提供商

```bash
# 运行初始化脚本
node scripts/setup-oauth-providers.js
```

### 3. 管理员配置

1. 登录管理后台：`/admin`
2. 进入 OAuth 设置：`/admin/oauth-settings`
3. 配置各提供商的 Client ID 和 Client Secret
4. 启用需要的登录方式

### 4. 各提供商配置指南

#### Google OAuth 2.0

1. 访问 [Google Cloud Console](https://console.developers.google.com/)
2. 创建新项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 设置重定向 URI：`{NEXTAUTH_URL}/api/auth/callback/google`

#### GitHub OAuth

1. 访问 [GitHub Developer Settings](https://github.com/settings/applications/new)
2. 创建新的 OAuth App
3. 设置 Authorization callback URL：`{NEXTAUTH_URL}/api/auth/callback/github`

#### Microsoft Azure AD

1. 访问 [Azure Portal](https://portal.azure.com/)
2. 注册新应用程序
3. 配置重定向 URI：`{NEXTAUTH_URL}/api/auth/callback/azure-ad`

## 使用指南

### 用户登录流程

1. 用户点击 Header 中的登录按钮打开登录模态框
2. 选择第三方登录方式
3. 跳转到第三方授权页面
4. 用户授权后返回系统
5. 系统创建或关联用户账户
6. 登录成功，跳转到目标页面

### 账户关联

1. 用户登录后访问个人资料：`/profile`
2. 在"关联账户"部分查看已关联的账户
3. 点击"关联账户"按钮关联新的第三方账户
4. 点击"取消关联"按钮取消已关联的账户

### 错误处理

- 登录失败时会跳转到错误页面：`/auth/error`
- 错误页面会显示具体的错误信息和解决建议
- 支持重试和返回上一页

## 安全特性

### 🔒 安全措施

- **OAuth 2.0 标准**：遵循 OAuth 2.0 安全标准
- **CSRF 保护**：NextAuth.js 内置 CSRF 保护
- **会话管理**：安全的会话令牌管理
- **重定向验证**：验证重定向 URL 安全性
- **速率限制**：防止暴力破解攻击
- **错误日志**：记录登录尝试和错误信息

### 🛡️ 数据保护

- **敏感信息加密**：Client Secret 等敏感信息加密存储
- **最小权限原则**：只获取必要的用户信息
- **数据清理**：自动清理过期的会话和令牌
- **审计日志**：记录重要的安全事件

## 故障排除

### 常见问题

1. **OAuth 配置错误**
   - 检查 Client ID 和 Client Secret 是否正确
   - 确认重定向 URI 配置正确
   - 验证提供商应用状态是否正常

2. **登录失败**
   - 检查网络连接
   - 确认提供商服务状态
   - 查看错误日志获取详细信息

3. **账户关联问题**
   - 确认用户有足够权限
   - 检查第三方账户是否已被其他用户使用
   - 验证邮箱地址是否匹配

### 调试技巧

- 启用 NextAuth.js 调试模式：`debug: true`
- 查看浏览器开发者工具的网络请求
- 检查服务器日志获取详细错误信息
- 使用 OAuth 调试工具验证配置

## 扩展开发

### 添加新的 OAuth 提供商

1. 在数据库中添加新的提供商配置
2. 在 `src/lib/auth/nextauth.ts` 中添加提供商配置
3. 更新 UI 组件支持新的提供商
4. 添加相应的图标和样式

### 自定义登录流程

1. 修改 `src/components/auth/oauth-button.tsx` 组件
2. 自定义登录页面样式和布局
3. 添加自定义的回调处理逻辑
4. 实现自定义的错误处理

## 监控和维护

### 性能监控

- 监控 OAuth 登录成功率
- 跟踪登录响应时间
- 监控第三方服务可用性

### 定期维护

- 更新 OAuth 应用配置
- 检查和更新安全证书
- 清理过期的会话数据
- 审查和更新安全策略

---

## 总结

KnoLib 的第三方登录系统提供了完整的 OAuth 集成解决方案，支持多种主流登录方式，具备完善的管理界面和安全保障。管理员可以灵活配置登录方式，用户可以便捷地使用第三方账户登录，同时系统确保了数据安全和用户隐私保护。
