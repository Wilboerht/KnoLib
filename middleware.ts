import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware for protecting tech-solutions routes
 * This middleware runs on the server side before the page is rendered
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to tech-solutions file pages
  if (pathname.match(/^\/tech-solutions\/[^\/]+\/[^\/]+$/)) {
    try {
      // Extract category slug from the URL
      const pathParts = pathname.split('/');
      const categorySlug = pathParts[2];

      // Check if this category is protected
      const categoryResponse = await fetch(
        `${request.nextUrl.origin}/api/tech-categories?slug=${categorySlug}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        
        if (categoryData.success && categoryData.data && categoryData.data.length > 0) {
          const category = categoryData.data[0];
          
          // If category is protected, check for verification
          if (category.isProtected) {
            // Check if the request has a verification cookie or header
            const verificationCookie = request.cookies.get(`tech-category-${categorySlug}-verified`);
            const sessionVerification = request.headers.get('x-category-verified');
            
            // If no verification found, redirect to category page
            if (!verificationCookie && sessionVerification !== 'true') {
              const categoryUrl = new URL(`/tech-solutions/${categorySlug}`, request.url);
              categoryUrl.searchParams.set('access_denied', 'true');
              return NextResponse.redirect(categoryUrl);
            }
          }
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
      // On error, allow the request to continue but log the issue
    }
  }

  // Continue with the request
  return NextResponse.next();
}

/**
 * Configure which routes this middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all tech-solutions file pages:
     * - /tech-solutions/category/file-slug
     * - Exclude API routes and static files
     */
    '/tech-solutions/:category/:slug*',
  ],
};
