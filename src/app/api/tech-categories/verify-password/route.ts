/**
 * Tech Category Password Verification API
 * 
 * POST /api/tech-categories/verify-password - Verify category password by slug
 */

import { NextRequest, NextResponse } from 'next/server';
import { TechCategoryService } from '@/lib/database/tech-category-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, password } = body;

    if (!slug || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category slug and password are required',
        },
        { status: 400 }
      );
    }

    // Get category by slug
    const category = await TechCategoryService.getCategoryBySlug(slug);
    
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    if (!category.isProtected) {
      return NextResponse.json(
        {
          success: true,
          message: 'Category is not protected',
        }
      );
    }

    // Verify password
    const isValid = await TechCategoryService.verifyPassword(category.id, password);

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'Password verified successfully',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid password',
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error verifying category password:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify password',
      },
      { status: 500 }
    );
  }
}
