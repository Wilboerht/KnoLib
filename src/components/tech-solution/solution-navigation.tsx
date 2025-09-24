/**
 * Solution navigation component
 *
 * Shows other solutions in the same category, provides previous/next navigation
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SolutionNavigationProps {
  category?: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  currentSlug: string;
}

interface RelatedSolution {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  featured: boolean;
  views: number;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
}



export function SolutionNavigation({ category, currentSlug }: SolutionNavigationProps) {
  const [allSolutions, setAllSolutions] = React.useState<RelatedSolution[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Load other solutions in the same category
  React.useEffect(() => {
    const loadRelatedSolutions = async () => {
      if (!category) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tech-solutions?published=true&category=${category.slug}`);
        const result = await response.json();

        if (result.success) {
          // Keep all solutions for navigation
          setAllSolutions(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load related solutions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedSolutions();
  }, [category, currentSlug]);

  // Get current solution position in the list
  const currentIndex = allSolutions.findIndex(solution => solution.slug === currentSlug);
  const prevSolution = currentIndex > 0 ? allSolutions[currentIndex - 1] : null;
  const nextSolution = currentIndex < allSolutions.length - 1 ? allSolutions[currentIndex + 1] : null;

  // Get related solutions (excluding current solution)
  const relatedSolutions = allSolutions.filter(solution => solution.slug !== currentSlug);

  if (loading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
        <p className="text-gray-600 dark:text-gray-400">Loading related solutions...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="mt-12 pt-8 pb-16 border-t border-gray-200 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Previous/Next solution navigation */}
      {(prevSolution || nextSolution) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Previous solution */}
          <div>
            {prevSolution ? (
              <Link href={`/tech-solutions/${category?.slug}/${prevSolution.slug}`}>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {prevSolution.title}
                  </h3>
                  {prevSolution.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {prevSolution.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Eye className="h-3 w-3" />
                    {prevSolution.views}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg opacity-50">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  No previous solution
                </div>
              </div>
            )}
          </div>

          {/* Next solution */}
          <div>
            {nextSolution ? (
              <Link href={`/tech-solutions/${category?.slug}/${nextSolution.slug}`}>
                <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors group text-right">
                  <div className="flex items-center justify-end text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {nextSolution.title}
                  </h3>
                  {nextSolution.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {nextSolution.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Eye className="h-3 w-3" />
                    {nextSolution.views}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg opacity-50 text-right">
                <div className="flex items-center justify-end text-sm text-gray-400 mb-2">
                  No next solution
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other solutions in the same category */}
      {relatedSolutions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Other solutions in {category?.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedSolutions.slice(0, 3).map((solution) => (
              <Link
                key={solution.id}
                href={`/tech-solutions/${category?.slug}/${solution.slug}`}
              >
                <div className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all group">
                  <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                    {solution.title}
                  </h4>
                  {solution.excerpt && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                      {solution.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Eye className="h-3 w-3" />
                    {solution.views}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {relatedSolutions.length > 3 && (
            <div className="mt-4 text-center">
              <Link href={`/tech-solutions/${category?.slug}`}>
                <Button variant="outline">
                  View all solutions in {category?.name} ({relatedSolutions.length + 1})
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Show message if no navigation available */}
      {!prevSolution && !nextSolution && relatedSolutions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This is the only solution in the {category?.name} category.
          </p>
        </div>
      )}
    </motion.div>
  );
}
