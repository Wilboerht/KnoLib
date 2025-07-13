"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowRight, Clock, User, Calendar, BookOpen, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const allArticles = [
  // Getting Started
  { title: "Introduction to KnoLib", category: "Getting Started", href: "/knowledge/getting-started/introduction", readTime: "5 min", lastUpdated: "2 days ago", difficulty: "Beginner" },
  { title: "Quick Start Guide", category: "Getting Started", href: "/knowledge/getting-started/quick-start", readTime: "8 min", lastUpdated: "1 week ago", difficulty: "Beginner" },
  { title: "Basic Concepts", category: "Getting Started", href: "/knowledge/getting-started/concepts", readTime: "12 min", lastUpdated: "3 days ago", difficulty: "Beginner" },
  { title: "Installation & Setup", category: "Getting Started", href: "/knowledge/getting-started/installation", readTime: "15 min", lastUpdated: "1 week ago", difficulty: "Beginner" },
  
  // User Guide
  { title: "Dashboard Overview", category: "User Guide", href: "/knowledge/user-guide/dashboard", readTime: "6 min", lastUpdated: "5 days ago", difficulty: "Beginner" },
  { title: "Managing Content", category: "User Guide", href: "/knowledge/user-guide/content", readTime: "15 min", lastUpdated: "1 week ago", difficulty: "Intermediate" },
  { title: "Creating Articles", category: "User Guide", href: "/knowledge/user-guide/creating-articles", readTime: "10 min", lastUpdated: "4 days ago", difficulty: "Beginner" },
  { title: "Collaboration Features", category: "User Guide", href: "/knowledge/user-guide/collaboration", readTime: "12 min", lastUpdated: "6 days ago", difficulty: "Intermediate" },
  { title: "Search & Discovery", category: "User Guide", href: "/knowledge/user-guide/search", readTime: "8 min", lastUpdated: "3 days ago", difficulty: "Beginner" },
  
  // Administration
  { title: "User Management", category: "Administration", href: "/knowledge/admin/users", readTime: "20 min", lastUpdated: "1 week ago", difficulty: "Advanced" },
  { title: "Permissions & Roles", category: "Administration", href: "/knowledge/admin/permissions", readTime: "18 min", lastUpdated: "5 days ago", difficulty: "Advanced" },
  { title: "System Configuration", category: "Administration", href: "/knowledge/admin/config", readTime: "25 min", lastUpdated: "1 week ago", difficulty: "Advanced" },
  { title: "Analytics & Reporting", category: "Administration", href: "/knowledge/admin/analytics", readTime: "15 min", lastUpdated: "4 days ago", difficulty: "Intermediate" },
  
  // API Reference
  { title: "REST API Overview", category: "API Reference", href: "/knowledge/api/rest", readTime: "10 min", lastUpdated: "6 days ago", difficulty: "Intermediate" },
  { title: "Authentication", category: "API Reference", href: "/knowledge/api/auth", readTime: "15 min", lastUpdated: "1 week ago", difficulty: "Advanced" },
  { title: "GraphQL API", category: "API Reference", href: "/knowledge/api/graphql", readTime: "20 min", lastUpdated: "5 days ago", difficulty: "Advanced" },
  { title: "Webhooks", category: "API Reference", href: "/knowledge/api/webhooks", readTime: "12 min", lastUpdated: "3 days ago", difficulty: "Intermediate" },
  
  // Tutorials
  { title: "Building Your First Knowledge Base", category: "Tutorials", href: "/knowledge/tutorials/first-kb", readTime: "25 min", lastUpdated: "1 week ago", difficulty: "Beginner" },
  { title: "Setting Up Team Collaboration", category: "Tutorials", href: "/knowledge/tutorials/team-setup", readTime: "18 min", lastUpdated: "4 days ago", difficulty: "Intermediate" },
  { title: "Advanced Search Techniques", category: "Tutorials", href: "/knowledge/tutorials/advanced-search", readTime: "15 min", lastUpdated: "6 days ago", difficulty: "Intermediate" },
  
  // FAQ
  { title: "General Questions", category: "FAQ", href: "/knowledge/faq/general", readTime: "8 min", lastUpdated: "2 days ago", difficulty: "Beginner" },
  { title: "Account & Billing", category: "FAQ", href: "/knowledge/faq/billing", readTime: "6 min", lastUpdated: "5 days ago", difficulty: "Beginner" },
  { title: "Technical Issues", category: "FAQ", href: "/knowledge/faq/technical", readTime: "12 min", lastUpdated: "3 days ago", difficulty: "Intermediate" }
];

const categories = ["All", "Getting Started", "User Guide", "Administration", "API Reference", "Tutorials", "FAQ"];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

export default function AllArticlesPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");

  const filteredArticles = allArticles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || article.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
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
              <span className="text-gray-900 dark:text-white font-medium">All Articles</span>
            </nav>
          </div>
        </Container>
      </div>

      {/* Header */}
      <section className="py-8 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                All Articles
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Browse all documentation and guides • {allArticles.length} total articles
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </div>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {filteredArticles.length} of {allArticles.length} articles
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="title">Alphabetical</option>
                  <option value="category">By Category</option>
                </select>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Articles List */}
      <section className="py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.title}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.02 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      article.difficulty === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                      article.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {article.difficulty}
                    </span>
                  </div>

                  <Link href={article.href} className="group">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>{article.readTime}</span>
                    </div>
                    <span>{article.lastUpdated}</span>
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
                  Try adjusting your search terms or filters.
                </p>
              </motion.div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
