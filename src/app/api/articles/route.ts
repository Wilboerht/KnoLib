/**
 * 文章 API 路由
 * 
 * 提供文章的 CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/lib/database/article-service';
import { Difficulty } from '@prisma/client';
import { withEditorAuth } from '@/lib/auth/middleware';

// GET /api/articles - 获取文章列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const categoryId = searchParams.get('categoryId');

    const params = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category') || undefined,
      categoryId: categoryId || undefined,
      domain: searchParams.get('domain') || undefined,
      difficulty: searchParams.get('difficulty') as Difficulty || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      authorId: searchParams.get('authorId') || undefined,
    };

    const result = await ArticleService.getArticles(params);
    
    return NextResponse.json({
      success: true,
      data: result.articles,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// POST /api/articles - 创建新文章
export const POST = withEditorAuth(async (request) => {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.title || !body.slug || !body.authorId || !body.domainId) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少必需字段',
          required: ['title', 'slug', 'authorId', 'domainId']
        },
        { status: 400 }
      );
    }

    const article = await ArticleService.createArticle(body);
    
    return NextResponse.json({
      success: true,
      data: article,
      message: '文章创建成功'
    }, { status: 201 });
  } catch (error) {
    console.error('创建文章失败:', error);
    
    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章 slug 已存在',
          message: '请使用不同的 slug'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: '创建文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
});
