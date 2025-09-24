/**
 * Tech Solutions API Routes
 * 
 * GET /api/tech-solutions - Get all tech solutions with filters
 * POST /api/tech-solutions - Create new tech solution
 */

import { NextRequest, NextResponse } from 'next/server';
import { TechSolutionService } from '@/lib/database/tech-solution-service';
import { Difficulty } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const categoryId = searchParams.get('categoryId');
    const category = searchParams.get('category');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const difficulty = searchParams.get('difficulty') as Difficulty;
    const search = searchParams.get('search');
    const techStack = searchParams.get('techStack')?.split(',').filter(Boolean);
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');
    const exclude = searchParams.get('exclude');

    const params: any = {};

    if (categoryId) params.categoryId = categoryId;
    if (category) params.category = category;
    if (published !== null) params.published = published === 'true';
    if (featured !== null) params.featured = featured === 'true';
    if (difficulty) params.difficulty = difficulty;
    if (search) params.search = search;
    if (techStack) params.techStack = techStack;
    if (limit) params.limit = parseInt(limit);
    if (offset) params.offset = parseInt(offset);
    if (exclude) params.exclude = exclude;

    const solutions = await TechSolutionService.getSolutions(params);

    return NextResponse.json({
      success: true,
      data: solutions,
    });
  } catch (error) {
    console.error('Error fetching tech solutions:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tech solutions',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      summary,
      categoryId,
      techStack,
      projectType,
      difficulty,
      published,
      publishedAt,
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, slug, and content are required',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const slugExists = await TechSolutionService.solutionSlugExists(slug);
    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Solution slug already exists',
        },
        { status: 400 }
      );
    }

    const solution = await TechSolutionService.createSolution({
      title,
      slug,
      content,
      summary,
      categoryId,
      techStack,
      projectType,
      difficulty,
      published,
      publishedAt: publishedAt ? new Date(publishedAt) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: solution,
    });
  } catch (error) {
    console.error('Error creating tech solution:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create tech solution',
      },
      { status: 500 }
    );
  }
}
