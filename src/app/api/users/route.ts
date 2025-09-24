/**
 * User API Routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth/jwt';
import bcrypt from 'bcryptjs';

// GET /api/users - Get user list
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Failed to get user list:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get user list',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    // Verify user permissions
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, name, role, isActive, password } = body;

    // Validate required fields
    if (!email?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Email address cannot be empty' },
        { status: 400 }
      );
    }

    if (!password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Password cannot be empty' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'This email address is already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name?.trim() || null,
        password: hashedPassword,
        role: role || 'AUTHOR',
        isActive: isActive !== undefined ? isActive : true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
