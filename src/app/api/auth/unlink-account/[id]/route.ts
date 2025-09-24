/**
 * 取消账户关联 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/auth/unlink-account/[id] - 取消关联第三方账户
export const DELETE = withAuth(async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const userId = request.user.id;

    // 检查账户是否存在且属于当前用户
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          error: '关联账户不存在'
        },
        { status: 404 }
      );
    }

    if (account.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: '无权限操作此账户'
        },
        { status: 403 }
      );
    }

    // 检查用户是否有密码或其他登录方式
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: '用户不存在'
        },
        { status: 404 }
      );
    }

    // 如果用户没有密码且只有一个关联账户，不允许取消关联
    if (!user.password && user.accounts.length === 1) {
      return NextResponse.json(
        {
          success: false,
          error: '无法取消关联，这是您唯一的登录方式。请先设置密码或关联其他账户。'
        },
        { status: 400 }
      );
    }

    // 删除账户关联
    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: '账户关联已取消'
    });
  } catch (error) {
    console.error('取消账户关联失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '取消账户关联失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});
