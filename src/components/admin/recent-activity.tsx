'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogIn,
  UserPlus,
  FileText,
  Eye,
  Wrench,
  Settings,
  Calendar,
  Clock,
  RefreshCw,
  ExternalLink,
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
    return time.toLocaleDateString('en-US');
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

export function RecentActivity() {
  const { token } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/recent-activity?limit=3', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setActivities(data.data);
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
    fetchActivities();
  }, [token]);

  const handleRefresh = () => {
    fetchActivities();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-3" />
          <span className="text-gray-600 dark:text-gray-300">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <div className="text-center py-8">
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={handleRefresh} variant="outline">
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Activity
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => router.push('/admin/recent-activity')}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button onClick={handleRefresh} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

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
                className={`p-4 rounded-lg ${activityBgColors[activity.type]} border border-gray-200 dark:border-slate-600`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${activityColors[activity.type]} bg-white dark:bg-slate-700`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h3>
                      {activity.user && (
                        <span className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                          {getRoleDisplayName(activity.user.role)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {activity.description}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.user.name || activity.user.email}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;
