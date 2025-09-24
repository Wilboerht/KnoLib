/**
 * OAuth 提供商配置管理 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

// GET /api/admin/oauth-providers - 获取所有 OAuth 提供商配置
export const GET = withAdminAuth(async (request) => {
  try {
    const providers = await prisma.oAuthProvider.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        displayName: true,
        clientId: true,
        clientSecret: true,
        enabled: true,
        order: true,
        icon: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: providers,
    });
  } catch (error) {
    console.error('获取 OAuth 提供商配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取配置失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});

// POST /api/admin/oauth-providers - 创建或更新 OAuth 提供商配置
export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    const { name, displayName, clientId, clientSecret, enabled, order, icon, color } = body;

    // 验证必需字段
    if (!name || !displayName) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需字段',
          required: ['name', 'displayName']
        },
        { status: 400 }
      );
    }

    // 检查是否已存在
    const existingProvider = await prisma.oAuthProvider.findUnique({
      where: { name },
    });

    let provider;
    if (existingProvider) {
      // 更新现有配置
      provider = await prisma.oAuthProvider.update({
        where: { name },
        data: {
          displayName,
          clientId: clientId !== undefined ? clientId : existingProvider.clientId,
          clientSecret: clientSecret !== undefined ? clientSecret : existingProvider.clientSecret,
          enabled: enabled ?? existingProvider.enabled,
          order: order ?? existingProvider.order,
          icon: icon || existingProvider.icon,
          color: color || existingProvider.color,
        },
        select: {
          id: true,
          name: true,
          displayName: true,
          enabled: true,
          order: true,
          icon: true,
          color: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      // 创建新配置
      provider = await prisma.oAuthProvider.create({
        data: {
          name,
          displayName,
          clientId,
          clientSecret,
          enabled: enabled ?? false,
          order: order ?? 0,
          icon,
          color,
        },
        select: {
          id: true,
          name: true,
          displayName: true,
          enabled: true,
          order: true,
          icon: true,
          color: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: provider,
      message: existingProvider ? '配置更新成功' : '配置创建成功'
    });
  } catch (error) {
    console.error('保存 OAuth 提供商配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '保存配置失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});

// PUT /api/admin/oauth-providers - 批量更新配置
export const PUT = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    const { providers } = body;

    if (!Array.isArray(providers)) {
      return NextResponse.json(
        {
          success: false,
          error: '无效的数据格式'
        },
        { status: 400 }
      );
    }

    // 批量更新
    const updatePromises = providers.map((provider: any) => {
      const { id, enabled, order } = provider;
      return prisma.oAuthProvider.update({
        where: { id },
        data: { enabled, order },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: '批量更新成功'
    });
  } catch (error) {
    console.error('批量更新 OAuth 提供商配置失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '批量更新失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});
