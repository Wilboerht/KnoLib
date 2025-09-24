/**
 * Individual OAuth Provider Configuration Management API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAdminAuth } from '@/lib/auth/middleware';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/oauth-providers/[id] - Get individual OAuth provider configuration
export const GET = withAdminAuth(async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    
    const provider = await prisma.oAuthProvider.findUnique({
      where: { id },
    });

    if (!provider) {
      return NextResponse.json(
        {
          success: false,
          error: 'OAuth provider not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: provider,
    });
  } catch (error) {
    console.error('Failed to get OAuth provider configuration:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

// PUT /api/admin/oauth-providers/[id] - Update individual OAuth provider configuration
export const PUT = withAdminAuth(async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const { displayName, clientId, clientSecret, enabled, order, icon, color } = body;

    const provider = await prisma.oAuthProvider.update({
      where: { id },
      data: {
        displayName,
        clientId,
        clientSecret,
        enabled,
        order,
        icon,
        color,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        enabled: true,
        order: true,
        icon: true,
        color: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: provider,
      message: 'Configuration updated successfully'
    });
  } catch (error) {
    console.error('Failed to update OAuth provider configuration:', error);
    
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        {
          success: false,
          error: 'OAuth provider not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});

// DELETE /api/admin/oauth-providers/[id] - Delete OAuth provider configuration
export const DELETE = withAdminAuth(async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { id } = await params;

    await prisma.oAuthProvider.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Configuration deleted successfully'
    });
  } catch (error) {
    console.error('Failed to delete OAuth provider configuration:', error);

    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        {
          success: false,
          error: 'OAuth provider not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete configuration',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
});
