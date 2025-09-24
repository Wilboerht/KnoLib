/**
 * Admin Dashboard
 *
 * Main entry point for all administrative functions
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  Tag,
  Users,
  BarChart3,
  Settings,
  Plus,
  TrendingUp,
  Eye,
  Calendar,
  BookOpen,
  Wrench,
  ArrowRight,
  LogOut,
  Image
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EditorProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth/context";
import { usePermission } from "@/lib/auth/hooks";
import { RecentActivity } from "@/components/admin/recent-activity";

interface SystemInfo {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

function AdminDashboardContent() {
  const { user, logout } = useAuth();
  const { isAdmin, isEditor } = usePermission();
  const [systemInfo, setSystemInfo] = React.useState<SystemInfo[]>([
    {
      title: "Platform Status",
      value: "Online",
      description: "All systems operational",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Last Updated",
      value: new Date().toLocaleDateString('en-US'),
      description: "Content last modified",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Active Sections",
      value: "2",
      description: "Knowledge & Tech Solutions active",
      icon: BookOpen,
      color: "text-purple-600"
    },
    {
      title: "Coming Soon",
      value: "0",
      description: "All core features implemented",
      icon: Wrench,
      color: "text-green-600"
    }
  ]);

  // Load system information
  React.useEffect(() => {
    // Update system info with current data
    setSystemInfo(prev => prev.map(info => {
      if (info.title === "Last Updated") {
        return {
          ...info,
          value: new Date().toLocaleDateString('en-US')
        };
      }
      return info;
    }));
  }, []);

  const mainSections = [
    {
      title: "Knowledge Management",
      description: "Manage articles, categories, and knowledge base content",
      icon: BookOpen,
      href: "/admin/knowledge",
      color: "bg-blue-500",
      stats: {
        articles: "Articles",
        categories: "Categories",
        tags: "Tags"
      }
    },
    {
      title: "Tech Solutions",
      description: "Manage technical solutions, categories, and content",
      icon: Wrench,
      href: "/admin/tech-solutions",
      color: "bg-orange-500",
      stats: {
        solutions: "Solutions",
        categories: "Categories",
        analytics: "Analytics"
      }
    },
    {
      title: "User Management",
      description: "Manage users, roles, and authentication settings",
      icon: Users,
      href: "/admin/users",
      color: "bg-green-500",
      stats: {
        users: "Users",
        roles: "Roles",
        oauth: "OAuth"
      }
    },
    {
      title: "OAuth Settings",
      description: "Configure third-party login providers like Google, GitHub",
      icon: Settings,
      href: "/admin/oauth-settings",
      color: "bg-purple-500",
      stats: {
        google: "Google",
        github: "GitHub",
        microsoft: "Microsoft"
      }
    },
    {
      title: "Media Management",
      description: "Manage uploaded files, images, videos, and documents",
      icon: Image,
      href: "/admin/media",
      color: "bg-pink-500",
      stats: {
        images: "Images",
        videos: "Videos",
        documents: "Documents"
      }
    }
  ];

  return (
    <div className="pt-16 sm:pt-20 pb-8 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back! Manage your content and platform
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date().toLocaleDateString('en-US')}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {user?.name || user?.email}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {user?.role}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* System Information */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {systemInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {info.value}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {info.title}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {info.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Sections */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Management Sections
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mainSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {section.disabled ? (
                      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 opacity-60">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                          {section.description}
                        </p>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                          {Object.entries(section.stats).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-semibold text-gray-400 dark:text-gray-500">
                                {value}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link href={section.href}>
                        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {section.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            {section.description}
                          </p>
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            {Object.entries(section.stats).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {value}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                  {key}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <RecentActivity />
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <EditorProtectedRoute>
      <AdminDashboardContent />
    </EditorProtectedRoute>
  );
}
