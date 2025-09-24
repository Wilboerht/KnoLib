/**
 * 公开的 OAuth 提供商列表 API
 * 用于前端获取可用的登录方式
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/auth/providers - 获取启用的 OAuth 提供商列表
export async function GET(request: NextRequest) {
  try {
    const providers = await prisma.oAuthProvider.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        displayName: true,
        icon: true,
        color: true,
        // 不返回敏感信息
        clientId: false,
        clientSecret: false,
        enabled: false,
        order: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('获取 OAuth 提供商列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取提供商列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
