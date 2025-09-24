/**
 * 分类 API 路由
 * 
 * 提供分类的 CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database/category-service';

// GET /api/categories - 获取分类列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params = {
      domainId: searchParams.get('domainId') || undefined,
      isActive: searchParams.get('isActive') !== 'false',
    };

    const categories = await CategoryService.getCategories(params);
    
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取分类列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - 创建新分类
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 验证必需字段
    if (!body.name || !body.domainId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少必需字段',
          required: ['name', 'domainId']
        },
        { status: 400 }
      );
    }

    const category = await CategoryService.createCategory(body);
    
    return NextResponse.json({
      success: true,
      data: category,
      message: '分类创建成功'
    }, { status: 201 });
  } catch (error) {
    console.error('创建分类失败:', error);
    
    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: '分类 slug 已存在',
          message: '请使用不同的 slug'
        },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: '创建分类失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
