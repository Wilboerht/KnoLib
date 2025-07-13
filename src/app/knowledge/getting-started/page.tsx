"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Clock, BookOpen, Zap, User, Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import Link from "next/link";

const articles = [
  {
    title: "Introduction to KnoLib",
    description: "Welcome to KnoLib, your comprehensive personal knowledge sharing platform. Learn about our core features and how to get started.",
    href: "/knowledge/getting-started/introduction",
    readTime: "5 min",
    lastUpdated: "2 days ago",
    author: "Wilboerht",
    difficulty: "Beginner",
    featured: true
  },
  {
    title: "Quick Start Guide",
    description: "Get up and running with KnoLib in just a few minutes. This guide will walk you through the essential steps.",
    href: "/knowledge/getting-started/quick-start",
    readTime: "8 min",
    lastUpdated: "1 week ago",
    author: "Wilboerht",
    difficulty: "Beginner",
    featured: true
  },
  {
    title: "Basic Concepts",
    description: "Learn the fundamental concepts and terminology used throughout KnoLib platform.",
    href: "/knowledge/getting-started/concepts",
    readTime: "12 min",
    lastUpdated: "3 days ago",
    author: "Wilboerht",
    difficulty: "Beginner",
    featured: false
  },
  {
    title: "Installation & Setup",
    description: "Complete guide to installing and setting up KnoLib in your environment.",
    href: "/knowledge/getting-started/installation",
    readTime: "15 min",
    lastUpdated: "1 week ago",
    author: "Wilboerht",
    difficulty: "Beginner",
    featured: false
  },
  {
    title: "First Project",
    description: "Create your first knowledge base project and understand the basic workflow.",
    href: "/knowledge/getting-started/first-project",
    readTime: "10 min",
    lastUpdated: "5 days ago",
    author: "KnoLib Team",
    difficulty: "Beginner",
    featured: false
  },
  {
    title: "Configuration",
    description: "Learn how to configure KnoLib settings to match your organization's needs.",
    href: "/knowledge/getting-started/configuration",
    readTime: "18 min",
    lastUpdated: "1 week ago",
    author: "Technical Team",
    difficulty: "Intermediate",
    featured: false
  },
  {
    title: "Troubleshooting",
    description: "Common issues and their solutions when getting started with KnoLib.",
    href: "/knowledge/getting-started/troubleshooting",
    readTime: "12 min",
    lastUpdated: "4 days ago",
    author: "Support Team",
    difficulty: "Beginner",
    featured: false
  },
  {
    title: "Best Practices",
    description: "Essential best practices for organizing and managing your knowledge base effectively.",
    href: "/knowledge/getting-started/best-practices",
    readTime: "20 min",
    lastUpdated: "6 days ago",
    author: "KnoLib Team",
    difficulty: "Intermediate",
    featured: false
  }
];

export default function GettingStartedPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState("featured");

  const filteredArticles = articles
    .filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "featured") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      }
      if (sortBy === "newest") {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Container>
          <div className="py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/knowledge" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Knowledge Base
              </Link>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-white font-medium">Getting Started</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Header */}
      <section className="py-8 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-4">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Getting Started
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Essential guides for new users • {articles.length} articles
                </p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Articles List */}
      <section className="py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.title}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {article.featured && (
                        <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {article.difficulty}
                      </span>
                    </div>
                  </div>

                  <Link href={article.href} className="group">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {article.description}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {article.lastUpdated}
                      </div>
                    </div>
                    
                    <Link href={article.href} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try adjusting your search terms or browse other categories.
                </p>
              </motion.div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
