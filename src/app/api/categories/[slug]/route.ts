/**
 * 单个分类 API 路由
 * 
 * 提供单个分类的详细信息和文章列表
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database/category-service';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/categories/[slug] - 获取单个分类及其文章
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // 检查是否是 ID 而不是 slug
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let category;

    if (isId) {
      // 如果是 ID，直接通过 ID 查询
      category = await CategoryService.getCategoryById(slug);
    } else {
      // 从查询参数获取域名 slug（如果有的话）
      const { searchParams } = new URL(request.url);
      const domainSlug = searchParams.get('domain');

      if (domainSlug) {
        // 如果提供了域名 slug，使用更精确的查询
        category = await CategoryService.getCategoryBySlug(domainSlug, slug);
      } else {
        // 否则直接通过分类 slug 查询
        category = await CategoryService.getCategoryBySlug('', slug);
      }
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: `Category with ${isId ? 'id' : 'slug'} "${slug}" not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取分类失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - 更新分类
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug: id } = await params;
    const body = await request.json();
    const { name, description, icon, color, order } = body;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: '分类名称不能为空',
          message: 'Category name is required'
        },
        { status: 400 }
      );
    }

    const category = await CategoryService.updateCategory(id, {
      name,
      description,
      icon,
      color,
      order,
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: `Category with id "${id}" not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('更新分类失败:', error);

    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: '分类名称已存在',
          message: 'Category name already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: '更新分类失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - 删除分类
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug: id } = await params;

    const success = await CategoryService.deleteCategory(id);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: '分类不存在',
          message: `Category with id "${id}" not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '分类删除成功',
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除分类失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
