/**
 * Search page
 *
 * Provides global search functionality
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, FileText, FolderOpen, Tag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [searchType, setSearchType] = React.useState<'all' | 'articles' | 'categories' | 'tags'>('all');

  // Execute search
  const performSearch = React.useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
      const result = await response.json();

      if (result.success) {
        setResults(result.data);
      } else {
        console.error('Search failed:', result.error);
        setResults(null);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [searchType]);

  // Debounced search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/knowledge">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Search Knowledge Base
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Search articles, categories and tags
            </p>
          </motion.div>

          {/* Search box */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search articles, categories, tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg"
                autoFocus
              />
            </div>

            {/* Search type selection */}
            <div className="flex space-x-2 mt-4">
              {[
                { key: 'all', label: 'All' },
                { key: 'articles', label: 'Articles' },
                { key: 'categories', label: 'Categories' },
                { key: 'tags', label: 'Tags' },
              ].map(({ key, label }) => (
                <Button
                  key={key}
                  variant={searchType === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSearchType(key as any)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Search results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            )}

            {!loading && query.length >= 2 && results && (
              <div className="space-y-8">
                {/* Article results */}
                {results.articles && results.articles.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Articles ({results.articles.length})
                    </h2>
                    <div className="space-y-4">
                      {results.articles.map((article: any) => (
                        <Link key={article.id} href={`/knowledge/${article.category.slug}/${article.slug}`}>
                          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400">
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <span>{article.category.name}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* No results */}
                {results.total === 0 && (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      No content found containing "{query}". Try different keywords.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!loading && !query && (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Start searching
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Enter keywords to search articles, categories and tags
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
