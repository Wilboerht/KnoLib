/**
 * User Registration API
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

// POST /api/auth/register - User registration (disabled)
export async function POST(request: NextRequest) {
  // Disable public registration, only allow admin to create accounts
  return NextResponse.json(
    {
      success: false,
      error: 'New user registration is disabled',
      message: 'Please contact administrator to create an account'
    },
    { status: 403 }
  );

}
