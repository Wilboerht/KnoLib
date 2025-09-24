/**
 * Category article list page
 *
 * Dynamic route: /knowledge/[category]
 * Shows all articles under this category
 */

import * as React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CategoryArticleList } from "@/components/category/category-article-list";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

// Get category and article data
async function getCategoryData(categorySlug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/categories/${categorySlug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    
    if (!result.success) {
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to get category data:', error);
    return null;
  }
}

// Generate page metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = await getCategoryData(category);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }
  
  return {
    title: `${categoryData.name} | KnoLib`,
    description: categoryData.description || `Browse articles in ${categoryData.name} category`,
    keywords: `${categoryData.name}, knowledge base, articles, tutorials`,
    openGraph: {
      title: categoryData.name,
      description: categoryData.description || `Browse articles in ${categoryData.name} category`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: categoryData.name,
      description: categoryData.description || `Browse articles in ${categoryData.name} category`,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryData = await getCategoryData(category);
  
  if (!categoryData) {
    notFound();
  }
  
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <Container>
        <CategoryArticleList category={categoryData} />
      </Container>
    </div>
  );
}
