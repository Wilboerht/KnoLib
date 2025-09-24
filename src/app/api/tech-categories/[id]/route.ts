/**
 * Tech Category API Routes
 * 
 * GET /api/tech-categories/[id] - Get tech category by ID
 * PUT /api/tech-categories/[id] - Update tech category
 * DELETE /api/tech-categories/[id] - Delete tech category
 */

import { NextRequest, NextResponse } from 'next/server';
import { TechCategoryService } from '@/lib/database/tech-category-service';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const category = await TechCategoryService.getCategoryById(id);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tech category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error fetching tech category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch tech category',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, icon, color, order, isActive, isProtected, password } = body;

    // Check if category exists
    const existingCategory = await TechCategoryService.getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tech category not found',
        },
        { status: 404 }
      );
    }

    // Check if name already exists (excluding current category)
    if (name && name !== existingCategory.name) {
      const nameExists = await TechCategoryService.categoryNameExists(name, id);
      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category name already exists',
          },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists (excluding current category)
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await TechCategoryService.categorySlugExists(slug, id);
      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Category slug already exists',
          },
          { status: 400 }
        );
      }
    }

    // Validate password for protected categories
    if (isProtected) {
      // If password is provided, validate it
      if (password !== undefined && password.length < 6) {
        return NextResponse.json(
          {
            success: false,
            error: 'Password must be at least 6 characters for protected categories',
          },
          { status: 400 }
        );
      }

      // If category is newly protected and no password provided, require it
      if (!existingCategory.isProtected && (!password || password.length < 6)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Password is required for protected categories',
          },
          { status: 400 }
        );
      }
    }

    const category = await TechCategoryService.updateCategory(id, {
      name,
      slug,
      description,
      icon,
      color,
      order,
      isActive,
      isProtected,
      password,
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Error updating tech category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update tech category',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Check if category exists
    const existingCategory = await TechCategoryService.getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tech category not found',
        },
        { status: 404 }
      );
    }

    await TechCategoryService.deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: 'Tech category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tech category:', error);
    
    if (error instanceof Error && error.message.includes('Cannot delete category with existing solutions')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete category with existing solutions',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete tech category',
      },
      { status: 500 }
    );
  }
}
