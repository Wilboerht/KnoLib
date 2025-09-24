/**
 * OAuth 安全配置和验证
 */

import { prisma } from '@/lib/prisma';

// 安全配置
export const SECURITY_CONFIG = {
  // 最大登录尝试次数
  MAX_LOGIN_ATTEMPTS: 5,
  // 登录尝试锁定时间（分钟）
  LOGIN_LOCKOUT_DURATION: 15,
  // 会话超时时间（小时）
  SESSION_TIMEOUT: 24,
  // 允许的重定向域名
  ALLOWED_REDIRECT_DOMAINS: [
    'localhost',
    'knolib.com',
    // 添加您的生产域名
  ],
};

// 验证重定向 URL 是否安全
export function validateRedirectUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    
    // 检查协议
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // 在开发环境允许 localhost
    if (process.env.NODE_ENV === 'development' && parsedUrl.hostname === 'localhost') {
      return true;
    }
    
    // 检查域名是否在允许列表中
    return SECURITY_CONFIG.ALLOWED_REDIRECT_DOMAINS.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// 记录登录尝试
export async function recordLoginAttempt(
  email: string, 
  success: boolean, 
  provider?: string,
  ip?: string,
  userAgent?: string
) {
  try {
    // 这里可以实现登录尝试记录
    // 暂时只记录到控制台，实际项目中可以存储到数据库
    console.log(`登录尝试: ${email}, 成功: ${success}, 提供商: ${provider || 'credentials'}, IP: ${ip}`);
    
    if (!success) {
      // 检查失败次数，实现账户锁定逻辑
      await checkAndLockAccount(email);
    }
  } catch (error) {
    console.error('记录登录尝试失败:', error);
  }
}

// 检查并锁定账户
async function checkAndLockAccount(email: string) {
  try {
    // 这里可以实现账户锁定逻辑
    // 例如：记录失败次数，超过阈值时锁定账户
    console.log(`检查账户锁定状态: ${email}`);
  } catch (error) {
    console.error('检查账户锁定失败:', error);
  }
}

// 验证 OAuth 提供商配置
export async function validateOAuthProvider(providerName: string): Promise<boolean> {
  try {
    const provider = await prisma.oAuthProvider.findUnique({
      where: { name: providerName },
    });

    if (!provider) {
      console.error(`OAuth 提供商不存在: ${providerName}`);
      return false;
    }

    if (!provider.enabled) {
      console.error(`OAuth 提供商已禁用: ${providerName}`);
      return false;
    }

    if (!provider.clientId || !provider.clientSecret) {
      console.error(`OAuth 提供商配置不完整: ${providerName}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('验证 OAuth 提供商失败:', error);
    return false;
  }
}

// 清理敏感信息
export function sanitizeUserData(user: any) {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
}

// 生成安全的随机字符串
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 验证邮箱格式
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 检查密码强度
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('密码长度至少 8 位');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  }

  if (!/\d/.test(password)) {
    errors.push('密码必须包含数字');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 检查用户权限
export function checkUserPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'ADMIN': 3,
    'EDITOR': 2,
    'AUTHOR': 1,
  };

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

  return userLevel >= requiredLevel;
}

// 速率限制检查
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  check(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxAttempts) {
      return false;
    }

    record.count++;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// 全局速率限制器实例
export const globalRateLimiter = new RateLimiter();
