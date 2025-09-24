/**
 * 单个标签 API 路由
 * 
 * 提供单个标签的详细操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { TagService } from '@/lib/database/tag-service';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/tags/[id] - 获取单个标签
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const tag = await TagService.getTagById(id);
    
    if (!tag) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标签不存在',
          message: `Tag with id "${id}" not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: tag,
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

// PUT /api/tags/[id] - 更新标签
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const tag = await TagService.updateTag(id, {
      name,
      description,
      color,
    });

    if (!tag) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标签不存在',
          message: `Tag with id "${id}" not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    console.error('更新标签失败:', error);
    
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
        error: '更新标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - 删除标签
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const success = await TagService.deleteTag(id);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '标签不存在',
          message: `Tag with id "${id}" not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '标签删除成功',
    });
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '删除标签失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
