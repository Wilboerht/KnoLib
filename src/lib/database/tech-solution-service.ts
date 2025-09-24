/**
 * Tech Solution Service
 * 
 * Handles all database operations for tech solutions
 */

import { prisma } from '@/lib/prisma';
import { TechSolution, Difficulty } from '@prisma/client';

export interface TechSolutionQueryParams {
  categoryId?: string;
  category?: string; // slug
  published?: boolean;
  difficulty?: Difficulty;
  search?: string;
  techStack?: string[];
  limit?: number;
  offset?: number;
  exclude?: string;
}

export interface CreateTechSolutionData {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  categoryId?: string;
  techStack?: string[];
  projectType?: string;
  difficulty?: Difficulty;
  published?: boolean;
  publishedAt?: Date;
}

export interface UpdateTechSolutionData {
  title?: string;
  slug?: string;
  content?: string;
  summary?: string;
  categoryId?: string;
  techStack?: string[];
  projectType?: string;
  difficulty?: Difficulty;
  published?: boolean;
  publishedAt?: Date;
}

export class TechSolutionService {
  /**
   * Get tech solutions with filters
   */
  static async getSolutions(params: TechSolutionQueryParams = {}) {
    const {
      categoryId,
      category,
      published,
      difficulty,
      search,
      techStack,
      limit,
      offset,
      exclude,
    } = params;

    const where: any = {};

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (category) {
      where.category = { slug: category };
    }

    // Filter by published status
    if (published !== undefined) {
      where.published = published;
    }

    // Filter by difficulty
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Search in title, summary, content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by tech stack
    if (techStack && techStack.length > 0) {
      where.techStack = {
        hasSome: techStack,
      };
    }

    // Exclude specific solution
    if (exclude) {
      where.id = { not: exclude };
    }

    return prisma.techSolution.findMany({
      where,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            tags: true,
          },
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get solution by slug
   */
  static async getSolutionBySlug(slug: string) {
    return prisma.techSolution.findUnique({
      where: { slug },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Get solution by ID
   */
  static async getSolutionById(id: string) {
    return prisma.techSolution.findUnique({
      where: { id },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Create new tech solution
   */
  static async createSolution(data: CreateTechSolutionData) {
    return prisma.techSolution.create({
      data: {
        ...data,
        techStack: data.techStack || [],
        difficulty: data.difficulty || 'INTERMEDIATE',
        publishedAt: data.published ? (data.publishedAt || new Date()) : null,
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Update tech solution
   */
  static async updateSolution(id: string, data: UpdateTechSolutionData) {
    const updateData: any = { ...data };

    // Handle published status
    if (data.published !== undefined) {
      if (data.published && !data.publishedAt) {
        updateData.publishedAt = new Date();
      } else if (!data.published) {
        updateData.publishedAt = null;
      }
    }

    return prisma.techSolution.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  /**
   * Delete tech solution
   */
  static async deleteSolution(id: string) {
    return prisma.techSolution.delete({
      where: { id },
    });
  }

  /**
   * Check if solution slug exists
   */
  static async solutionSlugExists(slug: string, excludeId?: string) {
    const where: any = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const solution = await prisma.techSolution.findFirst({ where });
    return !!solution;
  }

  /**
   * Search tech solutions
   */
  static async searchSolutions(params: {
    search: string;
    limit?: number;
    offset?: number;
  }) {
    const { search, limit = 10, offset = 0 } = params;

    return prisma.techSolution.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { summary: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
          { techStack: { hasSome: [search] } },
        ],
      },
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [
        { views: 'desc' },
        { publishedAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get related solutions
   */
  static async getRelatedSolutions(solutionId: string, limit: number = 4) {
    const solution = await prisma.techSolution.findUnique({
      where: { id: solutionId },
      select: { categoryId: true, techStack: true, difficulty: true },
    });

    if (!solution) return [];

    return prisma.techSolution.findMany({
      where: {
        id: { not: solutionId },
        published: true,
        OR: [
          { categoryId: solution.categoryId },
          { techStack: { hasSome: solution.techStack } },
          { difficulty: solution.difficulty },
        ],
      },
      include: {
        category: true,
        _count: {
          select: {
            tags: true,
          },
        },
      },
      orderBy: [
        { views: 'desc' },
      ],
      take: limit,
    });
  }



  /**
   * Increment view count for a solution
   */
  static async incrementViews(id: string) {
    return prisma.techSolution.update({
      where: { id },
      data: {
        views: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }
}
