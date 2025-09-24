#!/usr/bin/env node

/**
 * 部署前检查脚本
 * 验证环境变量和配置是否正确设置
 */

const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvFile() {
  log('\n🔍 检查环境变量文件...', 'blue');
  
  const envFiles = ['.env.local', '.env'];
  let envFileExists = false;
  
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      log(`✅ 找到环境变量文件: ${file}`, 'green');
      envFileExists = true;
      break;
    }
  }
  
  if (!envFileExists) {
    log('❌ 未找到环境变量文件 (.env.local 或 .env)', 'red');
    log('💡 请复制 .env.example 为 .env.local 并填入正确的值', 'yellow');
    return false;
  }
  
  return true;
}

function checkRequiredEnvVars() {
  log('\n🔍 检查必需的环境变量...', 'blue');
  
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_APP_URL'
  ];
  
  const missingVars = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    } else {
      log(`✅ ${varName}`, 'green');
    }
  }
  
  if (missingVars.length > 0) {
    log(`❌ 缺少必需的环境变量:`, 'red');
    missingVars.forEach(varName => {
      log(`   - ${varName}`, 'red');
    });
    return false;
  }
  
  return true;
}

function checkDatabaseConnection() {
  log('\n🔍 检查数据库连接配置...', 'blue');
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    log('❌ DATABASE_URL 未设置', 'red');
    return false;
  }
  
  // 检查数据库 URL 格式
  if (databaseUrl.startsWith('postgresql://')) {
    log('✅ PostgreSQL 数据库配置', 'green');
    
    // 检查是否是 Supabase
    if (databaseUrl.includes('supabase.co')) {
      log('✅ 使用 Supabase 数据库', 'green');
    }
    
    return true;
  } else if (databaseUrl.startsWith('mysql://')) {
    log('✅ MySQL 数据库配置', 'green');
    return true;
  } else {
    log('❌ 不支持的数据库类型', 'red');
    log('💡 请使用 PostgreSQL 或 MySQL', 'yellow');
    return false;
  }
}

function checkNextAuthConfig() {
  log('\n🔍 检查 NextAuth 配置...', 'blue');
  
  const secret = process.env.NEXTAUTH_SECRET;
  const url = process.env.NEXTAUTH_URL;
  
  if (!secret) {
    log('❌ NEXTAUTH_SECRET 未设置', 'red');
    return false;
  }
  
  if (secret.length < 32) {
    log('⚠️  NEXTAUTH_SECRET 太短，建议至少 32 个字符', 'yellow');
  } else {
    log('✅ NEXTAUTH_SECRET 长度合适', 'green');
  }
  
  if (!url) {
    log('❌ NEXTAUTH_URL 未设置', 'red');
    return false;
  }
  
  if (url.startsWith('http://localhost') && process.env.NODE_ENV === 'production') {
    log('⚠️  生产环境不应使用 localhost URL', 'yellow');
  } else {
    log('✅ NEXTAUTH_URL 配置正确', 'green');
  }
  
  return true;
}

function checkPackageJson() {
  log('\n🔍 检查 package.json 配置...', 'blue');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // 检查必需的脚本
    const requiredScripts = ['build', 'start', 'db:generate'];
    const missingScripts = [];
    
    for (const script of requiredScripts) {
      if (!packageJson.scripts[script]) {
        missingScripts.push(script);
      }
    }
    
    if (missingScripts.length > 0) {
      log(`❌ 缺少必需的脚本:`, 'red');
      missingScripts.forEach(script => {
        log(`   - ${script}`, 'red');
      });
      return false;
    }
    
    log('✅ package.json 脚本配置正确', 'green');
    
    // 检查必需的依赖
    const requiredDeps = ['@prisma/client', 'next', 'react'];
    const missingDeps = [];
    
    for (const dep of requiredDeps) {
      if (!packageJson.dependencies[dep]) {
        missingDeps.push(dep);
      }
    }
    
    if (missingDeps.length > 0) {
      log(`❌ 缺少必需的依赖:`, 'red');
      missingDeps.forEach(dep => {
        log(`   - ${dep}`, 'red');
      });
      return false;
    }
    
    log('✅ package.json 依赖配置正确', 'green');
    return true;
    
  } catch (error) {
    log('❌ 无法读取 package.json', 'red');
    return false;
  }
}

function checkPrismaSchema() {
  log('\n🔍 检查 Prisma 配置...', 'blue');
  
  const schemaPath = 'prisma/schema.prisma';
  
  if (!fs.existsSync(schemaPath)) {
    log('❌ 未找到 prisma/schema.prisma', 'red');
    return false;
  }
  
  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 检查数据源配置
    if (schema.includes('provider = "postgresql"')) {
      log('✅ PostgreSQL 数据源配置', 'green');
    } else if (schema.includes('provider = "mysql"')) {
      log('✅ MySQL 数据源配置', 'green');
    } else {
      log('❌ 未找到支持的数据源配置', 'red');
      return false;
    }
    
    // 检查环境变量引用
    if (schema.includes('env("DATABASE_URL")')) {
      log('✅ 数据库 URL 环境变量配置正确', 'green');
    } else {
      log('❌ 数据库 URL 环境变量配置错误', 'red');
      return false;
    }
    
    return true;
    
  } catch (error) {
    log('❌ 无法读取 Prisma schema', 'red');
    return false;
  }
}

function main() {
  log('🚀 KnoLib 部署前检查', 'blue');
  log('================================', 'blue');
  
  const checks = [
    checkEnvFile,
    checkRequiredEnvVars,
    checkDatabaseConnection,
    checkNextAuthConfig,
    checkPackageJson,
    checkPrismaSchema
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    if (!check()) {
      allPassed = false;
    }
  }
  
  log('\n================================', 'blue');
  
  if (allPassed) {
    log('🎉 所有检查通过！可以开始部署了', 'green');
    log('\n📝 部署步骤:', 'blue');
    log('1. 推送代码到 GitHub', 'yellow');
    log('2. 在 Vercel 中导入项目', 'yellow');
    log('3. 配置环境变量', 'yellow');
    log('4. 部署项目', 'yellow');
    log('5. 运行数据库迁移', 'yellow');
    process.exit(0);
  } else {
    log('❌ 检查失败，请修复上述问题后重试', 'red');
    process.exit(1);
  }
}

// 运行检查
main();
