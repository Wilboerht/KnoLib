/**
 * 域名 API 路由
 * 
 * 提供域名的查询操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { CategoryService } from '@/lib/database/category-service';

// GET /api/domains - 获取所有域名及其分类
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const light = searchParams.get('light') === 'true';

    // 根据参数选择不同的查询方法
    const domains = light
      ? await CategoryService.getDomainsLight()
      : await CategoryService.getDomains();

    return NextResponse.json({
      success: true,
      data: domains,
    });
  } catch (error) {
    console.error('获取域名列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取域名列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// POST /api/domains - 创建新域名
export async function POST(request: NextRequest) {
  try {
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

    const domain = await CategoryService.createDomain({
      name,
      description,
      icon,
      order,
    });

    return NextResponse.json({
      success: true,
      data: domain,
    }, { status: 201 });
  } catch (error) {
    console.error('创建域名失败:', error);

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
        error: '创建域名失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
