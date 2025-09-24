/**
 * Article navigation component
 *
 * Shows other articles in the same category, provides previous/next navigation
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArticleNavigationProps {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  currentSlug: string;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
}

export function ArticleNavigation({ category, currentSlug }: ArticleNavigationProps) {
  const [allArticles, setAllArticles] = React.useState<RelatedArticle[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load other articles in the same category
  React.useEffect(() => {
    const loadRelatedArticles = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/articles?categoryId=${category.id}`);
        const result = await response.json();

        if (result.success) {
          // Keep all articles for navigation
          setAllArticles(result.data);
        }
      } catch (error) {
        console.error('Failed to load related articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedArticles();
  }, [category, currentSlug]);

  // Get current article position in the list
  const currentIndex = allArticles.findIndex(article => article.slug === currentSlug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Get related articles (excluding current article)
  const relatedArticles = allArticles.filter(article => article.slug !== currentSlug);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400">Loading related articles...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Previous/Next article navigation */}
      {(prevArticle || nextArticle) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Previous article */}
          <div>
            {prevArticle ? (
              <Link href={`/knowledge/${category?.slug}/${prevArticle.slug}`}>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prevArticle.title}
                  </h3>
                  {prevArticle.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {prevArticle.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg opacity-50">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  No previous article
                </div>
              </div>
            )}
          </div>

          {/* Next article */}
          <div>
            {nextArticle ? (
              <Link href={`/knowledge/${category?.slug}/${nextArticle.slug}`}>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group text-right">
                  <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {nextArticle.title}
                  </h3>
                  {nextArticle.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {nextArticle.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg opacity-50 text-right">
                <div className="flex items-center justify-end text-sm text-gray-400 mb-2">
                  No next article
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other articles in the same category */}
      {relatedArticles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Other articles in {category?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.slice(0, 4).map((article) => (
              <Link
                key={article.id}
                href={`/knowledge/${category?.slug}/${article.slug}`}
              >
                <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all group">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {article.title}
                  </h4>
                  {article.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          
          {relatedArticles.length > 4 && (
            <div className="mt-4 text-center">
              <Link href={`/knowledge/${category?.slug}`}>
                <Button variant="outline">
                  View all articles in {category?.name} ({relatedArticles.length + 1})
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Back to category page */}
      {category && (
        <div className="mt-8 text-center">
          <Link href={`/knowledge/${category.slug}`}>
            <Button variant="ghost">
              Back to {category.name}
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
}
