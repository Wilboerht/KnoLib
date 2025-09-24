import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Get current statistics
    const [
      totalArticles,
      totalDomains,
      totalCategories,
      publishedArticles,
      totalViews,
      // Get historical data for growth calculation
      historicalArticles,
      historicalDomains,
      historicalPublished,
      // Get time series data
      dailyStats,
      // Historical total views
      historicalTotalViews
    ] = await Promise.all([
      // Current data
      prisma.article.count(),
      prisma.domain.count({ where: { isActive: true } }),
      prisma.category.count({ where: { isActive: true } }),
      prisma.article.count({ where: { published: true } }),
      prisma.article.aggregate({
        _sum: { views: true }
      }),
      
      // Historical data (specified days ago)
      prisma.article.count({
        where: {
          createdAt: { lt: startDate }
        }
      }),
      prisma.domain.count({
        where: {
          isActive: true,
          createdAt: { lt: startDate }
        }
      }),
      prisma.article.count({
        where: {
          published: true,
          publishedAt: { lt: startDate }
        }
      }),
      
      // Time series data for charts
      prisma.$queryRaw`
        SELECT
          DATE("createdAt") as date,
          COUNT(*) as articles_created,
          COUNT(CASE WHEN published = true THEN 1 END) as articles_published
        FROM articles
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `,

      // Historical total views for growth calculation
      prisma.article.aggregate({
        where: {
          published: true,
          publishedAt: { lt: startDate }
        },
        _sum: { views: true }
      })
    ]);

    // Calculate growth percentages
    const calculateGrowth = (current: number, historical: number) => {
      if (historical === 0) {
        return current > 0 ? { change: 'New', trend: 'up' as const } : { change: '0%', trend: 'neutral' as const };
      }
      const growth = ((current - historical) / historical) * 100;
      const change = growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
      const trend = growth > 0 ? 'up' as const : growth < 0 ? 'down' as const : 'neutral' as const;
      return { change, trend };
    };

    // Generate date series for charts
    const generateDateSeries = (days: number) => {
      const series = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        series.push({
          date: date.toISOString().split('T')[0],
          views: 0,
          articles: 0,
          domains: 0
        });
      }
      return series;
    };

    // Get real monthly trends data
    const getMonthlyTrends = async () => {
      const now = new Date();
      const months = [];

      // Get last 3 months data
      for (let i = 2; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const nextMonthDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        const [monthPublished, monthViews] = await Promise.all([
          prisma.article.count({
            where: {
              published: true,
              publishedAt: {
                gte: monthDate,
                lt: nextMonthDate
              }
            }
          }),
          prisma.article.aggregate({
            where: {
              published: true,
              publishedAt: {
                gte: monthDate,
                lt: nextMonthDate
              }
            },
            _sum: { views: true }
          })
        ]);

        const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
        const monthTotalViews = monthViews._sum.views || 0;
        const engagement = monthTotalViews > 0 ? Math.round((monthPublished / monthTotalViews) * 100) : 0;

        months.push({
          month: monthName,
          published: monthPublished,
          views: monthTotalViews,
          engagement: engagement
        });
      }

      return months;
    };

    // Get real daily views data based on article publish dates and views
    const getDailyViewsData = async (days: number) => {
      const series = [];

      // Get all published articles with their publish dates and views
      const publishedArticles = await prisma.article.findMany({
        where: { published: true },
        select: {
          publishedAt: true,
          views: true,
          createdAt: true
        }
      });

      // Generate consistent date series
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to start of day

      for (let i = days - 1; i >= 0; i--) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() - i);

        // Format date consistently as YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // Get articles created on this date
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(currentDate);
        dayEnd.setDate(dayEnd.getDate() + 1);

        const articlesCreated = await prisma.article.count({
          where: {
            createdAt: {
              gte: dayStart,
              lt: dayEnd
            }
          }
        });

        // Calculate views for this day based on articles published by this date
        let dailyViews = 0;
        publishedArticles.forEach(article => {
          const publishDate = article.publishedAt || article.createdAt;
          if (publishDate <= currentDate) {
            // Distribute article views across days since publication
            const daysSincePublish = Math.max(1, Math.floor((currentDate.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
            dailyViews += Math.floor((article.views || 0) / daysSincePublish);
          }
        });

        series.push({
          date: dateStr,
          views: Math.max(0, dailyViews),
          articles: articlesCreated,
          domains: totalDomains
        });
      }
      return series;
    };

    const timeSeriesData = await getDailyViewsData(period);

    // Get domain statistics
    const domainStats = await prisma.domain.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { published: true }
            }
          }
        },
        articles: {
          where: { published: true },
          select: { views: true }
        }
      }
    });

    const processedDomainStats = domainStats.map((domain, index) => ({
      name: domain.name,
      count: domain._count.articles,
      views: domain.articles.reduce((sum, article) => sum + (article.views || 0), 0),
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'][index % 6],
      publishedCount: domain._count.articles,
      draftCount: 0 // Will be calculated separately if needed
    }));

    // Get category statistics
    const categoryStats = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { published: true }
            }
          }
        }
      }
    });

    const totalCategoryArticles = categoryStats.reduce((sum, cat) => sum + cat._count.articles, 0);
    const processedCategoryStats = categoryStats.slice(0, 5).map((category, index) => ({
      category: category.name,
      count: category._count.articles,
      percentage: totalCategoryArticles > 0 ? Math.round((category._count.articles / totalCategoryArticles) * 100) : 0,
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
    }));

    // Get top articles
    const topArticles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { views: 'desc' },
      take: 5,
      include: {
        domain: {
          select: { name: true }
        },
        category: {
          select: { name: true }
        }
      }
    });

    // Get tag statistics
    const tagStats = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            articles: true
          }
        }
      },
      orderBy: {
        articles: {
          _count: 'desc'
        }
      },
      take: 6
    });

    const totalTagUsage = tagStats.reduce((sum, tag) => sum + tag._count.articles, 0);
    const processedTagStats = tagStats.map(tag => ({
      tag: tag.name,
      count: tag._count.articles,
      percentage: totalTagUsage > 0 ? Math.round((tag._count.articles / totalTagUsage) * 100) : 0
    }));

    const currentTotalViews = totalViews._sum.views || 0;
    const draftArticles = totalArticles - publishedArticles;

    // Get real monthly trends
    const monthlyTrends = await getMonthlyTrends();

    const response = {
      success: true,
      data: {
        current: {
          totalArticles,
          totalDomains,
          totalCategories,
          publishedArticles,
          totalViews: currentTotalViews
        },
        historical: {
          totalArticles: historicalArticles,
          totalDomains: historicalDomains,
          publishedArticles: historicalPublished
        },
        growth: {
          totalArticles: calculateGrowth(totalArticles, historicalArticles),
          totalDomains: calculateGrowth(totalDomains, historicalDomains),
          publishedArticles: calculateGrowth(publishedArticles, historicalPublished),
          totalViews: calculateGrowth(currentTotalViews, historicalTotalViews._sum.views || 0)
        },
        domainStats: processedDomainStats,
        categoryStats: processedCategoryStats,
        topArticles: topArticles.map(article => ({
          id: article.id,
          title: article.title,
          views: article.views || 0,
          domain: article.domain?.name || 'Unknown',
          category: article.category?.name || 'Uncategorized',
          publishedAt: article.publishedAt?.toISOString() || article.createdAt.toISOString()
        })),
        tagStats: processedTagStats,
        timeSeriesData,
        monthlyTrends,
        performanceMetrics: {
          avgViewsPerArticle: publishedArticles > 0 ? Math.round(currentTotalViews / publishedArticles) : 0,
          topPerformingDomain: processedDomainStats.length > 0 ? processedDomainStats.reduce((prev, current) => 
            (prev.views > current.views) ? prev : current
          ).name : 'N/A',
          growthRate: calculateGrowth(totalArticles, historicalArticles).change.replace(/[+%]/g, '') || '0',
          engagementRate: currentTotalViews > 0 ? Math.round((publishedArticles / currentTotalViews) * 10000) / 100 : 0
        },
        summary: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: currentTotalViews,
          totalDomains,
          totalCategories,
          featuredArticles: await prisma.article.count({ where: { published: true, featured: true } }),
          avgReadTime: await prisma.article.aggregate({
            where: { published: true, readTime: { not: null } },
            _avg: { readTime: true }
          }).then(result => Math.round((result._avg.readTime || 5) * 10) / 10) // Default to 5 minutes if no data
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching knowledge stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch knowledge statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
