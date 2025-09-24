/**
 * 单个文章 API 路由
 * 
 * 提供单个文章的获取、更新、删除操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/lib/database/article-service';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/articles/[slug] - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const article = await ArticleService.getArticleBySlug(slug);
    
    if (!article) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章未找到' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// PUT /api/articles/[slug] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    // 首先检查文章是否存在
    const existingArticle = await ArticleService.getArticleBySlug(slug);
    if (!existingArticle) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章未找到' 
        },
        { status: 404 }
      );
    }
    
    const updatedArticle = await ArticleService.updateArticle(existingArticle.id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedArticle,
      message: '文章更新成功'
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '更新文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/articles/[slug] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;
    // 首先检查文章是否存在
    const existingArticle = await ArticleService.getArticleBySlug(slug);
    if (!existingArticle) {
      return NextResponse.json(
        { 
          success: false, 
          error: '文章未找到' 
        },
        { status: 404 }
      );
    }
    
    await ArticleService.deleteArticle(existingArticle.id);
    
    return NextResponse.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '删除文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
