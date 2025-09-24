'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Code, GitBranch, FolderOpen, Settings, BookOpen, Lock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface TechCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  isProtected: boolean;
  _count: {
    solutions: number;
  };
}

interface TechSolution {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  projectType: string;
  techStack: string[];
  published: boolean;
  views: number;
  publishedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  };
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}



export default function TechSolutionsPage() {
  const [categories, setCategories] = useState<TechCategory[]>([]);
  const [solutions, setSolutions] = useState<TechSolution[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, solutionsRes] = await Promise.all([
        fetch('/api/tech-categories'),
        fetch('/api/tech-solutions?published=true')
      ]);

      if (categoriesRes.ok && solutionsRes.ok) {
        const categoriesData = await categoriesRes.json();
        const solutionsData = await solutionsRes.json();

        setCategories(categoriesData.data || []);
        setSolutions(solutionsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: Code, label: "Tech Solutions", count: solutions.length.toString() },
    { icon: FolderOpen, label: "Categories", count: categories.length.toString() },
    { icon: GitBranch, label: "Published", count: solutions.filter(s => s.published).length.toString() }
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tech Solutions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              Discover proven technical solutions, best practices, and implementation guides from real-world projects
            </p>
            {/* View All Tech Solutions Button */}
            <div className="mb-8">
              <Link href="/tech-solutions/all">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Tech Solutions
                </Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search solutions, technologies, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800"
              />
            </div>

            {/* Stats */}
            <motion.div
              className="max-w-4xl mx-auto mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>



      {/* Categories */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Browse by Category
            </h2>
            {categories.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                    className="group cursor-pointer"
                  >
                    <Link href={`/tech-solutions/${category.slug}`}>
                      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300 h-32 flex flex-col">
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                            style={{ backgroundColor: category.color + '20' }}
                          >
                            <div
                              className="w-5 h-5 flex items-center justify-center text-white font-bold text-sm rounded"
                              style={{ backgroundColor: category.color }}
                            >
                              {category.icon}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {category.name}
                              </h3>
                              {category.isProtected && (
                                <Lock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {category._count?.solutions || 0} solutions
                              {category.isProtected && (
                                <span className="ml-2 text-amber-600 dark:text-amber-400">• Protected</span>
                              )}
                            </p>
                          </div>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 overflow-hidden"
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 2,
                               WebkitBoxOrient: 'vertical',
                               lineHeight: '1.4em',
                               maxHeight: '2.8em'
                             }}>
                            {category.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Code className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Categories Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                  We&apos;re organizing our technical solutions into categories. Check back soon!
                </p>
              </motion.div>
            )}
          </motion.div>
        </Container>
      </section>



      {/* Quick Actions */}
      <section className="py-12 bg-gray-50 dark:bg-slate-800">
        <Container>
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Need Technical Support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can&apos;t find the technical solution you need? Contact our technical team for professional support.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/tech-solutions/search">
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Advanced Search
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">
                    <Code className="h-4 w-4 mr-2" />
                    About Us
                  </Button>
                </Link>

              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}


