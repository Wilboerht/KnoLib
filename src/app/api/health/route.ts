/**
 * Health Check API Endpoint
 * Used by Docker health checks and monitoring systems
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database connection
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbTime = Date.now() - dbStart;

    // Check if database has required tables
    const userCount = await prisma.user.count();
    
    // Basic system info
    const systemInfo = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    // Response time
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: {
          status: 'healthy',
          responseTime: `${dbTime}ms`,
          userCount,
        },
        system: {
          status: 'healthy',
          ...systemInfo,
        },
      },
      responseTime: `${responseTime}ms`,
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks: {
        database: {
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Database connection failed',
        },
        system: {
          status: 'healthy',
          uptime: process.uptime(),
        },
      },
      responseTime: `${responseTime}ms`,
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }
}

// Also support HEAD requests for simple health checks
export async function HEAD(request: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
