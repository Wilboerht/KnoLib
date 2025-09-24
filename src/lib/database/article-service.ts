/**
 * 文章数据库服务
 * 
 * 提供文章相关的数据库操作
 */

import { prisma } from '@/lib/prisma';
import { Prisma, Article, Difficulty } from '@prisma/client';

// 文章查询参数
export interface ArticleQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  categoryId?: string;
  domain?: string;
  difficulty?: Difficulty;
  featured?: boolean;
  published?: boolean;
  search?: string;
  tags?: string[];
  authorId?: string;
}

// 文章创建参数
export interface CreateArticleData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  difficulty?: Difficulty;
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  publishedAt?: Date;
  authorId: string;
  domainId: string;
  categoryId?: string;
  subcategoryId?: string;
  tags?: string[];
  codeExamples?: Array<{
    language: string;
    code: string;
    description?: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
}

// 文章更新参数
export type UpdateArticleData = Partial<CreateArticleData>;

// 文章包含关联数据的类型
export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: {
    author: true;
    domain: true;
    category: true;
    subcategory: true;
    tags: {
      include: {
        tag: true;
      };
    };
    codeExamples: true;
    seo: true;
  };
}>;

export class ArticleService {
  /**
   * 获取文章列表
   */
  static async getArticles(params: ArticleQueryParams = {}) {
    const {
      page = 1,
      limit = 10,
      category,
      categoryId,
      domain,
      difficulty,
      featured,
      published = true,
      search,
      tags,
      authorId,
    } = params;

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: Prisma.ArticleWhereInput = {
      published,
      ...(category && { category: { slug: category } }),
      ...(categoryId && { categoryId }),
      ...(domain && { domain: { slug: domain } }),
      ...(difficulty && { difficulty }),
      ...(featured !== undefined && { featured }),
      ...(authorId && { authorId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { excerpt: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(tags && tags.length > 0 && {
        tags: {
          some: {
            tag: {
              slug: { in: tags },
            },
          },
        },
      }),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: true,
          domain: true,
          category: true,
          subcategory: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              codeExamples: true,
            },
          },
        },
        orderBy: [
          { featured: 'desc' },
          { publishedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 根据 slug 获取单篇文章
   */
  static async getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
    return prisma.article.findUnique({
      where: { slug, published: true },
      include: {
        author: true,
        domain: true,
        category: true,
        subcategory: true,
        tags: {
          include: {
            tag: true,
          },
        },
        codeExamples: {
          orderBy: { order: 'asc' },
        },
        seo: true,
      },
    });
  }

  /**
   * 获取特色文章
   */
  static async getFeaturedArticles(limit: number = 6) {
    return prisma.article.findMany({
      where: {
        featured: true,
        published: true,
      },
      include: {
        author: true,
        domain: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * 获取最新文章
   */
  static async getLatestArticles(limit: number = 5) {
    return prisma.article.findMany({
      where: { published: true },
      include: {
        author: true,
        domain: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * 获取相关文章
   */
  static async getRelatedArticles(articleId: string, limit: number = 3) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!article) return [];

    const tagIds = article.tags.map(t => t.tag.id);

    return prisma.article.findMany({
      where: {
        id: { not: articleId },
        published: true,
        OR: [
          { categoryId: article.categoryId },
          { domainId: article.domainId },
          ...(tagIds.length > 0 ? [{
            tags: {
              some: {
                tagId: { in: tagIds },
              },
            },
          }] : []),
        ],
      },
      include: {
        author: true,
        domain: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  /**
   * 创建文章
   */
  static async createArticle(data: CreateArticleData) {
    const { tags, codeExamples, seo, ...articleData } = data;

    // 清理数据，移除不属于数据库模型的字段
    const cleanArticleData = {
      title: articleData.title,
      slug: articleData.slug,
      excerpt: articleData.excerpt,
      content: articleData.content,
      difficulty: articleData.difficulty,
      readTime: articleData.readTime,
      featured: articleData.featured,
      published: articleData.published,
      publishedAt: articleData.publishedAt ? new Date(articleData.publishedAt) : undefined,
      authorId: articleData.authorId,
      domainId: articleData.domainId,
      categoryId: articleData.categoryId,
      subcategoryId: articleData.subcategoryId,
    };

    return prisma.article.create({
      data: {
        ...cleanArticleData,
        ...(tags && tags.length > 0 && {
          tags: {
            create: tags.map(tagSlug => ({
              tag: {
                connectOrCreate: {
                  where: { slug: tagSlug },
                  create: {
                    name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1),
                    slug: tagSlug,
                  },
                },
              },
            })),
          },
        }),
        ...(codeExamples && codeExamples.length > 0 && {
          codeExamples: {
            create: codeExamples.map((example, index) => ({
              ...example,
              order: index,
            })),
          },
        }),
        ...(seo && {
          seo: {
            create: seo,
          },
        }),
      },
      include: {
        author: true,
        domain: true,
        category: true,
        subcategory: true,
        tags: {
          include: {
            tag: true,
          },
        },
        codeExamples: true,
        seo: true,
      },
    });
  }

  /**
   * 更新文章
   */
  static async updateArticle(id: string, data: UpdateArticleData) {
    const { tags, codeExamples, seo, authorId, ...articleData } = data;

    // 排除 authorId 字段，因为这是个人知识分享平台，不允许更改作者
    return prisma.article.update({
      where: { id },
      data: {
        ...articleData,
        updatedAt: new Date(),
        ...(tags && {
          tags: {
            deleteMany: {},
            create: tags.map(tagSlug => ({
              tag: {
                connectOrCreate: {
                  where: { slug: tagSlug },
                  create: {
                    name: tagSlug.charAt(0).toUpperCase() + tagSlug.slice(1),
                    slug: tagSlug,
                  },
                },
              },
            })),
          },
        }),
        ...(codeExamples && {
          codeExamples: {
            deleteMany: {},
            create: codeExamples.map((example, index) => ({
              ...example,
              order: index,
            })),
          },
        }),
        ...(seo && {
          seo: {
            upsert: {
              create: seo,
              update: seo,
            },
          },
        }),
      },
      include: {
        author: true,
        domain: true,
        category: true,
        subcategory: true,
        tags: {
          include: {
            tag: true,
          },
        },
        codeExamples: true,
        seo: true,
      },
    });
  }

  /**
   * 删除文章
   */
  static async deleteArticle(id: string) {
    return prisma.article.delete({
      where: { id },
    });
  }

  /**
   * 获取文章统计信息
   */
  static async getArticleStats() {
    const [
      total,
      published,
      featured,
      byDifficulty,
      byCategory,
      byDomain,
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.article.count({ where: { featured: true, published: true } }),
      prisma.article.groupBy({
        by: ['difficulty'],
        where: { published: true },
        _count: true,
      }),
      prisma.article.groupBy({
        by: ['categoryId'],
        where: { published: true, categoryId: { not: null } },
        _count: true,
      }),
      prisma.article.groupBy({
        by: ['domainId'],
        where: { published: true },
        _count: true,
      }),
    ]);

    return {
      total,
      published,
      featured,
      byDifficulty: Object.fromEntries(
        byDifficulty.map(item => [item.difficulty, item._count])
      ),
      byCategory: Object.fromEntries(
        byCategory.map(item => [item.categoryId, item._count])
      ),
      byDomain: Object.fromEntries(
        byDomain.map(item => [item.domainId, item._count])
      ),
    };
  }

  /**
   * 搜索文章
   */
  static async searchArticles(options: GetArticlesOptions) {
    const {
      search,
      categoryId,
      tags,
      difficulty,
      authorId,
      limit = 20,
      offset = 0,
    } = options;

    const whereCondition: any = {
      published: true,
    };

    // 搜索条件
    if (search) {
      whereCondition.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 分类筛选
    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    // 难度筛选
    if (difficulty) {
      whereCondition.difficulty = difficulty;
    }

    // 作者筛选
    if (authorId) {
      whereCondition.authorId = authorId;
    }

    // 标签筛选
    if (tags && tags.length > 0) {
      whereCondition.tags = {
        some: {
          tag: {
            slug: {
              in: tags,
            },
          },
        },
      };
    }

    return prisma.article.findMany({
      where: whereCondition,
      include: {
        author: true,
        category: {
          include: {
            domain: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });
  }
}
