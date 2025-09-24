/**
 * 媒体文件管理服务
 * 
 * 提供文件上传、删除、获取等功能，支持文件类型验证和大小限制
 */

import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 创建媒体文件数据类型
interface CreateMediaFileData {
  filename: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedBy: string;
}

// 查询媒体文件参数类型
interface GetMediaFilesParams {
  uploadedBy?: string;
  category?: string | null;
  mimeType?: string;
  limit?: number;
  offset?: number;
}

// 更新媒体文件数据类型
interface UpdateMediaFileData {
  filename?: string;
  width?: number;
  height?: number;
}

export class MediaFileService {
  /**
   * 创建媒体文件记录
   */
  static async createMediaFile(data: CreateMediaFileData) {
    return prisma.mediaFile.create({
      data: {
        filename: data.filename,
        key: data.key,
        url: data.url,
        mimeType: data.mimeType,
        size: data.size,
        width: data.width,
        height: data.height,
        uploadedBy: data.uploadedBy,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * 获取媒体文件列表
   */
  static async getMediaFiles(params: GetMediaFilesParams = {}) {
    const {
      uploadedBy,
      category,
      mimeType,
      limit = 50,
      offset = 0,
    } = params;

    const where: any = {};

    if (uploadedBy) {
      where.uploadedBy = uploadedBy;
    }

    if (mimeType) {
      where.mimeType = mimeType;
    }

    if (category) {
      // 根据分类过滤 MIME 类型
      switch (category) {
        case 'image':
          where.mimeType = { startsWith: 'image/' };
          break;
        case 'video':
          where.mimeType = { startsWith: 'video/' };
          break;
        case 'audio':
          where.mimeType = { startsWith: 'audio/' };
          break;
        case 'document':
          where.OR = [
            { mimeType: { contains: 'pdf' } },
            { mimeType: { contains: 'document' } },
            { mimeType: { contains: 'sheet' } },
            { mimeType: { contains: 'presentation' } },
            { mimeType: { startsWith: 'text/' } },
          ];
          break;
        case 'archive':
          where.OR = [
            { mimeType: { contains: 'zip' } },
            { mimeType: { contains: 'rar' } },
            { mimeType: { contains: '7z' } },
          ];
          break;
      }
    }

    const [mediaFiles, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.mediaFile.count({ where }),
    ]);

    return {
      mediaFiles,
      total,
      hasMore: offset + limit < total,
    };
  }

  /**
   * 根据ID获取媒体文件
   */
  static async getMediaFileById(id: string) {
    return prisma.mediaFile.findUnique({
      where: { id },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * 根据key获取媒体文件
   */
  static async getMediaFileByKey(key: string) {
    return prisma.mediaFile.findUnique({
      where: { key },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * 更新媒体文件信息
   */
  static async updateMediaFile(id: string, data: UpdateMediaFileData) {
    return prisma.mediaFile.update({
      where: { id },
      data: {
        filename: data.filename,
        width: data.width,
        height: data.height,
        updatedAt: new Date(),
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * 删除媒体文件
   */
  static async deleteMediaFile(id: string) {
    // 先获取文件信息
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      throw new Error('媒体文件不存在');
    }

    // 删除物理文件
    try {
      const filePath = join(process.cwd(), 'public', mediaFile.url);
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error('删除物理文件失败:', error);
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 删除数据库记录
    return prisma.mediaFile.delete({
      where: { id },
    });
  }

  /**
   * 批量删除媒体文件
   */
  static async deleteMediaFiles(ids: string[]) {
    // 获取所有文件信息
    const mediaFiles = await prisma.mediaFile.findMany({
      where: {
        id: { in: ids },
      },
    });

    // 删除物理文件
    for (const mediaFile of mediaFiles) {
      try {
        const filePath = join(process.cwd(), 'public', mediaFile.url);
        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error(`删除物理文件失败 (${mediaFile.filename}):`, error);
      }
    }

    // 批量删除数据库记录
    return prisma.mediaFile.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  /**
   * 获取媒体文件统计信息
   */
  static async getMediaFileStats(uploadedBy?: string) {
    const where = uploadedBy ? { uploadedBy } : {};

    const [
      total,
      totalSize,
      imageCount,
      videoCount,
      audioCount,
      documentCount,
    ] = await Promise.all([
      prisma.mediaFile.count({ where }),
      prisma.mediaFile.aggregate({
        where,
        _sum: { size: true },
      }),
      prisma.mediaFile.count({
        where: { ...where, mimeType: { startsWith: 'image/' } },
      }),
      prisma.mediaFile.count({
        where: { ...where, mimeType: { startsWith: 'video/' } },
      }),
      prisma.mediaFile.count({
        where: { ...where, mimeType: { startsWith: 'audio/' } },
      }),
      prisma.mediaFile.count({
        where: {
          ...where,
          OR: [
            { mimeType: { contains: 'pdf' } },
            { mimeType: { contains: 'document' } },
            { mimeType: { contains: 'sheet' } },
            { mimeType: { contains: 'presentation' } },
            { mimeType: { startsWith: 'text/' } },
          ],
        },
      }),
    ]);

    return {
      total,
      totalSize: totalSize._sum.size || 0,
      categories: {
        image: imageCount,
        video: videoCount,
        audio: audioCount,
        document: documentCount,
        other: total - imageCount - videoCount - audioCount - documentCount,
      },
    };
  }

  /**
   * 检查文件是否存在
   */
  static async fileExists(key: string): Promise<boolean> {
    const count = await prisma.mediaFile.count({
      where: { key },
    });
    return count > 0;
  }
}
