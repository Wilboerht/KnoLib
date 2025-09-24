/**
 * 客户端文章 API 服务
 * 
 * 提供前端调用后端 API 的封装函数
 */

import { Article } from '@prisma/client';

// API 响应类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 查询参数类型
interface ArticleQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  domain?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  featured?: boolean;
  search?: string;
  tags?: string[];
  authorId?: string;
}

// 创建文章数据类型
interface CreateArticleData {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  readTime?: number;
  featured?: boolean;
  published?: boolean;
  publishedAt?: string;
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

export class ArticleAPI {
  private static baseUrl = '/api/articles';

  /**
   * 获取文章列表
   */
  static async getArticles(params: ArticleQueryParams = {}): Promise<ApiResponse<Article[]>> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','));
          } else {
            searchParams.set(key, String(value));
          }
        }
      });

      const url = `${this.baseUrl}?${searchParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('获取文章列表失败:', error);
      return {
        success: false,
        error: '获取文章列表失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 获取单个文章
   */
  static async getArticle(slug: string): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            error: '文章未找到'
          };
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('获取文章失败:', error);
      return {
        success: false,
        error: '获取文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 创建文章
   */
  static async createArticle(data: CreateArticleData): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || '创建文章失败',
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      console.error('创建文章失败:', error);
      return {
        success: false,
        error: '创建文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 更新文章
   */
  static async updateArticle(slug: string, data: Partial<CreateArticleData>): Promise<ApiResponse<Article>> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || '更新文章失败',
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      console.error('更新文章失败:', error);
      return {
        success: false,
        error: '更新文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 删除文章
   */
  static async deleteArticle(slug: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/${slug}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || '删除文章失败',
          message: result.message
        };
      }
      
      return result;
    } catch (error) {
      console.error('删除文章失败:', error);
      return {
        success: false,
        error: '删除文章失败',
        message: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  /**
   * 获取特色文章
   */
  static async getFeaturedArticles(limit: number = 6): Promise<ApiResponse<Article[]>> {
    return this.getArticles({ featured: true, limit });
  }

  /**
   * 搜索文章
   */
  static async searchArticles(query: string, params: Omit<ArticleQueryParams, 'search'> = {}): Promise<ApiResponse<Article[]>> {
    return this.getArticles({ ...params, search: query });
  }
}
