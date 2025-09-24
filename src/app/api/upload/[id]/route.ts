/**
 * 单个媒体文件 API 路由
 * 
 * 支持获取、更新、删除单个媒体文件
 */

import { NextRequest, NextResponse } from 'next/server';
import { MediaFileService } from '@/lib/database/media-file-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/upload/[id] - 获取单个媒体文件
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const mediaFile = await MediaFileService.getMediaFileById(id);
    
    if (!mediaFile) {
      return NextResponse.json(
        { 
          success: false, 
          error: '媒体文件未找到' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: mediaFile,
    });
  } catch (error) {
    console.error('获取媒体文件失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '获取媒体文件失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// PUT /api/upload/[id] - 更新媒体文件信息
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // 首先检查文件是否存在
    const existingFile = await MediaFileService.getMediaFileById(id);
    if (!existingFile) {
      return NextResponse.json(
        { 
          success: false, 
          error: '媒体文件未找到' 
        },
        { status: 404 }
      );
    }
    
    const updatedFile = await MediaFileService.updateMediaFile(id, body);
    
    return NextResponse.json({
      success: true,
      data: updatedFile,
      message: '媒体文件更新成功'
    });
  } catch (error) {
    console.error('更新媒体文件失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '更新媒体文件失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/[id] - 删除媒体文件
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // 首先检查文件是否存在
    const existingFile = await MediaFileService.getMediaFileById(id);
    if (!existingFile) {
      return NextResponse.json(
        { 
          success: false, 
          error: '媒体文件未找到' 
        },
        { status: 404 }
      );
    }
    
    await MediaFileService.deleteMediaFile(id);
    
    return NextResponse.json({
      success: true,
      message: '媒体文件删除成功'
    });
  } catch (error) {
    console.error('删除媒体文件失败:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: '删除媒体文件失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
