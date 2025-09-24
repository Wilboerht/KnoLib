/**
 * Category Management Page
 *
 * Administrators can create, edit, and delete domains and categories here
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  Globe,
  ArrowLeft,
  // All icons in the icon selector
  Monitor,
  Server,
  Code,
  Database,
  Cloud,
  Smartphone,
  BookOpen,
  Briefcase,
  Camera,
  Calculator,
  Palette,
  Music,
  Heart,
  Star,
  Zap,
  Target,
  Trophy,
  Lightbulb,
  Rocket,
  Shield,
  Settings,
  Users,
  Stethoscope,
  GraduationCap,
  Car,
  Plane,
  Home,
  ShoppingCart,
  Utensils,
  Gamepad2,
  GitBranch
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DomainForm } from "@/components/admin/domain-form";
import { CategoryForm } from "@/components/admin/category-form";
import Link from "next/link";

// Icon mapping function
const getIconComponent = (iconName: string, defaultIcon: React.ComponentType<any> = Globe) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Monitor,
    Server,
    Code,
    Database,
    Cloud,
    Smartphone,
    Globe,
    BookOpen,
    Briefcase,
    Camera,
    Calculator,
    Palette,
    Music,
    Heart,
    Star,
    Zap,
    Target,
    Trophy,
    Lightbulb,
    Rocket,
    Shield,
    Settings,
    Users,
    Stethoscope,
    GraduationCap,
    Car,
    Plane,
    Home,
    ShoppingCart,
    Utensils,
    Gamepad2,
    GitBranch
  };

  return iconMap[iconName] || defaultIcon;
};

interface Domain {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  _count: {
    articles: number;
  };
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  _count: {
    articles: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesManagePage() {
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showDomainForm, setShowDomainForm] = React.useState(false);
  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [editingDomain, setEditingDomain] = React.useState<Domain | null>(null);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [selectedDomainId, setSelectedDomainId] = React.useState<string>("");

  // Load domain and category data
  const loadDomains = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/domains');
      const result = await response.json();
      
      if (result.success) {
        setDomains(result.data);
      } else {
        console.error('Failed to load domains:', result.error);
      }
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  // Handle domain deletion
  const handleDeleteDomain = async (domain: Domain) => {
    if (!confirm(`Are you sure you want to delete domain "${domain.name}"? This will also delete all categories under it.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/domains/${domain.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadDomains();
      } else {
        alert('Delete failed: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to delete domain:', error);
      alert('Delete failed, please try again');
    }
  };

  // Handle category deletion
  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete category "${category.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadDomains();
      } else {
        alert('Delete failed: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Delete failed, please try again');
    }
  };

  // Handle domain editing
  const handleEditDomain = (domain: Domain) => {
    setEditingDomain(domain);
    setShowDomainForm(true);
  };

  // Handle category editing
  const handleEditCategory = (category: Category, domainId: string) => {
    setEditingCategory(category);
    setSelectedDomainId(domainId);
    setShowCategoryForm(true);
  };

  // Handle category creation
  const handleCreateCategory = (domainId: string) => {
    setEditingCategory(null);
    setSelectedDomainId(domainId);
    setShowCategoryForm(true);
  };

  // Filter domains
  const filteredDomains = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return domains;
    }
    return domains.filter(domain =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.categories.some(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [domains, searchQuery]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <Link href="/admin/knowledge">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Management
            </Button>
          </Link>

          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Category Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage knowledge domains and category structure
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingDomain(null);
                  setShowDomainForm(true);
                }}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Domain
              </Button>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search domains or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Domain and Category List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : filteredDomains.length > 0 ? (
              <div className="space-y-6">
                {filteredDomains.map((domain, index) => (
                  <motion.div
                    key={domain.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    {/* Domain Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-4">
                            {React.createElement(getIconComponent(domain.icon || '', Globe), {
                              className: "w-6 h-6 text-blue-600 dark:text-blue-400"
                            })}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {domain.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {domain._count.articles} articles • {domain.categories.length} categories
                            </p>
                            {domain.description && (
                              <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {domain.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCreateCategory(domain.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Category
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDomain(domain)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDomain(domain)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Category List */}
                    {domain.categories.length > 0 ? (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {domain.categories.map((category) => (
                            <div
                              key={category.id}
                              className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div
                                    className="w-8 h-8 flex items-center justify-center rounded-lg mr-3"
                                    style={{ backgroundColor: category.color + '20' }}
                                  >
                                    {React.createElement(getIconComponent(category.icon || '', FolderOpen), {
                                      className: "w-4 h-4",
                                      style: { color: category.color }
                                    })}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                      {category.name}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {category._count.articles} articles
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditCategory(category, domain.id)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category)}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              {category.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          No categories in this domain yet
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateCategory(domain.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Category
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No matching categories found' : 'No domains yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No domains or categories found containing "${searchQuery}"`
                    : 'No domains have been created yet'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      setEditingDomain(null);
                      setShowDomainForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Domain
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Domain Form */}
      <DomainForm
        domain={editingDomain}
        isOpen={showDomainForm}
        onClose={() => {
          setShowDomainForm(false);
          setEditingDomain(null);
        }}
        onSuccess={() => {
          loadDomains();
        }}
      />

      {/* Category Form */}
      <CategoryForm
        category={editingCategory}
        domainId={selectedDomainId}
        domains={domains}
        isOpen={showCategoryForm}
        onClose={() => {
          setShowCategoryForm(false);
          setEditingCategory(null);
          setSelectedDomainId('');
        }}
        onSuccess={() => {
          loadDomains();
        }}
      />
    </div>
  );
}
