/**
 * 鉴权中间件
 * 用于验证用户身份和权限
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    isActive: boolean;
  };
}

/**
 * 验证用户身份的中间件
 */
export async function authenticateUser(request: NextRequest): Promise<{
  success: boolean;
  user?: AuthenticatedRequest['user'];
  error?: string;
}> {
  try {
    // 从请求头中提取 token
    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        success: false,
        error: '缺少认证令牌'
      };
    }

    // 验证 token
    const payload = verifyToken(token);
    if (!payload) {
      return {
        success: false,
        error: '无效的认证令牌'
      };
    }

    // 从数据库获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: '用户不存在'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: '用户账户已被禁用'
      };
    }

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: '认证失败'
    };
  }
}

/**
 * 检查用户权限
 */
export function checkPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * 创建需要认证的 API 处理器
 */
export function withAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>,
  options?: {
    requiredRoles?: string[];
  }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    // 验证用户身份
    const authResult = await authenticateUser(request);
    
    if (!authResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: authResult.error,
        },
        { status: 401 }
      );
    }

    // 检查权限
    if (options?.requiredRoles && authResult.user) {
      const hasPermission = checkPermission(authResult.user.role, options.requiredRoles);
      if (!hasPermission) {
        return NextResponse.json(
          {
            success: false,
            error: '权限不足',
          },
          { status: 403 }
        );
      }
    }

    // 将用户信息添加到请求对象
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;

    return handler(authenticatedRequest);
  };
}

/**
 * 创建需要管理员权限的 API 处理器
 */
export function withAdminAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, {
    requiredRoles: ['ADMIN']
  });
}

/**
 * 创建需要编辑权限的 API 处理器
 */
export function withEditorAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return withAuth(handler, {
    requiredRoles: ['ADMIN', 'EDITOR']
  });
}

/**
 * 验证 API 密钥（用于外部 API 调用）
 */
export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.API_KEY;
  
  if (!validApiKey) {
    console.warn('API_KEY not configured in environment variables');
    return false;
  }
  
  return apiKey === validApiKey;
}
