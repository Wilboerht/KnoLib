/**
 * 账户关联 API
 * 允许用户将第三方账户关联到现有账户
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/auth/middleware';

// POST /api/auth/link-account - 关联第三方账户
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const { provider, providerAccountId, accessToken, refreshToken } = body;

    if (!request.user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' },
        { status: 401 }
      );
    }

    const userId = request.user.id;

    // 验证必需字段
    if (!provider || !providerAccountId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需字段',
          required: ['provider', 'providerAccountId']
        },
        { status: 400 }
      );
    }

    // 检查该第三方账户是否已经关联到其他用户
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    if (existingAccount) {
      if (existingAccount.userId === userId) {
        return NextResponse.json(
          {
            success: false,
            error: '该账户已经关联到您的账户'
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: '该第三方账户已经关联到其他用户'
          },
          { status: 400 }
        );
      }
    }

    // 创建账户关联
    const account = await prisma.account.create({
      data: {
        userId,
        type: 'oauth',
        provider,
        providerAccountId,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: account.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      },
      message: '账户关联成功'
    });
  } catch (error) {
    console.error('关联账户失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '关联账户失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});

// GET /api/auth/link-account - 获取当前用户的关联账户
export const GET = withAuth(async (request) => {
  try {
    if (!request.user) {
      return NextResponse.json(
        { success: false, error: '用户未认证' },
        { status: 401 }
      );
    }

    const userId = request.user.id;

    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        providerAccountId: true,
        type: true,
      },
    });

    // 获取提供商显示信息
    const providers = await prisma.oAuthProvider.findMany({
      where: {
        name: {
          in: accounts.map(account => account.provider),
        },
      },
      select: {
        name: true,
        displayName: true,
        icon: true,
        color: true,
      },
    });

    const accountsWithProviderInfo = accounts.map(account => {
      const providerInfo = providers.find(p => p.name === account.provider);
      return {
        ...account,
        providerInfo,
      };
    });

    return NextResponse.json({
      success: true,
      data: accountsWithProviderInfo,
    });
  } catch (error) {
    console.error('获取关联账户失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取关联账户失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});
