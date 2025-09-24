"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, Clock, BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  difficulty: string;
  readTime?: number;
  author?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const difficulties = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function AllArticlesPage() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [categories, setCategories] = React.useState<string[]>(["All"]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("newest");

  // Load articles and categories from API
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load articles
        const articlesResponse = await fetch('/api/articles');
        const articlesResult = await articlesResponse.json();

        if (articlesResult.success) {
          setArticles(articlesResult.data);

          // Extract unique categories
          const uniqueCategories = ["All", ...new Set(
            articlesResult.data
              .filter((article: Article) => article.category)
              .map((article: Article) => article.category!.name)
          )];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredArticles = articles
    .filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || article.category?.name === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All" || article.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "category") {
        return (a.category?.name || '').localeCompare(b.category?.name || '');
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
                Browse all documentation and guides • {loading ? 'Loading...' : `${articles.length} total articles`}
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
                  aria-label="Filter by category"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  aria-label="Filter by difficulty level"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {filteredArticles.length} of {articles.length} articles
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white"
                  aria-label="Sort articles by"
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
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading articles...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                        {article.category?.name || 'Uncategorized'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        article.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                        article.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {article.difficulty}
                      </span>
                    </div>

                    <Link href={`/knowledge/${article.category?.slug}/${article.slug}`} className="group">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    {article.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime ? `${article.readTime} min read` : '5 min read'}</span>
                      </div>
                      <span>{new Date(article.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
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
