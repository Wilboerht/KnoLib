/**
 * Article meta information component
 *
 * Displays article metadata such as author, publish time, read time, etc.
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArticleMetaProps {
  article: {
    id: string;
    title: string;
    publishedAt?: string;
    updatedAt: string;
    readTime?: number;
    difficulty?: string;
    author?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
    domain?: {
      id: string;
      name: string;
      slug: string;
    };
    category?: {
      id: string;
      name: string;
      slug: string;
      color?: string;
    };
  };
}

export function ArticleMeta({ article }: ArticleMetaProps) {
  const formatDate = (dateString: string) => {
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
        return difficulty || 'Not Set';
    }
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Back button */}
      <div className="mb-6">
        <Link href="/knowledge">
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Knowledge Base
          </Button>
        </Link>
      </div>

      {/* Breadcrumb navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link href="/knowledge" className="hover:text-gray-900 dark:hover:text-gray-200">
          Knowledge Base
        </Link>
        <span>/</span>
        {article.domain && (
          <>
            <Link 
              href={`/knowledge?domain=${article.domain.slug}`}
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              {article.domain.name}
            </Link>
            <span>/</span>
          </>
        )}
        {article.category && (
          <>
            <Link 
              href={`/knowledge/${article.category.slug}`}
              className="hover:text-gray-900 dark:hover:text-gray-200"
            >
              {article.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 dark:text-gray-200">{article.title}</span>
      </nav>

      {/* Article meta information */}
      <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
        <div className="flex flex-wrap items-center gap-6">
          {/* Publish time */}
          {article.publishedAt && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {formatDate(article.publishedAt)}
              </span>
            </div>
          )}

          {/* Read time */}
          {article.readTime && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {article.readTime} min read
              </span>
            </div>
          )}

          {/* 分类 */}
          {article.category && (
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-4 w-4 text-gray-500" />
              <Link 
                href={`/knowledge/${article.category.slug}`}
                className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {article.category.name}
              </Link>
            </div>
          )}

          {/* Difficulty level */}
          {article.difficulty && (
            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(article.difficulty)}`}>
              {getDifficultyText(article.difficulty)}
            </span>
          )}
        </div>

        {/* Update time */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {formatDate(article.updatedAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
