/**
 * 分类树 API 路由
 * 
 * 提供分类树结构数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database/category-service';

// GET /api/categories/tree - 获取分类树结构
export async function GET(request: NextRequest) {
  try {
    const categoryTree = await CategoryService.getCategoryTree();
    
    return NextResponse.json({
      success: true,
      data: categoryTree,
    });
  } catch (error) {
    console.error('获取分类树失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取分类树失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
