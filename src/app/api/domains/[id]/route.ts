/**
 * 单个域名 API 路由
 * 
 * 提供单个域名的详细操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database/category-service';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/domains/[id] - 获取单个域名
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const domain = await CategoryService.getDomainById(id);
    
    if (!domain) {
      return NextResponse.json(
        { 
          success: false, 
          error: '域名不存在',
          message: `Domain with id "${id}" not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: domain,
    });
  } catch (error) {
    console.error('获取域名失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取域名失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// PUT /api/domains/[id] - 更新域名
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, icon, order } = body;

    if (!name) {
      return NextResponse.json(
        { 
          success: false, 
          error: '域名名称不能为空',
          message: 'Domain name is required'
        },
        { status: 400 }
      );
    }

    const domain = await CategoryService.updateDomain(id, {
      name,
      description,
      icon,
      order,
    });

    if (!domain) {
      return NextResponse.json(
        { 
          success: false, 
          error: '域名不存在',
          message: `Domain with id "${id}" not found`
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: domain,
    });
  } catch (error) {
    console.error('更新域名失败:', error);
    
    // 处理唯一约束错误
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { 
          success: false, 
          error: '域名名称已存在',
          message: 'Domain name already exists'
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: '更新域名失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] - 删除域名
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const success = await CategoryService.deleteDomain(id);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: '域名不存在',
          message: `Domain with id "${id}" not found`
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: '域名删除成功',
    });
  } catch (error) {
    console.error('删除域名失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '删除域名失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
