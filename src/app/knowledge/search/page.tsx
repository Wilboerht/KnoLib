"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, Star, ArrowRight, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const searchResults = [
  {
    title: "Getting Started with KnoLib",
    description: "Learn the basics of KnoLib platform and how to set up your first knowledge base.",
    category: "Getting Started",
    readTime: "5 min",
    lastUpdated: "2 days ago",
    difficulty: "Beginner",
    tags: ["setup", "basics", "tutorial"],
    href: "/knowledge/getting-started/introduction",
    relevance: 95
  },
  {
    title: "API Authentication Guide",
    description: "Complete guide to implementing authentication in your KnoLib API integrations.",
    category: "API Reference",
    readTime: "8 min",
    lastUpdated: "1 week ago",
    difficulty: "Advanced",
    tags: ["api", "authentication", "security"],
    href: "/knowledge/api/auth",
    relevance: 88
  },
  {
    title: "User Management Best Practices",
    description: "Best practices for managing users, roles, and permissions in your organization.",
    category: "Administration",
    readTime: "12 min",
    lastUpdated: "3 days ago",
    difficulty: "Intermediate",
    tags: ["users", "permissions", "admin"],
    href: "/knowledge/admin/users",
    relevance: 82
  },
  {
    title: "Advanced Search Techniques",
    description: "Master the advanced search features to find information quickly and efficiently.",
    category: "User Guide",
    readTime: "7 min",
    lastUpdated: "5 days ago",
    difficulty: "Intermediate",
    tags: ["search", "tips", "productivity"],
    href: "/knowledge/user-guide/search",
    relevance: 78
  },
  {
    title: "Integration Workflows",
    description: "Learn how to integrate KnoLib with your existing tools and workflows.",
    category: "API Reference",
    readTime: "15 min",
    lastUpdated: "1 week ago",
    difficulty: "Advanced",
    tags: ["integration", "workflow", "automation"],
    href: "/knowledge/api/webhooks",
    relevance: 75
  }
];

const filters = [
  { label: "All Categories", value: "all", count: 150 },
  { label: "Getting Started", value: "getting-started", count: 25 },
  { label: "User Guide", value: "user-guide", count: 45 },
  { label: "Administration", value: "admin", count: 35 },
  { label: "API Reference", value: "api", count: 45 }
];

const difficultyFilters = [
  { label: "All Levels", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("relevance");

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Search Header */}
      <section className="py-8 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Search Documentation
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Find answers, guides, and resources across our knowledge base
            </p>

            {/* Enhanced Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for guides, tutorials, API docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                spellCheck={false}
                autoComplete="off"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                {difficultyFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
              </select>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Search Results */}
      <section className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Results Header */}
            <motion.div
              className="flex items-center justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Results
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Found {searchResults.length} results
                </p>
              </div>
            </motion.div>

            {/* Results List */}
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.title}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                        {result.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        result.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        result.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {result.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Star className="h-3 w-3 mr-1" />
                      {result.relevance}% match
                    </div>
                  </div>

                  <Link href={result.href} className="group">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {result.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {result.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {result.readTime}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {result.lastUpdated}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {result.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      <Link href={result.href} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button variant="outline">
                Load More Results
              </Button>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
