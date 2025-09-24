/**
 * 分类数据库服务
 * 
 * 提供分类相关的数据库操作
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// 分类查询参数
export interface CategoryQueryParams {
  domainId?: string;
  isActive?: boolean;
}

// 分类创建参数
export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  domainId: string;
}

// 分类更新参数
export type UpdateCategoryData = Partial<CreateCategoryData>;

// 分类包含关联数据的类型
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    domain: true;
    subcategories: true;
    articles: true;
  };
}>;

export class CategoryService {
  /**
   * 获取所有域名（完整信息，用于管理页面）
   */
  static async getDomains() {
    return prisma.domain.findMany({
      where: { isActive: true },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            subcategories: {
              where: { isActive: true },
            },
            _count: {
              select: {
                articles: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 获取域名列表（轻量级，用于前端页面）
   */
  static async getDomainsLight() {
    return prisma.domain.findMany({
      where: { isActive: true },
      include: {
        categories: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            icon: true,
            color: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * 获取分类列表
   */
  static async getCategories(params: CategoryQueryParams = {}) {
    const { domainId, isActive = true } = params;

    return prisma.category.findMany({
      where: {
        isActive,
        ...(domainId && { domainId }),
      },
      include: {
        domain: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }



  /**
   * 根据 slug 获取分类
   */
  static async getCategoryBySlug(domainSlug: string, categorySlug: string) {
    const whereCondition: any = {
      slug: categorySlug,
      isActive: true,
    };

    // 如果提供了域名 slug，添加域名条件
    if (domainSlug) {
      whereCondition.domain = {
        slug: domainSlug,
      };
    }

    return prisma.category.findFirst({
      where: whereCondition,
      include: {
        domain: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        articles: {
          where: { published: true },
          include: {
            author: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: { publishedAt: 'desc' },
        },
      },
    });
  }



  /**
   * 获取分类统计信息
   */
  static async getCategoryStats() {
    const [
      totalDomains,
      totalCategories,
      totalSubcategories,
      categoriesWithArticles,
    ] = await Promise.all([
      prisma.domain.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.subcategory.count({ where: { isActive: true } }),
      prisma.category.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
      }),
    ]);

    const categoryStats = categoriesWithArticles.reduce((acc, category) => {
      acc[category.name] = category._count.articles;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDomains,
      totalCategories,
      totalSubcategories,
      categoryStats,
    };
  }

  /**
   * 获取分类树结构
   */
  static async getCategoryTree() {
    const domains = await this.getDomains();
    
    return domains.map(domain => ({
      id: domain.id,
      name: domain.name,
      slug: domain.slug,
      description: domain.description,
      icon: domain.icon,
      type: 'domain' as const,
      articleCount: domain._count.articles,
      children: domain.categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        color: category.color,
        type: 'category' as const,
        articleCount: category._count.articles,
        children: category.subcategories.map(subcategory => ({
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          description: subcategory.description,
          icon: subcategory.icon,
          color: subcategory.color,
          type: 'subcategory' as const,
          articleCount: 0, // 需要单独查询
        })),
      })),
    }));
  }

  /**
   * 搜索分类
   */
  static async searchCategories(query: string, limit: number = 20) {
    return prisma.category.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        domain: true,
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

  /**
   * 根据 ID 获取域名
   */
  static async getDomainById(id: string) {
    return prisma.domain.findUnique({
      where: { id },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                articles: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  /**
   * 更新域名
   */
  static async updateDomain(id: string, data: { name?: string; description?: string; icon?: string; order?: number }) {
    try {
      return await prisma.domain.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        include: {
          categories: {
            where: { isActive: true },
            include: {
              _count: {
                select: {
                  articles: true,
                },
              },
            },
            orderBy: { order: 'asc' },
          },
          _count: {
            select: {
              articles: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * 删除域名（软删除）
   */
  static async deleteDomain(id: string) {
    try {
      await prisma.domain.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  /**
   * 创建域名
   */
  static async createDomain(data: { name: string; description?: string; icon?: string; order?: number }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');

    return prisma.domain.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        order: data.order || 0,
        isActive: true,
      },
      include: {
        categories: {
          where: { isActive: true },
          include: {
            _count: {
              select: {
                articles: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  /**
   * 根据 ID 获取分类
   */
  static async getCategoryById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        domain: true,
        subcategories: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        articles: {
          where: { published: true },
          include: {
            author: true,
            tags: {
              include: {
                tag: true,
              },
            },
          },
          orderBy: { publishedAt: 'desc' },
        },
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  /**
   * 更新分类
   */
  static async updateCategory(id: string, data: {
    name?: string;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
  }) {
    try {
      const updateData: any = {
        ...data,
        updatedAt: new Date(),
      };

      // 如果更新名称，也更新 slug
      if (data.name) {
        updateData.slug = data.name.toLowerCase().replace(/\s+/g, '-');
      }

      return await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          domain: true,
          _count: {
            select: {
              articles: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  /**
   * 创建分类
   */
  static async createCategory(data: {
    name: string;
    domainId: string;
    description?: string;
    icon?: string;
    color?: string;
    order?: number;
  }) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-');

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        icon: data.icon,
        color: data.color || '#6B7280',
        order: data.order || 0,
        isActive: true,
        domainId: data.domainId,
      },
      include: {
        domain: true,
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  /**
   * 删除分类（软删除）
   */
  static async deleteCategory(id: string) {
    try {
      await prisma.category.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error: any) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }
}
