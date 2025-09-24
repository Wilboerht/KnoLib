/**
 * Tech Solution View Count API
 * 
 * POST /api/tech-solutions/[id]/view - Increment view count
 */

import { NextRequest, NextResponse } from 'next/server';
import { TechSolutionService } from '@/lib/database/tech-solution-service';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Try to get by ID first, then by slug
    let solution = await TechSolutionService.getSolutionById(id);
    
    if (!solution) {
      // Try to get by slug
      solution = await TechSolutionService.getSolutionBySlug(id);
    }

    if (!solution) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tech solution not found',
        },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.techSolution.update({
      where: { id: solution.id },
      data: {
        views: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'View count incremented',
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to increment view count',
      },
      { status: 500 }
    );
  }
}
