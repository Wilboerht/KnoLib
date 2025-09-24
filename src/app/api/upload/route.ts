/**
 * 文件上传 API 路由
 * 
 * 支持多种文件类型上传，包括图片、文档、视频、音频等
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { MediaFileService } from '@/lib/database/media-file-service';
import { prisma } from '@/lib/prisma';

// 支持的文件类型配置
const ALLOWED_FILE_TYPES = {
  // 图片类型
  'image/jpeg': { extension: 'jpg', maxSize: 10 * 1024 * 1024 }, // 10MB
  'image/jpg': { extension: 'jpg', maxSize: 10 * 1024 * 1024 },
  'image/png': { extension: 'png', maxSize: 10 * 1024 * 1024 },
  'image/gif': { extension: 'gif', maxSize: 10 * 1024 * 1024 },
  'image/webp': { extension: 'webp', maxSize: 10 * 1024 * 1024 },
  'image/svg+xml': { extension: 'svg', maxSize: 2 * 1024 * 1024 }, // 2MB
  
  // 文档类型
  'application/pdf': { extension: 'pdf', maxSize: 50 * 1024 * 1024 }, // 50MB
  'application/msword': { extension: 'doc', maxSize: 50 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { extension: 'docx', maxSize: 50 * 1024 * 1024 },
  'application/vnd.ms-excel': { extension: 'xls', maxSize: 50 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { extension: 'xlsx', maxSize: 50 * 1024 * 1024 },
  'application/vnd.ms-powerpoint': { extension: 'ppt', maxSize: 50 * 1024 * 1024 },
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': { extension: 'pptx', maxSize: 50 * 1024 * 1024 },
  'text/plain': { extension: 'txt', maxSize: 10 * 1024 * 1024 },
  'text/markdown': { extension: 'md', maxSize: 10 * 1024 * 1024 },
  'application/json': { extension: 'json', maxSize: 10 * 1024 * 1024 },
  
  // 视频类型
  'video/mp4': { extension: 'mp4', maxSize: 500 * 1024 * 1024 }, // 500MB
  'video/webm': { extension: 'webm', maxSize: 500 * 1024 * 1024 },
  'video/ogg': { extension: 'ogv', maxSize: 500 * 1024 * 1024 },
  'video/avi': { extension: 'avi', maxSize: 500 * 1024 * 1024 },
  'video/mov': { extension: 'mov', maxSize: 500 * 1024 * 1024 },
  
  // 音频类型
  'audio/mpeg': { extension: 'mp3', maxSize: 100 * 1024 * 1024 }, // 100MB
  'audio/wav': { extension: 'wav', maxSize: 100 * 1024 * 1024 },
  'audio/ogg': { extension: 'ogg', maxSize: 100 * 1024 * 1024 },
  'audio/mp4': { extension: 'm4a', maxSize: 100 * 1024 * 1024 },
  'audio/webm': { extension: 'weba', maxSize: 100 * 1024 * 1024 },
  
  // 压缩文件
  'application/zip': { extension: 'zip', maxSize: 100 * 1024 * 1024 },
  'application/x-rar-compressed': { extension: 'rar', maxSize: 100 * 1024 * 1024 },
  'application/x-7z-compressed': { extension: '7z', maxSize: 100 * 1024 * 1024 },
};

// 获取文件类型分类
function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation') || mimeType.includes('text')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archive';
  return 'other';
}

// 生成唯一文件名
function generateUniqueFileName(originalName: string, extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9\-_]/g, '_');
  return `${baseName}_${timestamp}_${random}.${extension}`;
}

// POST /api/upload - 上传文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const uploadedBy = formData.get('uploadedBy') as string;

    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: '没有选择文件' 
        },
        { status: 400 }
      );
    }

    if (!uploadedBy) {
      return NextResponse.json(
        { 
          success: false, 
          error: '缺少用户ID' 
        },
        { status: 400 }
      );
    }

    // 验证文件类型
    const fileConfig = ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
    if (!fileConfig) {
      return NextResponse.json(
        { 
          success: false, 
          error: `不支持的文件类型: ${file.type}` 
        },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > fileConfig.maxSize) {
      const maxSizeMB = Math.round(fileConfig.maxSize / (1024 * 1024));
      return NextResponse.json(
        { 
          success: false, 
          error: `文件大小超过限制 (最大 ${maxSizeMB}MB)` 
        },
        { status: 400 }
      );
    }

    // 生成文件名和路径
    const fileName = generateUniqueFileName(file.name, fileConfig.extension);
    const category = getFileCategory(file.type);
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);
    const filePath = join(uploadDir, fileName);

    // 确保上传目录存在
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 保存文件到磁盘
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // 生成文件URL
    const fileUrl = `/uploads/${category}/${fileName}`;

    // 获取图片尺寸（仅对图片文件）
    let width: number | undefined;
    let height: number | undefined;
    
    if (file.type.startsWith('image/')) {
      // 这里可以使用 sharp 或其他库来获取图片尺寸
      // 暂时设为 undefined，后续可以扩展
    }

    // 确保用户存在，如果不存在则创建默认用户
    let userId = uploadedBy;
    if (uploadedBy === 'default-user-id' || uploadedBy === 'demo-user-id') {
      // 查找或创建默认用户
      let defaultUser = await prisma.user.findFirst({
        where: { email: 'demo@knolib.com' }
      });

      if (!defaultUser) {
        defaultUser = await prisma.user.create({
          data: {
            email: 'demo@knolib.com',
            name: 'Demo User',
            role: 'AUTHOR',
          }
        });
      }

      userId = defaultUser.id;
    }

    // 保存文件信息到数据库
    const mediaFile = await MediaFileService.createMediaFile({
      filename: file.name,
      key: fileName,
      url: fileUrl,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      uploadedBy: userId,
    });

    return NextResponse.json({
      success: true,
      data: mediaFile,
      message: '文件上传成功'
    }, { status: 201 });

  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '文件上传失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// GET /api/upload - 获取媒体文件列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uploadedBy = searchParams.get('uploadedBy');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 处理用户ID
    let userId = uploadedBy;
    if (uploadedBy === 'default-user-id' || uploadedBy === 'demo-user-id') {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'demo@knolib.com' }
      });
      userId = defaultUser?.id;
    }

    const mediaFiles = await MediaFileService.getMediaFiles({
      uploadedBy: userId || undefined,
      category,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: mediaFiles,
    });
  } catch (error) {
    console.error('获取媒体文件列表失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '获取媒体文件列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - 删除媒体文件
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        {
          success: false,
          error: '缺少文件ID'
        },
        { status: 400 }
      );
    }

    await MediaFileService.deleteMediaFile(fileId);

    return NextResponse.json({
      success: true,
      message: '文件删除成功'
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      {
        success: false,
        error: '删除文件失败',
        message: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
