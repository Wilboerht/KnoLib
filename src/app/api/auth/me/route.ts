/**
 * 获取当前用户信息 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';

// GET /api/auth/me - 获取当前用户信息
export const GET = withAuth(async (request) => {
  try {
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户信息不存在',
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: user.isActive,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '获取用户信息失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});
