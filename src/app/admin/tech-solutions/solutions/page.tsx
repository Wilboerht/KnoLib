"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Star,
  Search,
  Filter
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface TechSolution {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  categoryId?: string;
  techStack: string[];
  projectType?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  views: number;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  _count: {
    tags: number;
  };
}

const difficultyColors = {
  BEGINNER: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  INTERMEDIATE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  ADVANCED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

export default function TechSolutionsManagement() {
  const [loading, setLoading] = useState(true);
  const [solutions, setSolutions] = useState<TechSolution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPublished, setFilterPublished] = useState<boolean | null>(null);

  const loadSolutions = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterPublished !== null) params.append('published', filterPublished.toString());
      
      const response = await fetch(`/api/tech-solutions?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setSolutions(data.data);
      }
    } catch (error) {
      console.error('Error loading solutions:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterPublished]);

  useEffect(() => {
    loadSolutions();
  }, [loadSolutions]);

  const handleDeleteSolution = async (id: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tech-solutions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await loadSolutions();
      } else {
        alert(data.error || 'Failed to delete solution');
      }
    } catch (error) {
      console.error('Error deleting solution:', error);
      alert('Failed to delete solution');
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/tech-solutions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !published }),
      });

      const data = await response.json();

      if (data.success) {
        await loadSolutions();
      } else {
        alert(data.error || 'Failed to update solution');
      }
    } catch (error) {
      console.error('Error updating solution:', error);
      alert('Failed to update solution');
    }
  };



  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/admin/tech-solutions">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tech Solutions Management
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Tech Solutions
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Manage your technical solutions and content
                </p>
              </div>
              <Link href="/admin/tech-solutions/solutions/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Solution
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search solutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Published Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterPublished === null ? 'all' : filterPublished.toString()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFilterPublished(value === 'all' ? null : value === 'true');
                  }}
                  className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Solutions</option>
                  <option value="true">Published</option>
                  <option value="false">Draft</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Solutions List */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Solutions ({solutions.length})
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Loading solutions...</p>
                </div>
              ) : solutions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchTerm || filterPublished !== null 
                      ? "No solutions found matching your criteria."
                      : "No solutions found. Create your first solution to get started."
                    }
                  </p>
                  {!searchTerm && filterPublished === null && (
                    <Link href="/admin/tech-solutions/solutions/new">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Solution
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {solutions.map((solution, index) => (
                    <motion.div
                      key={solution.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {solution.title}
                            </h3>
                            {!solution.published && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded">
                                Draft
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            {solution.category && (
                              <span 
                                className="px-2 py-1 rounded text-white text-xs"
                                style={{ backgroundColor: solution.category.color || '#3B82F6' }}
                              >
                                {solution.category.name}
                              </span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${difficultyColors[solution.difficulty]}`}>
                              {solution.difficulty}
                            </span>
                            <span>{solution.views} views</span>
                            <span>{solution._count.tags} tags</span>
                            <span>/{solution.slug}</span>
                          </div>

                          {solution.techStack.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {solution.techStack.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
                                >
                                  {tech}
                                </span>
                              ))}
                              {solution.techStack.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded">
                                  +{solution.techStack.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublished(solution.id, solution.published)}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {solution.published ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Link href={`/admin/tech-solutions/solutions/${solution.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSolution(solution.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
