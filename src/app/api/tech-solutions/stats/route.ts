import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // 默认30天
    const days = parseInt(period);

    // 计算日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // 获取当前统计数据
    const [
      totalSolutions,
      totalCategories,
      publishedSolutions,
      totalViews,
      // 获取历史数据（指定时间段前的数据）
      historicalSolutions,
      historicalCategories,
      historicalPublished,
      historicalTotalViews,
      // 获取时间序列数据
      dailyStats
    ] = await Promise.all([
      // 当前数据
      prisma.techSolution.count(),
      prisma.techCategory.count({ where: { isActive: true } }),
      prisma.techSolution.count({ where: { published: true } }),
      prisma.techSolution.aggregate({
        _sum: { views: true }
      }),
      
      // 历史数据（指定天数前的数据）
      prisma.techSolution.count({
        where: {
          createdAt: { lt: startDate }
        }
      }),
      prisma.techCategory.count({
        where: {
          isActive: true,
          createdAt: { lt: startDate }
        }
      }),
      prisma.techSolution.count({
        where: {
          published: true,
          publishedAt: { lt: startDate }
        }
      }),
      // 历史浏览量总和
      prisma.dailyStat.aggregate({
        where: {
          date: { lt: startDate }
        },
        _sum: { totalViews: true }
      }),

      // 获取每日统计数据
      prisma.$queryRaw`
        SELECT
          DATE("createdAt") as date,
          COUNT(*) as solutions_created,
          COUNT(CASE WHEN published = true THEN 1 END) as solutions_published
        FROM tech_solutions
        WHERE "createdAt" >= ${startDate}
        GROUP BY DATE("createdAt")
        ORDER BY date ASC
      `
    ]);

    // 计算增长
    const calculateGrowth = (current: number, previous: number) => {
      if (current === 0) return null;
      if (previous === 0) return { change: 'New', trend: 'up' as const };
      
      const growth = Math.round(((current - previous) / previous) * 100);
      return {
        change: growth > 0 ? `+${growth}%` : `${growth}%`,
        trend: growth >= 0 ? 'up' as const : 'down' as const
      };
    };

    // 获取分类统计
    const categoryStats = await prisma.techCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            solutions: {
              where: { published: true }
            }
          }
        },
        solutions: {
          where: { published: true },
          select: { views: true }
        }
      }
    });

    // 处理分类数据
    const processedCategoryStats = categoryStats.map(cat => ({
      id: cat.id,
      name: cat.name,
      count: cat._count.solutions,
      views: cat.solutions.reduce((sum, s) => sum + s.views, 0),
      color: cat.color || '#3B82F6'
    }));

    // 获取顶级解决方案
    const topSolutions = await prisma.techSolution.findMany({
      where: { published: true },
      include: {
        category: {
          select: { name: true }
        }
      },
      orderBy: { views: 'desc' },
      take: 10
    });

    // 获取难度分布
    const difficultyStats = await prisma.techSolution.groupBy({
      by: ['difficulty'],
      _count: true,
      where: { published: true }
    });

    // 获取技术栈统计
    const techStackData = await prisma.techSolution.findMany({
      where: { published: true },
      select: { techStack: true }
    });

    // 处理技术栈数据
    const techStackMap: Record<string, number> = {};
    techStackData.forEach(solution => {
      solution.techStack.forEach(tech => {
        techStackMap[tech] = (techStackMap[tech] || 0) + 1;
      });
    });

    const techStackStats = Object.entries(techStackMap)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tech, count]) => ({
        tech,
        count,
        percentage: Math.round((count / totalSolutions) * 100)
      }));

    // 生成完整的日期序列
    const generateDateSeries = (days: number) => {
      const series = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        series.push({
          date: date.toISOString().split('T')[0],
          dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          solutions: 0,
          published: 0,
          views: 0
        });
      }
      return series;
    };

    // 填充真实数据
    const timeSeriesData = generateDateSeries(days);
    (dailyStats as any[]).forEach((stat: any) => {
      const dateStr = stat.date.toISOString().split('T')[0];
      const index = timeSeriesData.findIndex(item => item.date === dateStr);
      if (index !== -1) {
        timeSeriesData[index].solutions = Number(stat.solutions_created);
        timeSeriesData[index].published = Number(stat.solutions_published);
      }
    });

    // 获取真实的每日浏览量数据
    const dailyViewStats = await prisma.dailyStat.findMany({
      where: {
        date: {
          gte: startDate
        }
      },
      select: {
        date: true,
        totalViews: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // 将真实浏览量数据合并到时间序列中
    timeSeriesData.forEach(item => {
      const matchingViewStat = dailyViewStats.find(stat =>
        stat.date.toISOString().split('T')[0] === item.date
      );
      item.views = matchingViewStat ? matchingViewStat.totalViews : 0;
    });

    const currentTotalViews = totalViews._sum.views || 0;
    const historicalTotalViewsSum = historicalTotalViews._sum.totalViews || 0;

    const response = {
      current: {
        totalSolutions,
        totalCategories,
        publishedSolutions,
        totalViews: currentTotalViews
      },
      historical: {
        totalSolutions: historicalSolutions,
        totalCategories: historicalCategories,
        publishedSolutions: historicalPublished
      },
      growth: {
        totalSolutions: calculateGrowth(totalSolutions, historicalSolutions),
        totalCategories: calculateGrowth(totalCategories, historicalCategories),
        publishedSolutions: calculateGrowth(publishedSolutions, historicalPublished),
        totalViews: calculateGrowth(currentTotalViews, historicalTotalViewsSum)
      },
      categoryStats: processedCategoryStats,
      topSolutions: topSolutions.map(solution => ({
        id: solution.id,
        title: solution.title,
        views: solution.views,
        category: solution.category?.name || 'Uncategorized',
        difficulty: solution.difficulty,
        publishedAt: solution.publishedAt || solution.createdAt
      })),
      difficultyStats: difficultyStats.map(stat => ({
        difficulty: stat.difficulty,
        count: stat._count,
        percentage: Math.round((stat._count / totalSolutions) * 100)
      })),
      techStackStats,
      timeSeriesData,
      period: days
    };

    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Error fetching tech solution stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
