/**
 * Tech Category Service
 * 
 * Handles all database operations for tech solution categories
 */

import { prisma } from '@/lib/prisma';
import { TechCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface TechCategoryQueryParams {
  isActive?: boolean;
}

export interface CreateTechCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  isProtected?: boolean;
  password?: string;
}

export interface UpdateTechCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  isActive?: boolean;
  isProtected?: boolean;
  password?: string;
}

export class TechCategoryService {
  /**
   * Get all tech categories
   */
  static async getCategories(params: TechCategoryQueryParams = {}) {
    const { isActive = true } = params;

    return prisma.techCategory.findMany({
      where: {
        isActive,
      },
      include: {
        _count: {
          select: {
            solutions: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string) {
    return prisma.techCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            solutions: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get category by slug
   */
  static async getCategoryBySlug(slug: string) {
    return prisma.techCategory.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            solutions: {
              where: {
                published: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Create new tech category
   */
  static async createCategory(data: CreateTechCategoryData) {
    const categoryData: any = {
      ...data,
      order: data.order ?? 0,
    };

    // Hash password if category is protected
    if (data.isProtected && data.password) {
      categoryData.password = await bcrypt.hash(data.password, 12);
    }

    return prisma.techCategory.create({
      data: categoryData,
    });
  }

  /**
   * Update tech category
   */
  static async updateCategory(id: string, data: UpdateTechCategoryData) {
    const updateData: any = { ...data };

    // Handle password field
    if (data.isProtected === false) {
      // Clear password if protection is being removed
      updateData.password = null;
    } else if (data.isProtected && data.password) {
      // Hash password if category is being protected and password is provided
      updateData.password = await bcrypt.hash(data.password, 12);
    } else if (data.password === undefined) {
      // If password is not provided, don't update it (keep existing password)
      delete updateData.password;
    }

    return prisma.techCategory.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete tech category
   */
  static async deleteCategory(id: string) {
    // Check if category has solutions
    const solutionsCount = await prisma.techSolution.count({
      where: { categoryId: id },
    });

    if (solutionsCount > 0) {
      throw new Error('Cannot delete category with existing solutions');
    }

    return prisma.techCategory.delete({
      where: { id },
    });
  }

  /**
   * Check if category name exists
   */
  static async categoryNameExists(name: string, excludeId?: string) {
    const where: any = { name };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const category = await prisma.techCategory.findFirst({ where });
    return !!category;
  }

  /**
   * Check if category slug exists
   */
  static async categorySlugExists(slug: string, excludeId?: string) {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const category = await prisma.techCategory.findFirst({ where });
    return !!category;
  }

  /**
   * Get categories with solution counts
   */
  static async getCategoriesWithCounts() {
    return prisma.techCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            solutions: {
              where: {
                published: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Reorder categories
   */
  static async reorderCategories(categoryOrders: { id: string; order: number }[]) {
    const updatePromises = categoryOrders.map(({ id, order }) =>
      prisma.techCategory.update({
        where: { id },
        data: { order },
      })
    );

    return Promise.all(updatePromises);
  }

  /**
   * Verify category password
   */
  static async verifyPassword(categoryId: string, password: string): Promise<boolean> {
    const category = await prisma.techCategory.findUnique({
      where: { id: categoryId },
      select: { password: true, isProtected: true },
    });

    if (!category || !category.isProtected || !category.password) {
      return false;
    }

    return bcrypt.compare(password, category.password);
  }

  /**
   * Check if category is protected
   */
  static async isProtected(categoryId: string): Promise<boolean> {
    const category = await prisma.techCategory.findUnique({
      where: { id: categoryId },
      select: { isProtected: true },
    });

    return category?.isProtected ?? false;
  }

  /**
   * Check if category is protected by slug
   */
  static async isProtectedBySlug(slug: string): Promise<boolean> {
    const category = await prisma.techCategory.findUnique({
      where: { slug },
      select: { isProtected: true },
    });

    return category?.isProtected ?? false;
  }
}
