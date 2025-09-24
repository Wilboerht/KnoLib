"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  FolderOpen,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  createdAt: string;
  updatedAt: string;
  _count: {
    solutions: number;
  };
}

export default function TechCategoriesManagement() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<TechCategory[]>([]);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tech-categories');
      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tech-categories/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/tech-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCategories();
      } else {
        alert(data.error || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
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
                  Tech Categories
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Manage tech solution categories and organization
                </p>
              </div>
              <Link href="/admin/tech-solutions/categories/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Category
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Categories List */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Categories ({categories.length})
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    No categories found. Create your first category to get started.
                  </p>
                  <Link href="/admin/tech-solutions/categories/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Category
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-medium"
                          style={{ backgroundColor: category.color || '#3B82F6' }}
                        >
                          {category.icon || category.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {category.name}
                            </h3>
                            {category.isProtected && (
                              <div className="flex items-center space-x-1">
                                <Lock className="w-3 h-3 text-amber-500" />
                                <span className="px-2 py-1 text-xs bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded">
                                  Protected
                                </span>
                              </div>
                            )}
                            {!category.isActive && (
                              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {category.description || 'No description'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {category._count.solutions} solutions • /{category.slug}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(category.id, category.isActive)}
                          className="text-gray-600 dark:text-gray-300"
                        >
                          {category.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <Link href={`/admin/tech-solutions/categories/${category.id}/edit`}>
                          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
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
