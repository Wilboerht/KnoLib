/**
 * Recent Activity API
 * Get system recent activity records
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';

interface ActivityItem {
  id: string;
  type: 'user_login' | 'user_created' | 'article_created' | 'article_published' | 'solution_created' | 'solution_published' | 'oauth_configured';
  title: string;
  description: string;
  user?: {
    name: string | null;
    email: string;
    role: string;
  };
  timestamp: Date;
  metadata?: any;
}

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 验证用户权限
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: '用户不存在或已被禁用' },
        { status: 403 }
      );
    }

    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      return NextResponse.json(
        { success: false, error: '权限不足' },
        { status: 403 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');

    // 获取最近活动数据
    const activities: ActivityItem[] = [];
    const limit = limitParam ? parseInt(limitParam) : 10; // 每页10条记录
    const page = pageParam ? parseInt(pageParam) : 1; // 页码
    const timeLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 最近30天，确保有足够数据

    // 1. 最近创建的用户
    const recentUsers = await prisma.user.findMany({
      where: {
        createdAt: { gte: timeLimit },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200, // 增加获取数量
    });

    recentUsers.forEach(user => {
      activities.push({
        id: `user_created_${user.id}`,
        type: 'user_created',
        title: 'New User Registration',
        description: `${user.name || user.email} registered an account`,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
        timestamp: user.createdAt,
      });
    });

    // 2. Recently logged in users
    const recentLogins = await prisma.user.findMany({
      where: {
        lastLogin: {
          gte: timeLimit,
          not: null,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        lastLogin: true,
      },
      orderBy: { lastLogin: 'desc' },
      take: 300, // Increase fetch count
    });

    recentLogins.forEach(user => {
      if (user.lastLogin) {
        activities.push({
          id: `user_login_${user.id}_${user.lastLogin.getTime()}`,
          type: 'user_login',
          title: 'User Login',
          description: `${user.name || user.email} logged into the system`,
          user: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
          timestamp: user.lastLogin,
        });
      }
    });

    // 3. Recently created articles
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: { gte: timeLimit },
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200, // Increase fetch count
    });

    recentArticles.forEach(article => {
      activities.push({
        id: `article_created_${article.id}`,
        type: 'article_created',
        title: 'New Article Created',
        description: `Created article "${article.title}"`,
        user: article.author,
        timestamp: article.createdAt,
        metadata: {
          articleId: article.id,
          articleTitle: article.title,
          published: article.published,
        },
      });

      // If article is published, add publish activity
      if (article.published && article.publishedAt) {
        activities.push({
          id: `article_published_${article.id}`,
          type: 'article_published',
          title: 'Article Published',
          description: `Published article "${article.title}"`,
          user: article.author,
          timestamp: article.publishedAt,
          metadata: {
            articleId: article.id,
            articleTitle: article.title,
          },
        });
      }
    });

    // 4. Recently created technical solutions
    const recentSolutions = await prisma.techSolution.findMany({
      where: {
        createdAt: { gte: timeLimit },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200, // Increase fetch count
    });

    recentSolutions.forEach(solution => {
      activities.push({
        id: `solution_created_${solution.id}`,
        type: 'solution_created',
        title: 'New Technical Solution Created',
        description: `Created technical solution "${solution.title}"${solution.category ? ` (${solution.category.name})` : ''}`,
        timestamp: solution.createdAt,
        metadata: {
          solutionId: solution.id,
          solutionTitle: solution.title,
          published: solution.published,
          category: solution.category?.name,
        },
      });

      // If solution is published, add publish activity
      if (solution.published && solution.publishedAt) {
        activities.push({
          id: `solution_published_${solution.id}`,
          type: 'solution_published',
          title: 'Technical Solution Published',
          description: `Published technical solution "${solution.title}"${solution.category ? ` (${solution.category.name})` : ''}`,
          timestamp: solution.publishedAt,
          metadata: {
            solutionId: solution.id,
            solutionTitle: solution.title,
            category: solution.category?.name,
          },
        });
      }
    });

    // 5. Recent OAuth configuration updates
    const recentOAuthUpdates = await prisma.oAuthProvider.findMany({
      where: {
        updatedAt: { gte: timeLimit },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100, // Increase fetch count
    });

    recentOAuthUpdates.forEach(provider => {
      activities.push({
        id: `oauth_configured_${provider.id}`,
        type: 'oauth_configured',
        title: 'OAuth Configuration Updated',
        description: `Updated ${provider.displayName} OAuth configuration`,
        timestamp: provider.updatedAt,
        metadata: {
          providerId: provider.id,
          providerName: provider.name,
          enabled: provider.enabled,
        },
      });
    });

    // Sort by time
    const sortedActivities = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // 限制最多保留1000条记录
    const maxRecords = 1000;
    const limitedActivities = sortedActivities.slice(0, maxRecords);

    // 分页处理
    const totalCount = limitedActivities.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedActivities = limitedActivities.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: endIndex < totalCount,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('获取最近活动失败:', error);
    return NextResponse.json(
      { success: false, error: '获取最近活动失败' },
      { status: 500 }
    );
  }
}
