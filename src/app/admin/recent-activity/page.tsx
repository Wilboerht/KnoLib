/**
 * Recent Activity Detail Page
 * System Activity Records Detail Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  FileText,
  Wrench,
  Settings,
  LogIn,
  UserPlus,
  Eye,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/context';
import { useRouter } from 'next/navigation';

interface ActivityItem {
  id: string;
  type: 'user_login' | 'user_created' | 'article_created' | 'article_published' | 'solution_created' | 'solution_published' | 'oauth_configured';
  title: string;
  description: string;
  user?: {
    name: string | null;
    email: string;
    role: string;
  };
  timestamp: string;
  metadata?: any;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const activityIcons = {
  user_login: LogIn,
  user_created: UserPlus,
  article_created: FileText,
  article_published: Eye,
  solution_created: Wrench,
  solution_published: Eye,
  oauth_configured: Settings,
};

const activityColors = {
  user_login: 'text-blue-500',
  user_created: 'text-green-500',
  article_created: 'text-purple-500',
  article_published: 'text-indigo-500',
  solution_created: 'text-orange-500',
  solution_published: 'text-red-500',
  oauth_configured: 'text-gray-500',
};

const activityBgColors = {
  user_login: 'bg-blue-50 dark:bg-blue-900/20',
  user_created: 'bg-green-50 dark:bg-green-900/20',
  article_created: 'bg-purple-50 dark:bg-purple-900/20',
  article_published: 'bg-indigo-50 dark:bg-indigo-900/20',
  solution_created: 'bg-orange-50 dark:bg-orange-900/20',
  solution_published: 'bg-red-50 dark:bg-red-900/20',
  oauth_configured: 'bg-gray-50 dark:bg-gray-900/20',
};

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  } else {
    return time.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

function getRoleDisplayName(role: string): string {
  const roleMap = {
    ADMIN: 'Administrator',
    EDITOR: 'Editor',
    AUTHOR: 'Author',
  };
  return roleMap[role as keyof typeof roleMap] || role;
}

export default function RecentActivityPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchActivities = async (page: number = 1) => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/recent-activity?limit=10&page=${page}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setActivities(data.data);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        setError(data.error || 'Failed to fetch activity records');
      }
    } catch (error) {
      console.error('Failed to fetch activity records:', error);
      setError('Failed to fetch activity records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(1);
  }, [token]);

  const handleRefresh = () => {
    fetchActivities(currentPage);
  };

  const handlePageChange = (page: number) => {
    fetchActivities(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 pb-12">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
            <div className="flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 pb-12">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pt-16 pb-12">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/admin')}
                className="text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Admin Panel
              </Button>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Activity Records</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View system activity records from the last 30 days, up to 1000 records
              {pagination && (
                <span className="ml-2">
                  ({pagination.total} total records, {pagination.limit} per page)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Activity List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
          <div className="p-6">
            {activities.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No activity records yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = activityIcons[activity.type];
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${activityBgColors[activity.type]} border-gray-200 dark:border-slate-600`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${activityColors[activity.type]} bg-white dark:bg-slate-700`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </h3>
                            {activity.user && (
                              <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                {getRoleDisplayName(activity.user.role)}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            {activity.user && (
                              <span>{activity.user.name || activity.user.email}</span>
                            )}
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(activity.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Page {pagination.page} of {pagination.totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
