const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedViewLogs() {
  try {
    console.log('🌱 开始填充浏览量日志数据...');

    // 获取所有已发布的解决方案
    const solutions = await prisma.techSolution.findMany({
      where: { published: true },
      select: { id: true, views: true, createdAt: true, publishedAt: true }
    });

    if (solutions.length === 0) {
      console.log('❌ 没有找到已发布的解决方案');
      return;
    }

    console.log(`📊 找到 ${solutions.length} 个已发布的解决方案`);

    // 生成过去30天的浏览量日志
    const days = 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let totalViewLogs = 0;
    const dailyStats = [];

    for (let d = 0; d < days; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + d);
      
      let dailyViews = 0;
      let dailyNewSolutions = 0;

      // 为每个解决方案生成当天的浏览量
      for (const solution of solutions) {
        // 检查解决方案是否在当天之前发布
        if (solution.publishedAt && solution.publishedAt <= currentDate) {
          // 基于解决方案的总浏览量生成合理的日浏览量
          const avgDailyViews = Math.max(1, Math.floor(solution.views / 15)); // 更合理的分布
          // 使用确定性的分布而不是随机数
          const daysSincePublish = Math.floor((currentDate - solution.publishedAt) / (1000 * 60 * 60 * 24));
          const dailyViewsForSolution = Math.max(1, Math.floor(avgDailyViews * (1 + Math.sin(daysSincePublish * 0.1) * 0.3)));

          // 生成浏览量日志
          for (let v = 0; v < dailyViewsForSolution; v++) {
            const viewTime = new Date(currentDate);
            // 使用确定性的时间分布：工作时间更多浏览量
            const hour = (v % 16) + 8; // 8-23点之间分布
            const minute = (v * 7) % 60; // 确定性的分钟分布
            const second = (v * 13) % 60; // 确定性的秒分布
            viewTime.setHours(hour, minute, second);

            await prisma.viewLog.create({
              data: {
                solutionId: solution.id,
                userIp: `192.168.1.${(v % 254) + 1}`, // 确定性的IP分布
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                viewedAt: viewTime,
                sessionId: `session_${solution.id}_${currentDate.toISOString().split('T')[0]}_${v}`
              }
            });

            totalViewLogs++;
            dailyViews++;
          }
        }

        // 检查是否是新发布的解决方案
        if (solution.publishedAt && solution.publishedAt.toDateString() === currentDate.toDateString()) {
          dailyNewSolutions++;
        }
      }

      // 计算当天的统计数据
      const solutionsExistingByDate = solutions.filter(s => s.publishedAt && s.publishedAt <= currentDate).length;
      const publishedByDate = solutions.filter(s =>
        s.publishedAt && s.publishedAt <= currentDate
      ).length;

      // 创建每日统计记录
      await prisma.dailyStat.upsert({
        where: { date: currentDate },
        update: {
          totalSolutions: solutionsExistingByDate,
          publishedSolutions: publishedByDate,
          totalViews: dailyViews,
          newSolutions: dailyNewSolutions
        },
        create: {
          date: currentDate,
          totalSolutions: solutionsExistingByDate,
          publishedSolutions: publishedByDate,
          totalViews: dailyViews,
          newSolutions: dailyNewSolutions
        }
      });

      dailyStats.push({
        date: currentDate.toISOString().split('T')[0],
        views: dailyViews,
        solutions: solutionsExistingByDate,
        newSolutions: dailyNewSolutions
      });

      if (d % 5 === 0) {
        console.log(`📅 已处理 ${d + 1}/${days} 天的数据...`);
      }
    }

    console.log(`✅ 成功创建 ${totalViewLogs} 条浏览量日志`);
    console.log(`📈 创建了 ${dailyStats.length} 天的统计数据`);
    
    // 显示最近几天的统计
    console.log('\n📊 最近5天的统计数据：');
    dailyStats.slice(-5).forEach(stat => {
      console.log(`${stat.date}: ${stat.views} 浏览量, ${stat.solutions} 解决方案, ${stat.newSolutions} 新增`);
    });

  } catch (error) {
    console.error('❌ 填充数据时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  seedViewLogs();
}
