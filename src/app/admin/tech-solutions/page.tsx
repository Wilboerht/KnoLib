"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  FileText, 
  FolderOpen, 
  Tag, 
  Eye,
  Plus,
  Settings,
  TrendingUp,
  Layers
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface StatCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<any>;
  href?: string;
}

export default function TechSolutionsManagement() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load real statistics data
      const statsRes = await fetch('/api/tech-solutions/stats?period=30');
      const statsData = await statsRes.json();

      if (!statsData.success) {
        throw new Error('Failed to load statistics');
      }

      const { current, growth } = statsData.data;

      const statCards: StatCard[] = [
        {
          title: 'Total Solutions',
          value: current.totalSolutions.toString(),
          change: growth.totalSolutions?.change,
          trend: growth.totalSolutions?.trend,
          icon: FileText,
          href: '/admin/tech-solutions/solutions',
        },
        {
          title: 'Categories',
          value: current.totalCategories.toString(),
          change: growth.totalCategories?.change,
          trend: growth.totalCategories?.trend,
          icon: FolderOpen,
          href: '/admin/tech-solutions/categories',
        },
        {
          title: 'Published',
          value: current.publishedSolutions.toString(),
          change: growth.publishedSolutions?.change,
          trend: growth.publishedSolutions?.trend,
          icon: Eye,
        },
        {
          title: 'Total Views',
          value: current.totalViews.toString(),
          change: growth.totalViews?.change,
          trend: growth.totalViews?.trend,
          icon: TrendingUp,
        },
      ];

      setStats(statCards);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const quickActions = [
    {
      title: 'Create Solution',
      description: 'Add a new tech solution',
      icon: Plus,
      href: '/admin/tech-solutions/solutions/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Categories',
      description: 'Organize solution categories',
      icon: Layers,
      href: '/admin/tech-solutions/categories',
      color: 'bg-green-500',
    },
    {
      title: 'Manage Solutions',
      description: 'Edit existing solutions',
      icon: Settings,
      href: '/admin/tech-solutions/solutions',
      color: 'bg-purple-500',
    },
    {
      title: 'View Analytics',
      description: 'Solution performance metrics',
      icon: TrendingUp,
      href: '/admin/tech-solutions/analytics',
      color: 'bg-orange-500',
    },
  ];

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
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tech Solutions Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your technical solutions, categories, and content
            </p>
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
                          {stat.change && stat.trend && (
                            <span className={`text-xs font-medium ${
                              stat.trend === 'up'
                                ? 'text-green-600 dark:text-green-400'
                                : stat.trend === 'down'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {stat.change}
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
