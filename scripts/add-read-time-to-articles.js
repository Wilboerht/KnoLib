const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 计算阅读时间的函数（基于内容长度）
function calculateReadTime(content) {
  if (!content) return 3; // 默认3分钟
  
  // 平均阅读速度：200-250字/分钟
  const wordsPerMinute = 225;
  
  // 计算字数（包括中文字符）
  const wordCount = content.length;
  
  // 计算阅读时间（分钟）
  const readTime = Math.max(1, Math.ceil(wordCount / (wordsPerMinute * 4))); // 中文字符密度调整
  
  return Math.min(readTime, 30); // 最大30分钟
}

async function addReadTimeToArticles() {
  try {
    console.log('📖 为文章添加阅读时间数据...\n');

    // 获取所有没有readTime的文章
    const articlesWithoutReadTime = await prisma.article.findMany({
      where: {
        OR: [
          { readTime: null },
          { readTime: 0 }
        ]
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        readTime: true
      }
    });

    console.log(`找到 ${articlesWithoutReadTime.length} 篇需要添加阅读时间的文章`);

    if (articlesWithoutReadTime.length === 0) {
      console.log('✅ 所有文章都已有阅读时间数据');
      return;
    }

    // 为每篇文章计算并更新阅读时间
    for (const article of articlesWithoutReadTime) {
      const content = article.content || article.excerpt || '';
      const readTime = calculateReadTime(content);
      
      await prisma.article.update({
        where: { id: article.id },
        data: { readTime }
      });

      console.log(`✅ ${article.title}: ${readTime} 分钟`);
    }

    // 验证更新结果
    const updatedStats = await prisma.article.aggregate({
      where: { 
        published: true,
        readTime: { not: null }
      },
      _avg: { readTime: true },
      _min: { readTime: true },
      _max: { readTime: true },
      _count: { readTime: true }
    });

    console.log('\n📊 阅读时间统计:');
    console.log(`- 有阅读时间的文章数: ${updatedStats._count.readTime}`);
    console.log(`- 平均阅读时间: ${Math.round((updatedStats._avg.readTime || 0) * 10) / 10} 分钟`);
    console.log(`- 最短阅读时间: ${updatedStats._min.readTime || 0} 分钟`);
    console.log(`- 最长阅读时间: ${updatedStats._max.readTime || 0} 分钟`);

    console.log('\n🎉 阅读时间数据添加完成！');

  } catch (error) {
    console.error('❌ 添加阅读时间时出错:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
if (require.main === module) {
  addReadTimeToArticles();
}

module.exports = { addReadTimeToArticles, calculateReadTime };
