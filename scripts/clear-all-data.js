/**
 * 清理所有测试数据脚本
 * 
 * 删除数据库中的所有数据，保持表结构
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('🧹 开始清理所有测试数据...\n');

  try {
    // 按照外键依赖顺序删除数据
    console.log('1. 删除关联表数据...');
    
    // 删除文章标签关联
    const articleTagsCount = await prisma.articleTag.deleteMany({});
    console.log(`   ✅ 删除了 ${articleTagsCount.count} 个文章标签关联`);

    // 删除技术解决方案标签关联
    const techSolutionTagsCount = await prisma.techSolutionTag.deleteMany({});
    console.log(`   ✅ 删除了 ${techSolutionTagsCount.count} 个技术解决方案标签关联`);

    // 删除代码示例
    const codeExamplesCount = await prisma.codeExample.deleteMany({});
    console.log(`   ✅ 删除了 ${codeExamplesCount.count} 个代码示例`);

    // 删除文章SEO数据
    const articleSEOCount = await prisma.articleSEO.deleteMany({});
    console.log(`   ✅ 删除了 ${articleSEOCount.count} 个文章SEO记录`);

    // 删除媒体文件记录
    const mediaFilesCount = await prisma.mediaFile.deleteMany({});
    console.log(`   ✅ 删除了 ${mediaFilesCount.count} 个媒体文件记录`);

    console.log('\n2. 删除主要内容数据...');

    // 删除技术解决方案
    const techSolutionsCount = await prisma.techSolution.deleteMany({});
    console.log(`   ✅ 删除了 ${techSolutionsCount.count} 个技术解决方案`);

    // 删除文章
    const articlesCount = await prisma.article.deleteMany({});
    console.log(`   ✅ 删除了 ${articlesCount.count} 篇文章`);

    console.log('\n3. 删除分类数据...');

    // 删除子分类
    const subcategoriesCount = await prisma.subcategory.deleteMany({});
    console.log(`   ✅ 删除了 ${subcategoriesCount.count} 个子分类`);

    // 删除分类
    const categoriesCount = await prisma.category.deleteMany({});
    console.log(`   ✅ 删除了 ${categoriesCount.count} 个分类`);

    // 删除技术分类
    const techCategoriesCount = await prisma.techCategory.deleteMany({});
    console.log(`   ✅ 删除了 ${techCategoriesCount.count} 个技术分类`);

    // 删除域名
    const domainsCount = await prisma.domain.deleteMany({});
    console.log(`   ✅ 删除了 ${domainsCount.count} 个域名`);

    // 删除标签
    const tagsCount = await prisma.tag.deleteMany({});
    console.log(`   ✅ 删除了 ${tagsCount.count} 个标签`);

    console.log('\n4. 删除用户数据...');

    // 删除用户（最后删除，因为其他表可能引用用户）
    const usersCount = await prisma.user.deleteMany({});
    console.log(`   ✅ 删除了 ${usersCount.count} 个用户`);

    console.log('\n🎉 数据清理完成！');
    console.log('\n📊 清理统计:');
    console.log(`   - 用户: ${usersCount.count}`);
    console.log(`   - 域名: ${domainsCount.count}`);
    console.log(`   - 分类: ${categoriesCount.count}`);
    console.log(`   - 子分类: ${subcategoriesCount.count}`);
    console.log(`   - 技术分类: ${techCategoriesCount.count}`);
    console.log(`   - 文章: ${articlesCount.count}`);
    console.log(`   - 技术解决方案: ${techSolutionsCount.count}`);
    console.log(`   - 标签: ${tagsCount.count}`);
    console.log(`   - 文章标签关联: ${articleTagsCount.count}`);
    console.log(`   - 技术解决方案标签关联: ${techSolutionTagsCount.count}`);
    console.log(`   - 代码示例: ${codeExamplesCount.count}`);
    console.log(`   - 文章SEO: ${articleSEOCount.count}`);
    console.log(`   - 媒体文件: ${mediaFilesCount.count}`);

    const totalRecords = usersCount.count + domainsCount.count + categoriesCount.count + 
                        subcategoriesCount.count + techCategoriesCount.count + articlesCount.count + 
                        techSolutionsCount.count + tagsCount.count + articleTagsCount.count + 
                        techSolutionTagsCount.count + codeExamplesCount.count + articleSEOCount.count + 
                        mediaFilesCount.count;

    console.log(`\n   总计删除: ${totalRecords} 条记录`);

    // 验证数据库是否为空
    console.log('\n5. 验证数据库状态...');
    const remainingUsers = await prisma.user.count();
    const remainingDomains = await prisma.domain.count();
    const remainingCategories = await prisma.category.count();
    const remainingArticles = await prisma.article.count();
    const remainingTechCategories = await prisma.techCategory.count();
    const remainingTechSolutions = await prisma.techSolution.count();

    if (remainingUsers === 0 && remainingDomains === 0 && remainingCategories === 0 && 
        remainingArticles === 0 && remainingTechCategories === 0 && remainingTechSolutions === 0) {
      console.log('   ✅ 数据库已完全清空');
    } else {
      console.log('   ⚠️  数据库中仍有剩余数据:');
      if (remainingUsers > 0) console.log(`      - 用户: ${remainingUsers}`);
      if (remainingDomains > 0) console.log(`      - 域名: ${remainingDomains}`);
      if (remainingCategories > 0) console.log(`      - 分类: ${remainingCategories}`);
      if (remainingArticles > 0) console.log(`      - 文章: ${remainingArticles}`);
      if (remainingTechCategories > 0) console.log(`      - 技术分类: ${remainingTechCategories}`);
      if (remainingTechSolutions > 0) console.log(`      - 技术解决方案: ${remainingTechSolutions}`);
    }

    console.log('\n💡 提示:');
    console.log('   - 数据库结构保持不变');
    console.log('   - 可以重新运行 npm run db:seed 添加新数据');
    console.log('   - 或者通过 API 添加生产数据');

  } catch (error) {
    console.error('❌ 清理数据时发生错误:', error);
    console.log('\n💡 可能的解决方案:');
    console.log('   1. 检查数据库连接是否正常');
    console.log('   2. 确保没有其他进程正在使用数据库');
    console.log('   3. 检查外键约束是否正确');
  } finally {
    await prisma.$disconnect();
  }
}

// 检查命令行参数
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('清理所有测试数据脚本');
  console.log('');
  console.log('用法:');
  console.log('  node scripts/clear-all-data.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --confirm    确认执行清理操作');
  console.log('  --help, -h   显示帮助信息');
  console.log('');
  console.log('功能:');
  console.log('  - 删除数据库中的所有数据');
  console.log('  - 保持数据库表结构不变');
  console.log('  - 按照外键依赖顺序安全删除');
  console.log('  - 提供详细的删除统计');
  console.log('');
  console.log('⚠️  警告: 此操作不可逆，请确保已备份重要数据！');
  process.exit(0);
}

if (!args.includes('--confirm')) {
  console.log('⚠️  警告: 此操作将删除数据库中的所有数据！');
  console.log('');
  console.log('这将删除:');
  console.log('  - 所有用户数据');
  console.log('  - 所有域名和分类');
  console.log('  - 所有文章和技术解决方案');
  console.log('  - 所有标签和关联数据');
  console.log('');
  console.log('如果确认要继续，请使用 --confirm 参数:');
  console.log('  node scripts/clear-all-data.js --confirm');
  console.log('');
  console.log('💡 建议先备份数据库:');
  console.log('  pg_dump your_database > backup.sql');
  process.exit(1);
}

// 执行清理
clearAllData();
