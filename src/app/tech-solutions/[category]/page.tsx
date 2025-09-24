"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Eye, Clock, Lock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { CategoryPasswordModal } from '@/components/tech-solutions/category-password-modal';

interface TechCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  isProtected: boolean;
  password?: string;
}

interface TechSolution {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  categoryId: string;
  techStack: string[];
  projectType: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  views: number;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  category: TechCategory;
  excerpt?: string;
}

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  ADVANCED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [category, setCategory] = useState<TechCategory | null>(null);
  const [solutions, setSolutions] = useState<TechSolution[]>([]);
  const [filteredSolutions, setFilteredSolutions] = useState<TechSolution[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [categorySlug, setCategorySlug] = useState<string>('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const initializeParams = async () => {
      const resolvedParams = await params;
      setCategorySlug(resolvedParams.category);
    };
    initializeParams();
  }, [params]);

  useEffect(() => {
    if (categorySlug) {
      fetchData();
    }
  }, [categorySlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch category data
      const categoryRes = await fetch(`/api/tech-categories?slug=${categorySlug}`);
      const categoryData = await categoryRes.json();
      
      if (!categoryData.success || !categoryData.data || categoryData.data.length === 0) {
        notFound();
        return;
      }

      const currentCategory = categoryData.data[0];
      setCategory(currentCategory);

      // Check if category is protected
      if (currentCategory.isProtected) {
        // Check if already verified in this session
        const isAlreadyVerified = sessionStorage.getItem(`tech-category-${categorySlug}-verified`) === 'true';
        if (isAlreadyVerified) {
          setIsVerified(true);
          // Fetch solutions
          await fetchSolutions();
        } else {
          setShowPasswordModal(true);
          setSolutions([]);
        }
      } else {
        setIsVerified(true);
        // Fetch solutions
        await fetchSolutions();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const fetchSolutions = async () => {
    try {
      const solutionsRes = await fetch(`/api/tech-solutions?published=true&category=${categorySlug}`);
      if (solutionsRes.ok) {
        const solutionsData = await solutionsRes.json();
        setSolutions(solutionsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handlePasswordSuccess = async () => {
    setShowPasswordModal(false);
    setIsVerified(true);

    // Set cookie for server-side verification (expires in 1 hour)
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    document.cookie = `tech-category-${categorySlug}-verified=true; expires=${expirationTime.toUTCString()}; path=/; SameSite=Strict`;

    await fetchSolutions();
  };

  const handlePasswordCancel = () => {
    window.location.href = '/tech-solutions';
  };

  // Filter solutions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSolutions(solutions);
    } else {
      const filtered = solutions.filter(solution =>
        solution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredSolutions(filtered);
    }
  }, [solutions, searchQuery]);

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

  if (!category) {
    notFound();
    return null;
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back button and breadcrumb */}
            <div className="mb-6">
              <Link href="/tech-solutions">
                <Button variant="ghost" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Tech Solutions
                </Button>
              </Link>

              {/* Breadcrumb navigation */}
              <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Link href="/tech-solutions" className="hover:text-gray-900 dark:hover:text-white">
                  Tech Solutions
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white">{category.name}</span>
              </nav>
            </div>

            {/* Category information */}
            <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-lg mr-4"
                  style={{ backgroundColor: category.color + '20' }}
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {category.name}
                    </h1>
                    {category.isProtected && (
                      <Lock className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  {category.description && (
                    <p className="text-gray-700 dark:text-gray-300">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Solutions */}
          {isVerified && (
            <section className="pb-16">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Search box */}
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search solutions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </motion.div>

              {/* Solutions List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {filteredSolutions.length === 0 ? (
                  <motion.div
                    className="text-center py-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {searchQuery ? 'No matching solutions found' : 'No solutions yet'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {searchQuery
                        ? `No solutions match "${searchQuery}" in ${category.name} category`
                        : `No solutions have been published in ${category.name} category yet`
                      }
                    </p>
                    {searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery("")}
                        className="mt-4"
                      >
                        Clear Search
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredSolutions.map((solution, index) => (
                      <SolutionCard key={solution.id} solution={solution} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            </section>
          )}
        </div>

        {/* Password Modal */}
        {showPasswordModal && category && (
          <CategoryPasswordModal
            categoryName={category.name}
            categorySlug={category.slug}
            onSuccess={handlePasswordSuccess}
            onCancel={handlePasswordCancel}
          />
        )}
      </Container>
    </div>
  );
}

// Solution Card Component
function SolutionCard({ solution, index }: { solution: TechSolution; index: number }) {
  return (
    <Link href={`/tech-solutions/${solution.category.slug}/${solution.slug}`}>
      <motion.article
        className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      >
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            className="text-xs text-white"
            style={{ backgroundColor: solution.category.color }}
          >
            {solution.category.name}
          </Badge>
          <Badge className={`text-xs ${difficultyColors[solution.difficulty]}`}>
            {solution.difficulty}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
          {solution.title}
        </h3>

        {/* Excerpt */}
        {solution.excerpt && (
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {solution.excerpt}
          </p>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {solution.techStack.slice(0, 6).map((tech, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
          {solution.techStack.length > 6 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{solution.techStack.length - 6}
            </Badge>
          )}
        </div>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {solution.views}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(solution.publishedAt).toLocaleDateString()}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
