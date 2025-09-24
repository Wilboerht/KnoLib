/**
 * Tech Categories API Routes
 * 
 * GET /api/tech-categories - Get all tech categories
 * POST /api/tech-categories - Create new tech category
 */

import { NextRequest, NextResponse } from 'next/server';
import { TechCategoryService } from '@/lib/database/tech-category-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const params: any = {};
    if (isActive !== null) {
      params.isActive = isActive === 'true';
    }

    const categories = await TechCategoryService.getCategories(params);

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching tech categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tech categories',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, color, order, isProtected, password } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and slug are required',
        },
        { status: 400 }
      );
    }

    // Validate password for protected categories
    if (isProtected && (!password || password.length < 6)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password is required and must be at least 6 characters for protected categories',
        },
        { status: 400 }
      );
    }

    // Check if name already exists
    const nameExists = await TechCategoryService.categoryNameExists(name);
    if (nameExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category name already exists',
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const slugExists = await TechCategoryService.categorySlugExists(slug);
    if (slugExists) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category slug already exists',
        },
        { status: 400 }
      );
    }

    const category = await TechCategoryService.createCategory({
      name,
      slug,
      description,
      icon,
      color,
      order,
      isProtected,
      password,
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error creating tech category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create tech category',
      },
      { status: 500 }
    );
  }
}
