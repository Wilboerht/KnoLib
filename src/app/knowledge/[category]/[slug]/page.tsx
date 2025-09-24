/**
 * Article detail page
 *
 * Dynamic route: /knowledge/[category]/[slug]
 */

import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ArticleContent } from "@/components/article/article-content";
import { ArticleMeta } from "@/components/article/article-meta";
import { ArticleNavigation } from "@/components/article/article-navigation";

interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Get article data
async function getArticle(categorySlug: string, articleSlug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/articles/${articleSlug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    
    if (!result.success) {
      return null;
    }
    
    // Verify if article belongs to specified category
    // Allow 'general' category for articles without a specific category
    if (result.data.category?.slug !== categorySlug &&
        !(categorySlug === 'general' && !result.data.category)) {
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to get article:', error);
    return null;
  }
}

// Generate page metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  
  return {
    title: `${article.title} | KnoLib`,
    description: article.excerpt || `Learn about ${article.title}`,
    keywords: article.tags?.map((tag: any) => tag.tag.name).join(', '),
    openGraph: {
      title: article.title,
      description: article.excerpt || `Learn about ${article.title}`,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author?.name || 'KnoLib'],
      tags: article.tags?.map((tag: any) => tag.tag.name),
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || `Learn about ${article.title}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  const article = await getArticle(category, slug);
  
  if (!article) {
    notFound();
  }
  
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Article meta information */}
          <ArticleMeta article={article} />

          {/* Article content */}
          <ArticleContent article={article} />

          {/* Article navigation */}
          <ArticleNavigation 
            category={article.category}
            currentSlug={article.slug}
          />
        </div>
      </Container>
    </div>
  );
}
