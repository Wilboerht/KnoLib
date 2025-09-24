"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Filter, Clock, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TechSolutionsSearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // TODO: Implement real search API call
      // const results = await searchTechSolutions(searchQuery);
      // setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const popularSearches: string[] = [];

  const recentSearches: string[] = [];

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Header */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Link href="/tech-solutions" className="mr-4">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Advanced Search
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Search technical solutions, documentation, and best practices
                </p>
              </div>
            </div>

            {/* Advanced Search Bar */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Enter keywords to search technical solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-4 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </Button>
                </div>

                {/* Search Filters */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">Advanced Filters:</span>
                  </div>

                  <select
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    aria-label="Filter by category"
                  >
                    <option value="">All Categories</option>
                    <option value="frontend">Frontend Architecture</option>
                    <option value="design">UI Design System</option>
                    <option value="data">Data Management</option>
                    <option value="devops">DevOps</option>
                    <option value="security">Security Solutions</option>
                    <option value="performance">Performance Optimization</option>
                  </select>

                  <select
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    aria-label="Filter by difficulty level"
                  >
                    <option value="">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <select
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                    aria-label="Filter by content type"
                  >
                    <option value="">Content Type</option>
                    <option value="guide">Guide</option>
                    <option value="tutorial">Tutorial</option>
                    <option value="reference">Reference</option>
                    <option value="example">Example</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Search Suggestions */}
      <section className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Popular Searches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
                  <div className="flex items-center mb-4">
                    <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Popular Searches
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {popularSearches.length > 0 ? (
                      popularSearches.map((search) => (
                        <button
                          key={search}
                          type="button"
                          onClick={() => setSearchQuery(search)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                        No popular searches yet
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Recent Searches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6">
                  <div className="flex items-center mb-4">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.length > 0 ? (
                      recentSearches.map((search) => (
                        <button
                          key={search}
                          type="button"
                          onClick={() => setSearchQuery(search)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          {search}
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                        No search history
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search Tips */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Search Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                  <div>
                    <h4 className="font-medium mb-2">Basic Search</h4>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• Use keywords to search</li>
                      <li>• Supports English search</li>
                      <li>• Auto-matches relevant content</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Advanced Search</h4>
                    <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• Use filters for precise search</li>
                      <li>• Filter by category and difficulty</li>
                      <li>• Filter by content type</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
