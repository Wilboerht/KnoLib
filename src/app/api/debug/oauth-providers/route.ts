import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const allProviders = await prisma.oAuthProvider.findMany({
      orderBy: { order: 'asc' },
    });

    const enabledProviders = await prisma.oAuthProvider.findMany({
      where: { enabled: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: {
        all: allProviders,
        enabled: enabledProviders,
        enabledCount: enabledProviders.length,
        googleProvider: allProviders.find(p => p.name === 'google'),
      },
    });
  } catch (error) {
    console.error('调试 OAuth 提供商失败:', error);
    return NextResponse.json({
      success: false,
      error: '获取提供商信息失败',
    }, { status: 500 });
  }
}
