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
  BookOpen
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

interface AnalyticsData {
  totalViews: number;
  totalSolutions: number;
  publishedSolutions: number;
  draftSolutions: number;
  avgReadTime: number;
  totalCategories: number;
  featuredSolutions: number;
  topSolutions: Array<{
    id: string;
    title: string;
    views: number;
    category: string;
    difficulty: string;
    publishedAt: string;
  }>;
  categoryStats: Array<{
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
    solutions: number;
    categories: number;
  }>;
  difficultyStats: Array<{
    difficulty: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  techStackStats: Array<{
    tech: string;
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
    avgViewsPerSolution: number;
    topPerformingCategory: string;
    growthRate: number;
    engagementRate: number;
  };
}

export default function TechSolutionsAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('views');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Load real analytics data
      const period = timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : timeRange === '90d' ? '90' : '365';
      const statsRes = await fetch(`/api/tech-solutions/stats?period=${period}`);
      const statsData = await statsRes.json();

      if (statsData.success) {
        const {
          current,
          categoryStats,
          topSolutions,
          difficultyStats,
          techStackStats,
          timeSeriesData,
          growth
        } = statsData.data;

        // Process real data from API
        const totalViews = current.totalViews;
        const publishedSolutions = current.publishedSolutions;
        const draftSolutions = current.totalSolutions - current.publishedSolutions;
        const featuredSolutions = 0; // 需要从API添加这个字段

        // Enhanced category statistics with real data
        const enhancedCategoryStats = categoryStats.map((cat: any) => ({
          ...cat,
          publishedCount: cat.count, // API已经只返回已发布的
          draftCount: 0 // 需要从API添加这个字段
        }));

        // Use real difficulty distribution from API
        const difficultyColors = {
          BEGINNER: '#10B981',
          INTERMEDIATE: '#F59E0B',
          ADVANCED: '#EF4444',
          UNKNOWN: '#6B7280'
        };

        const enhancedDifficultyStats = difficultyStats.map((stat: any) => ({
          ...stat,
          color: difficultyColors[stat.difficulty as keyof typeof difficultyColors] || '#6B7280'
        }));

        // Use real tech stack data from API (already processed)

        // Use real time series data from API
        const viewsOverTime = timeSeriesData.map((item: any) => ({
          date: item.dateFormatted,
          views: item.views,
          solutions: item.solutions,
          categories: 0 // 可以从API添加这个字段
        }));

        // Generate monthly trends from time series data
        const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (5 - i));

          // 从时间序列数据中聚合月度数据
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const monthData = timeSeriesData.filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate >= monthStart && itemDate <= monthEnd;
          });

          return {
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            published: monthData.reduce((sum: number, item: any) => sum + item.published, 0),
            views: monthData.reduce((sum: number, item: any) => sum + item.views, 0),
            engagement: monthData.length > 0 ? Math.round((monthData.reduce((sum: number, item: any) => sum + item.published, 0) / monthData.reduce((sum: number, item: any) => sum + item.views, 0)) * 100) || 0 : 0
          };
        });

        // Calculate real performance metrics
        const avgViewsPerSolution = current.totalSolutions > 0 ? Math.round(totalViews / current.totalSolutions) : 0;
        const topCategory = enhancedCategoryStats.length > 0
          ? enhancedCategoryStats.reduce((prev: any, current: any) =>
              (prev.views > current.views) ? prev : current
            )
          : { name: 'N/A', views: 0 };

        const performanceMetrics = {
          avgViewsPerSolution,
          topPerformingCategory: topCategory?.name || 'N/A',
          growthRate: growth.totalSolutions ? parseInt(growth.totalSolutions.change.replace(/[+%]/g, '')) || 0 : 0,
          engagementRate: totalViews > 0 ? Math.round((current.publishedSolutions / totalViews) * 10000) / 100 : 0 // 发布解决方案数 / 总浏览量 * 100
        };

        setAnalytics({
          totalViews,
          totalSolutions: current.totalSolutions,
          publishedSolutions,
          draftSolutions,
          avgReadTime: 5,
          totalCategories: current.totalCategories,
          featuredSolutions,
          topSolutions,
          categoryStats: enhancedCategoryStats,
          viewsOverTime,
          difficultyStats: enhancedDifficultyStats,
          techStackStats,
          monthlyTrends,
          performanceMetrics
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 3 Months';
      case '1y': return 'Last Year';
      default: return 'Last 7 Days';
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="py-8">
          {/* Header with Return Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Return Button Area */}
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/admin/tech-solutions">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tech Solutions Management
                </Button>
              </Link>
            </div>

            {/* Header with Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Tech Solutions Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Comprehensive insights and performance metrics for your technical solutions
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Time Range Selector */}
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 3 Months</option>
                  <option value="1y">Last Year</option>
                </select>

                {/* Refresh Button */}
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  size="sm"
                  variant="outline"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                {/* Export Button */}
                <Button size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500 dark:text-gray-400">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Key Metrics Dashboard */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
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

                {/* Total Solutions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Solutions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalSolutions}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {analytics.publishedSolutions} published, {analytics.draftSolutions} drafts
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Avg Views per Solution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Views/Solution</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.performanceMetrics.avgViewsPerSolution}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Top: {analytics.performanceMetrics.topPerformingCategory}
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
                        {analytics.featuredSolutions} featured solutions
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Charts Section */}
              <motion.div
                className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Views Over Time Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Views Over Time
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedMetric('views')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedMetric === 'views'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        Views
                      </button>
                      <button
                        onClick={() => setSelectedMetric('solutions')}
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          selectedMetric === 'solutions'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                        }`}
                      >
                        Solutions
                      </button>
                    </div>
                  </div>
                  <div className="h-80">
                    {analytics.viewsOverTime && analytics.viewsOverTime.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.viewsOverTime}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSolutions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            dataKey="date"
                            className="text-xs"
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey={selectedMetric}
                            stroke={selectedMetric === 'views' ? '#3B82F6' : '#10B981'}
                            fillOpacity={1}
                            fill={selectedMetric === 'views' ? 'url(#colorViews)' : 'url(#colorSolutions)'}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Solutions by Category
                  </h3>
                  <div className="h-80">
                    {analytics.categoryStats && analytics.categoryStats.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analytics.categoryStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            paddingAngle={5}
                            dataKey="count"
                          >
                            {analytics.categoryStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [value, 'Solutions']}
                            labelFormatter={(label) => `Category: ${label}`}
                          />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No category data available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Detailed Analytics */}
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Top Solutions */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Top Performing Solutions
                    </h3>
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {analytics.topSolutions && analytics.topSolutions.length > 0 ? analytics.topSolutions.map((solution, index) => (
                      <div key={solution.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              #{index + 1}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              solution.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                              solution.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {solution.difficulty}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {solution.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {solution.category} • {new Date(solution.publishedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatNumber(solution.views)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">views</p>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No solutions available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty Distribution */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Difficulty Distribution
                  </h3>
                  <div className="space-y-4">
                    {analytics.difficultyStats && analytics.difficultyStats.length > 0 ? analytics.difficultyStats.map((stat) => (
                      <div key={stat.difficulty} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stat.color }}
                            />
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {stat.difficulty}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {stat.count}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              ({stat.percentage}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${stat.percentage}%`,
                              backgroundColor: stat.color
                            }}
                          />
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No difficulty data available</p>
                      </div>
                    )}
                  </div>

                  {/* Tech Stack Analysis */}
                  <div className="mt-8">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
                      Popular Technologies
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {analytics.techStackStats && analytics.techStackStats.length > 0 ? analytics.techStackStats.slice(0, 8).map((tech) => (
                        <div key={tech.tech} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                            {tech.tech}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 ml-2">
                            {tech.count}
                          </span>
                        </div>
                      )) : (
                        <div className="col-span-2 text-center py-4 text-gray-500 dark:text-gray-400">
                          <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No tech stack data available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Monthly Trends & Summary */}
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Performance Summary
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    {getTimeRangeLabel()}
                  </div>
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
                      {analytics.performanceMetrics.avgViewsPerSolution}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Views/Solution</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {analytics.performanceMetrics.engagementRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</div>
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.monthlyTrends}>
                      <defs>
                        <linearGradient id="performancePublished" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="performanceViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="performanceEngagement" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="month"
                        className="text-xs"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="published"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="url(#performancePublished)"
                        strokeWidth={2}
                        name="Published Solutions"
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        stackId="2"
                        stroke="#10B981"
                        fill="url(#performanceViews)"
                        strokeWidth={2}
                        name="Total Views"
                      />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        stackId="3"
                        stroke="#F59E0B"
                        fill="url(#performanceEngagement)"
                        strokeWidth={2}
                        name="Engagement %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
