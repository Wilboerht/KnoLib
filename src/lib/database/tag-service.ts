/**
 * 标签服务
 * 
 * 提供标签相关的数据库操作
 */

import { prisma } from '@/lib/prisma';
import { generateSlug } from '@/lib/utils';

export interface CreateTagData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  color?: string;
}

export interface GetTagsOptions {
  search?: string;
  limit?: number;
  offset?: number;
  includeArticleCount?: boolean;
}

export class TagService {
  /**
   * 获取所有标签
   */
  static async getAllTags(options: GetTagsOptions = {}) {
    const {
      search,
      limit = 50,
      offset = 0,
      includeArticleCount = true,
    } = options;

    const whereCondition: any = {};

    // 搜索条件
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tags = await prisma.tag.findMany({
      where: whereCondition,
      include: includeArticleCount ? {
        _count: {
          select: {
            articles: true,
          },
        },
      } : undefined,
      orderBy: [
        { name: 'asc' },
      ],
      take: limit,
      skip: offset,
    });

    return tags;
  }

  /**
   * 根据 ID 获取标签
   */
  static async getTagById(id: string) {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
        articles: {
          include: {
            article: {
              include: {
                author: true,
                category: true,
              },
            },
          },
          take: 10, // 只返回最近的 10 篇文章
          orderBy: {
            article: {
              publishedAt: 'desc',
            },
          },
        },
      },
    });
  }

  /**
   * 根据 slug 获取标签
   */
  static async getTagBySlug(slug: string) {
    return prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
        articles: {
          include: {
            article: {
              include: {
                author: true,
                category: true,
              },
            },
          },
          orderBy: {
            article: {
              publishedAt: 'desc',
            },
          },
        },
      },
    });
  }

  /**
   * 创建标签
   */
  static async createTag(data: CreateTagData) {
    const slug = generateSlug(data.name);

    return prisma.tag.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        color: data.color,
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  /**
   * 更新标签
   */
  static async updateTag(id: string, data: UpdateTagData) {
    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.color !== undefined) {
      updateData.color = data.color;
    }

    try {
      return await prisma.tag.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        // 记录不存在
        return null;
      }
      throw error;
    }
  }

  /**
   * 删除标签
   */
  static async deleteTag(id: string) {
    try {
      await prisma.tag.delete({
        where: { id },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        // 记录不存在
        return false;
      }
      throw error;
    }
  }

  /**
   * 批量创建或获取标签
   */
  static async createOrGetTags(tagNames: string[]) {
    const tags = [];

    for (const name of tagNames) {
      const slug = generateSlug(name);
      
      // 尝试查找现有标签
      let tag = await prisma.tag.findUnique({
        where: { slug },
      });

      // 如果不存在，创建新标签
      if (!tag) {
        tag = await prisma.tag.create({
          data: {
            name,
            slug,
          },
        });
      }

      tags.push(tag);
    }

    return tags;
  }

  /**
   * 获取热门标签
   */
  static async getPopularTags(limit: number = 10) {
    return prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
      take: limit,
    });
  }

  /**
   * 搜索标签
   */
  static async searchTags(query: string, limit: number = 20) {
    return prisma.tag.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: [
        { name: 'asc' },
      ],
      take: limit,
    });
  }
}
