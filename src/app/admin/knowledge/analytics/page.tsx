"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  TrendingUp,
  Eye,
  Users,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Target,
  Zap,
  Star,
  BookOpen,
  FileText,
  FolderOpen,
  Tag,
  Plus
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface KnowledgeAnalyticsData {
  totalViews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  avgReadTime: number;
  totalDomains: number;
  totalCategories: number;
  totalTags: number;
  featuredArticles: number;
  topArticles: Array<{
    id: string;
    title: string;
    views: number;
    domain: string;
    category: string;
    publishedAt: string;
  }>;
  domainStats: Array<{
    name: string;
    count: number;
    views: number;
    color: string;
    publishedCount: number;
    draftCount: number;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
    articles: number;
    domains: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  tagStats: Array<{
    tag: string;
    count: number;
    percentage: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    published: number;
    views: number;
    engagement: number;
  }>;
  performanceMetrics: {
    avgViewsPerArticle: number;
    topPerformingDomain: string;
    growthRate: number;
    engagementRate: number;
  };
}

export default function KnowledgeAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<KnowledgeAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('30');
  const [viewMode, setViewMode] = useState<'views' | 'articles'>('views');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call real API
      const response = await fetch(`/api/knowledge/stats?period=${timeRange}`);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'API returned error status');
      }

      const apiData = result.data;

      // Convert API data to component format
      const analyticsData: KnowledgeAnalyticsData = {
        totalViews: apiData.current.totalViews,
        totalArticles: apiData.current.totalArticles,
        publishedArticles: apiData.current.publishedArticles,
        draftArticles: apiData.summary.draftArticles,
        avgReadTime: apiData.summary.avgReadTime,
        totalDomains: apiData.current.totalDomains,
        totalCategories: apiData.current.totalCategories,
        totalTags: apiData.tagStats.length,
        featuredArticles: apiData.summary.featuredArticles,
        topArticles: apiData.topArticles,
        domainStats: apiData.domainStats,
        viewsOverTime: apiData.timeSeriesData,
        categoryStats: apiData.categoryStats,
        tagStats: apiData.tagStats,
        monthlyTrends: apiData.monthlyTrends,
        performanceMetrics: {
          avgViewsPerArticle: apiData.performanceMetrics.avgViewsPerArticle,
          topPerformingDomain: apiData.performanceMetrics.topPerformingDomain,
          growthRate: parseInt(apiData.performanceMetrics.growthRate) || 0,
          engagementRate: apiData.performanceMetrics.engagementRate
        }
      };

      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading knowledge analytics:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred while loading data');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // Check if data is empty
  const isEmpty = analytics && (
    analytics.totalArticles === 0 ||
    (analytics.topArticles.length === 0 &&
     analytics.domainStats.length === 0 &&
     analytics.categoryStats.length === 0)
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Loading state
  if (loading) {
    return (
      <Container className="pt-16 sm:pt-20">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics data...</p>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container className="pt-16 sm:pt-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/admin/knowledge">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Knowledge
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Knowledge Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Failed to load data
              </p>
            </div>
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
              <Activity className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Failed to load data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                {error}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={loadAnalytics} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <Link href="/admin/knowledge">
                <Button variant="outline">
                  Back to Knowledge Management
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Empty data state
  if (isEmpty) {
    return (
      <Container className="pt-16 sm:pt-20">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/knowledge">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Knowledge
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Knowledge Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  No data available for analysis
                </p>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={loadAnalytics}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="p-4 bg-gray-100 dark:bg-slate-700 rounded-full">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                No knowledge base data
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Your knowledge base doesn't have any articles yet. Create some articles and detailed analytics will be displayed here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/knowledge">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Article
                </Button>
              </Link>
              <Button variant="outline" onClick={loadAnalytics}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Normal data display
  if (!analytics) {
    return (
      <Container className="pt-16 sm:pt-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Loading data...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="pt-16 sm:pt-20">
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin/knowledge">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Knowledge
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Knowledge Analytics
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed insights and statistics for knowledge base content
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
            
            <Button variant="outline" size="sm" onClick={loadAnalytics}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Total Views */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(analytics.totalViews)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{analytics.performanceMetrics.growthRate}% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Articles */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalArticles}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {analytics.publishedArticles} published, {analytics.draftArticles} drafts
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Avg Views per Article */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Views/Article</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.performanceMetrics.avgViewsPerArticle}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Top: {analytics.performanceMetrics.topPerformingDomain}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.performanceMetrics.engagementRate}%</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {analytics.featuredArticles} featured articles
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Views Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Views Over Time</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily views and article trends</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('views')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'views'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setViewMode('articles')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'articles'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Articles
              </button>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.viewsOverTime}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  type="category"
                  interval={Math.max(0, Math.floor((analytics.viewsOverTime?.length || 30) / 6))}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                {viewMode === 'views' ? (
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="#3B82F6"
                    fill="url(#colorViews)"
                    strokeWidth={2}
                    name="Daily Views"
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="articles"
                    stroke="#10B981"
                    fill="url(#colorArticles)"
                    strokeWidth={2}
                    name="Total Articles"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Domain Statistics and Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Domain Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Domain Distribution</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Articles by knowledge domain</p>
              </div>
              <FolderOpen className="w-5 h-5 text-gray-400" />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analytics.domainStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {analytics.domainStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [value, 'Articles']}
                    labelFormatter={(label) => `Domain: ${label}`}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {analytics.domainStats.map((domain, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    ></div>
                    <span className="text-gray-900 dark:text-white">{domain.name}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {domain.count} articles • {formatNumber(domain.views)} views
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly trends and engagement</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {analytics.performanceMetrics.growthRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {analytics.performanceMetrics.avgViewsPerArticle}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Views/Article</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {analytics.performanceMetrics.engagementRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyTrends}>
                  <defs>
                    <linearGradient id="knowledgePublished" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="knowledgeViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="knowledgeEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="published"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="url(#knowledgePublished)"
                    strokeWidth={2}
                    name="Published Articles"
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stackId="2"
                    stroke="#10B981"
                    fill="url(#knowledgeViews)"
                    strokeWidth={2}
                    name="Total Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stackId="3"
                    stroke="#F59E0B"
                    fill="url(#knowledgeEngagement)"
                    strokeWidth={2}
                    name="Engagement %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Category Stats and Top Articles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Category Distribution</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Articles by category</p>
              </div>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {analytics.categoryStats.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {category.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.count} articles
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-10 text-right">
                      {category.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performing Articles</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Most viewed articles</p>
              </div>
              <Star className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {analytics.topArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>{article.domain}</span>
                      <span>•</span>
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatNumber(article.views)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">views</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tag Cloud */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Tags</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Most used tags across articles</p>
            </div>
            <Tag className="w-5 h-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {analytics.tagStats.map((tag, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {tag.count}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {tag.tag}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {tag.percentage}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Container>
  );
}
