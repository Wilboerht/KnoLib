/**
 * 用户退出登录 API
 */

import { NextRequest, NextResponse } from 'next/server';

// POST /api/auth/logout - 用户退出登录
export async function POST(request: NextRequest) {
  try {
    // 在无状态的 JWT 系统中，退出登录主要是客户端删除 token
    // 这里我们可以记录退出日志或执行其他清理操作
    
    return NextResponse.json(
      {
        success: true,
        message: '退出登录成功',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: '退出登录失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
