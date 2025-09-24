/**
 * 数据库重置脚本
 * 
 * 重置数据库到初始状态（无数据）
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function resetDatabase() {
  console.log('🔄 开始重置数据库...\n');

  try {
    // 1. 备份当前的 seed 文件
    const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
    const seedBackupPath = path.join(process.cwd(), 'prisma', 'seed.ts.backup');
    
    if (fs.existsSync(seedPath)) {
      console.log('1. 备份当前的 seed 文件...');
      fs.copyFileSync(seedPath, seedBackupPath);
      console.log('   ✅ seed.ts 已备份为 seed.ts.backup');
    }

    // 2. 创建空的 seed 文件
    console.log('\n2. 创建空的 seed 文件...');
    const emptySeedContent = `/**
 * 空的数据库种子文件
 * 
 * 用于重置数据库到无数据状态
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 数据库重置完成，无种子数据');
  console.log('💡 数据库现在是空的，可以通过 API 添加数据');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
`;

    fs.writeFileSync(seedPath, emptySeedContent);
    console.log('   ✅ 已创建空的 seed 文件');

    // 3. 重置数据库
    console.log('\n3. 重置数据库...');
    console.log('   这将删除所有数据并重新创建表结构...');
    
    try {
      execSync('npx prisma migrate reset --force', { 
        stdio: 'inherit',
        cwd: process.cwd()
      });
      console.log('   ✅ 数据库重置成功');
    } catch (error) {
      console.error('   ❌ 数据库重置失败:', error.message);
      throw error;
    }

    // 4. 恢复原始 seed 文件
    console.log('\n4. 恢复原始 seed 文件...');
    if (fs.existsSync(seedBackupPath)) {
      fs.copyFileSync(seedBackupPath, seedPath);
      fs.unlinkSync(seedBackupPath);
      console.log('   ✅ 已恢复原始 seed.ts 文件');
    }

    console.log('\n🎉 数据库重置完成！');
    console.log('\n📋 重置结果:');
    console.log('   ✅ 所有数据已删除');
    console.log('   ✅ 数据库表结构已重新创建');
    console.log('   ✅ 数据库现在是空的');
    console.log('');
    console.log('💡 下一步操作:');
    console.log('   - 通过 API 添加生产数据');
    console.log('   - 或运行 npm run db:seed 添加测试数据');
    console.log('   - 或手动添加数据');

  } catch (error) {
    console.error('❌ 重置过程中发生错误:', error.message);
    
    // 尝试恢复 seed 文件
    const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
    const seedBackupPath = path.join(process.cwd(), 'prisma', 'seed.ts.backup');
    
    if (fs.existsSync(seedBackupPath)) {
      console.log('🔄 正在恢复原始 seed 文件...');
      fs.copyFileSync(seedBackupPath, seedPath);
      fs.unlinkSync(seedBackupPath);
      console.log('✅ 已恢复原始 seed.ts 文件');
    }

    console.log('\n💡 可能的解决方案:');
    console.log('   1. 检查数据库连接是否正常');
    console.log('   2. 确保 DATABASE_URL 环境变量正确设置');
    console.log('   3. 检查数据库服务是否运行');
    console.log('   4. 手动运行: npx prisma migrate reset');
    
    process.exit(1);
  }
}

// 检查命令行参数
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('数据库重置脚本');
  console.log('');
  console.log('用法:');
  console.log('  node scripts/reset-database.js [选项]');
  console.log('');
  console.log('选项:');
  console.log('  --confirm    确认执行重置操作');
  console.log('  --help, -h   显示帮助信息');
  console.log('');
  console.log('功能:');
  console.log('  - 删除数据库中的所有数据');
  console.log('  - 重新创建数据库表结构');
  console.log('  - 保持 schema.prisma 不变');
  console.log('  - 自动备份和恢复 seed 文件');
  console.log('');
  console.log('⚠️  警告: 此操作不可逆，请确保已备份重要数据！');
  process.exit(0);
}

if (!args.includes('--confirm')) {
  console.log('⚠️  警告: 此操作将完全重置数据库！');
  console.log('');
  console.log('这将:');
  console.log('  - 删除所有现有数据');
  console.log('  - 重新创建所有表结构');
  console.log('  - 重置数据库到初始状态');
  console.log('');
  console.log('如果确认要继续，请使用 --confirm 参数:');
  console.log('  node scripts/reset-database.js --confirm');
  console.log('');
  console.log('💡 建议先备份数据库:');
  console.log('  pg_dump your_database > backup.sql');
  console.log('');
  console.log('或者使用更安全的清理脚本:');
  console.log('  node scripts/clear-all-data.js --confirm');
  process.exit(1);
}

// 执行重置
resetDatabase();
