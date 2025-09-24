/**
 * Knowledge Management Dashboard
 * 
 * Central hub for managing all knowledge base content
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  FolderOpen, 
  Tag, 
  Plus,
  TrendingUp,
  Eye,
  Calendar,
  ArrowLeft,
  BarChart3
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  href?: string;
  color: string;
  bgColor: string;
  description: string;
}

export default function KnowledgeManagement() {
  const [stats, setStats] = React.useState<StatCard[]>([
    {
      title: "Total Articles",
      value: "0",
      change: "+0",
      trend: 'neutral',
      icon: FileText,
      href: "/admin/articles"
    },
    {
      title: "Categories",
      value: "0",
      change: "+0",
      trend: 'neutral',
      icon: FolderOpen,
      href: "/admin/categories"
    },
    {
      title: "Tags",
      value: "0",
      change: "+0",
      trend: 'neutral',
      icon: Tag,
      href: "/admin/tags"
    },
    {
      title: "Total Views",
      value: "0",
      change: "+0",
      trend: 'neutral',
      icon: Eye,
    }
  ]);

  const [loading, setLoading] = React.useState(true);

  // Load statistics
  React.useEffect(() => {
    const loadStats = async () => {
      try {
        // Load various statistics in parallel
        const [articlesRes, domainsRes, tagsRes] = await Promise.all([
          fetch('/api/articles'),
          fetch('/api/domains'),
          fetch('/api/tags')
        ]);

        const [articles, domains, tags] = await Promise.all([
          articlesRes.json(),
          domainsRes.json(),
          tagsRes.json()
        ]);

        if (articles.success && domains.success && tags.success) {
          const totalCategories = domains.data.reduce((acc: number, domain: any) => 
            acc + domain.categories.length, 0
          );

          setStats([
            {
              title: "Total Articles",
              value: articles.data.length.toString(),
              change: `+${articles.data.filter((a: any) => {
                const publishedDate = new Date(a.publishedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return publishedDate > weekAgo;
              }).length}`,
              trend: 'up',
              icon: FileText,
              href: "/admin/articles"
            },
            {
              title: "Categories",
              value: totalCategories.toString(),
              change: "+0",
              trend: 'neutral',
              icon: FolderOpen,
              href: "/admin/categories"
            },
            {
              title: "Tags",
              value: tags.data.length.toString(),
              change: "+0",
              trend: 'neutral',
              icon: Tag,
              href: "/admin/tags"
            },
            {
              title: "Total Views",
              value: articles.data.reduce((acc: number, article: any) => acc + (article.views || 0), 0).toString(),
              change: "+0",
              trend: 'neutral',
              icon: Eye,
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const quickActions = [
    {
      title: "Create Article",
      description: "Write a new knowledge base article",
      icon: FileText,
      href: "/admin/articles",
      color: "bg-blue-500"
    },
    {
      title: "Manage Categories",
      description: "Organize domains and category structure",
      icon: FolderOpen,
      href: "/admin/categories",
      color: "bg-orange-500"
    },
    {
      title: "Manage Tags",
      description: "Create and organize article tags",
      icon: Tag,
      href: "/admin/tags",
      color: "bg-green-500"
    },
    {
      title: "View Analytics",
      description: "Check detailed statistics and insights",
      icon: BarChart3,
      href: "/admin/knowledge/analytics",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Button>
            </Link>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Knowledge Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage articles, categories, and knowledge base content
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString('en-US')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Statistics Bar */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                            {loading ? "..." : stat.value}
                          </h3>
                          {stat.trend === 'up' && (
                            <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                              +{stat.change.replace('+', '')}
                            </span>
                          )}
                        </div>
                        {stat.href && (
                          <Link href={stat.href}>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs opacity-70 hover:opacity-100">
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-1 uppercase tracking-wide">
                        {stat.title}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <Link href={action.href}>
                      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 hover:shadow-sm hover:border-gray-300 dark:hover:border-slate-600 transition-all cursor-pointer group h-20 flex items-center">
                        <div className="flex items-center space-x-3 w-full">
                          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                              {action.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
