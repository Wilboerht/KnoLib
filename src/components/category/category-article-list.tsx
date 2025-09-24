/**
 * Category article list component
 *
 * Shows all articles under a specific category
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  readTime?: number;
  difficulty?: string;
  author?: {
    id: string;
    name: string;
  };
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
      color?: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  domain?: {
    id: string;
    name: string;
    slug: string;
  };
  articles: Article[];
  _count?: {
    articles: number;
  };
}

interface CategoryArticleListProps {
  category: Category;
}

export function CategoryArticleList({ category }: CategoryArticleListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredArticles, setFilteredArticles] = React.useState<Article[]>(category.articles);

  // Search filtering
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredArticles(category.articles);
    } else {
      const filtered = category.articles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, category.articles]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyText = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return difficulty || '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back button and breadcrumb */}
        <div className="mb-6">
          <Link href="/knowledge">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Base
            </Button>
          </Link>

          {/* Breadcrumb navigation */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/knowledge" className="hover:text-gray-900 dark:hover:text-gray-200">
              Knowledge Base
            </Link>
            <span>/</span>
            {category.domain && (
              <>
                <Link 
                  href={`/knowledge?domain=${category.domain.slug}`}
                  className="hover:text-gray-900 dark:hover:text-gray-200"
                >
                  {category.domain.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-900 dark:text-gray-200">{category.name}</span>
          </nav>
        </div>

        {/* Category information */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <div 
              className="w-12 h-12 flex items-center justify-center rounded-lg mr-4"
              style={{ backgroundColor: category.color + '20' }}
            >
              <div 
                className="w-6 h-6 rounded"
                style={{ backgroundColor: category.color }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {category.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {category.articles.length} articles
              </p>
            </div>
          </div>
          
          {category.description && (
            <p className="text-gray-700 dark:text-gray-300">
              {category.description}
            </p>
          )}
        </div>

        {/* Search box */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Article list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {filteredArticles.length > 0 ? (
          <div className="space-y-6">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/knowledge/${category.slug}/${article.slug}`}>
                  <div className="group">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {article.title}
                    </h2>
                    
                    {article.excerpt && (
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                    
                    {/* Article meta information */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {article.publishedAt && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </div>
                      )}
                      
                      {article.readTime && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {article.readTime} min read
                        </div>
                      )}
                      
                      {article.difficulty && (
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
                          {getDifficultyText(article.difficulty)}
                        </span>
                      )}
                    </div>
                    
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {article.tags.slice(0, 3).map(({ tag }) => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            style={tag.color ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
                          >
                            {tag.name}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No matching articles found' : 'No articles yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No articles found containing "${searchQuery}"`
                : `No articles have been published in ${category.name} category yet`
              }
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear search
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
