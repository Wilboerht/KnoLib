/**
 * 标签管理 API 路由
 * 
 * 提供标签的 CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { TagService } from '@/lib/database/tag-service';

// GET /api/tags - 获取所有标签
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const tags = await TagService.getAllTags({
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// POST /api/tags - 创建新标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标签名称不能为空',
          message: 'Tag name is required'
        },
        { status: 400 }
      );
    }

    const tag = await TagService.createTag({
      name,
      description,
      color,
    });

    return NextResponse.json({
      success: true,
      data: tag,
    }, { status: 201 });
  } catch (error) {
    console.error('创建标签失败:', error);
    
    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标签名称已存在',
          message: 'Tag name already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: '创建标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
