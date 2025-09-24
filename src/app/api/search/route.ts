/**
 * Search API route
 *
 * Provides global search functionality, supports searching articles, categories, tags
 */

import { NextRequest, NextResponse } from 'next/server';
import { ArticleService } from '@/lib/database/article-service';
import { CategoryService } from '@/lib/database/category-service';
import { TagService } from '@/lib/database/tag-service';

// GET /api/search - Global search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type'); // 'articles', 'categories', 'tags', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Search query must be at least 2 characters',
          message: 'Search query must be at least 2 characters long'
        },
        { status: 400 }
      );
    }

    const results: any = {
      articles: [],
      categories: [],
      tags: [],
      total: 0,
    };

    // Search articles
    if (!type || type === 'articles' || type === 'all') {
      const articles = await ArticleService.searchArticles({
        search: query,
        limit: type === 'articles' ? limit : 10,
        offset: type === 'articles' ? offset : 0,
      });
      results.articles = articles;
    }

    // Search categories
    if (!type || type === 'categories' || type === 'all') {
      const categories = await CategoryService.searchCategories(query, 10);
      results.categories = categories;
    }

    // Search tags
    if (!type || type === 'tags' || type === 'all') {
      const tags = await TagService.searchTags(query, 10);
      results.tags = tags;
    }

    // Calculate total count
    results.total = results.articles.length + results.categories.length + results.tags.length;

    return NextResponse.json({
      success: true,
      data: results,
      query,
      type: type || 'all',
    });
  } catch (error) {
    console.error('Search failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
