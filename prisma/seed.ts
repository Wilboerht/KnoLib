/**
 * 数据库种子数据
 * 
 * 用于初始化数据库的基础数据
 */

import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始播种数据库...');

  // 创建管理员用户
  const admin = await prisma.user.upsert({
    where: { email: 'admin@knolib.com' },
    update: {},
    create: {
      email: 'admin@knolib.com',
      name: 'KnoLib Admin',
      role: 'ADMIN',
    },
  });

  // 创建作者用户
  const author = await prisma.user.upsert({
    where: { email: 'wilboerht@knolib.com' },
    update: {},
    create: {
      email: 'wilboerht@knolib.com',
      name: 'Wilboerht',
      role: 'AUTHOR',
      bio: 'KnoLib 核心开发者',
    },
  });

  // 创建域名
  const computerScienceDomain = await prisma.domain.upsert({
    where: { slug: 'computer-science' },
    update: {},
    create: {
      name: 'Computer Science',
      slug: 'computer-science',
      description: '计算机科学相关知识领域',
      icon: 'Code',
      order: 1,
    },
  });

  const financeDomain = await prisma.domain.upsert({
    where: { slug: 'finance' },
    update: {},
    create: {
      name: 'Finance',
      slug: 'finance',
      description: '金融投资相关知识',
      icon: 'DollarSign',
      order: 2,
    },
  });

  // 创建分类
  const frontendCategory = await prisma.category.upsert({
    where: { 
      domainId_slug: {
        domainId: computerScienceDomain.id,
        slug: 'frontend-development'
      }
    },
    update: {},
    create: {
      name: 'Frontend Development',
      slug: 'frontend-development',
      description: '前端开发技术和框架',
      icon: 'Monitor',
      color: '#3B82F6',
      domainId: computerScienceDomain.id,
      order: 1,
    },
  });

  const backendCategory = await prisma.category.upsert({
    where: { 
      domainId_slug: {
        domainId: computerScienceDomain.id,
        slug: 'backend-development'
      }
    },
    update: {},
    create: {
      name: 'Backend Development',
      slug: 'backend-development',
      description: '后端开发技术和架构',
      icon: 'Server',
      color: '#10B981',
      domainId: computerScienceDomain.id,
      order: 2,
    },
  });

  const databaseCategory = await prisma.category.upsert({
    where: { 
      domainId_slug: {
        domainId: computerScienceDomain.id,
        slug: 'database'
      }
    },
    update: {},
    create: {
      name: 'Database',
      slug: 'database',
      description: '数据库设计和管理',
      icon: 'Database',
      color: '#F59E0B',
      domainId: computerScienceDomain.id,
      order: 3,
    },
  });

  const devopsCategory = await prisma.category.upsert({
    where: { 
      domainId_slug: {
        domainId: computerScienceDomain.id,
        slug: 'devops'
      }
    },
    update: {},
    create: {
      name: 'DevOps',
      slug: 'devops',
      description: '开发运维和自动化',
      icon: 'GitBranch',
      color: '#EF4444',
      domainId: computerScienceDomain.id,
      order: 4,
    },
  });

  // 创建标签
  const reactTag = await prisma.tag.upsert({
    where: { slug: 'react' },
    update: {},
    create: {
      name: 'React',
      slug: 'react',
      color: '#61DAFB',
    },
  });

  const javascriptTag = await prisma.tag.upsert({
    where: { slug: 'javascript' },
    update: {},
    create: {
      name: 'JavaScript',
      slug: 'javascript',
      color: '#F7DF1E',
    },
  });

  const nextjsTag = await prisma.tag.upsert({
    where: { slug: 'nextjs' },
    update: {},
    create: {
      name: 'Next.js',
      slug: 'nextjs',
      color: '#000000',
    },
  });

  const deploymentTag = await prisma.tag.upsert({
    where: { slug: 'deployment' },
    update: {},
    create: {
      name: 'Deployment',
      slug: 'deployment',
      color: '#8B5CF6',
    },
  });

  // 创建示例文章
  const reactArticle = await prisma.article.upsert({
    where: { slug: 'intro-to-react' },
    update: {},
    create: {
      title: 'React 入门指南',
      slug: 'intro-to-react',
      excerpt: '从零开始学习 React，掌握现代前端开发的核心技术',
      content: `# React 入门指南

React 是一个用于构建用户界面的 JavaScript 库...

## 什么是 React？

React 是由 Facebook 开发的开源 JavaScript 库...

## 核心概念

### 1. 组件
组件是 React 应用的基本构建块...

### 2. JSX
JSX 是 JavaScript 的语法扩展...

### 3. Props
Props 是组件之间传递数据的方式...

### 4. State
State 是组件内部的数据状态...`,
      difficulty: Difficulty.BEGINNER,
      readTime: 15,
      featured: true,
      published: true,
      publishedAt: new Date(),
      authorId: author.id,
      domainId: computerScienceDomain.id,
      categoryId: frontendCategory.id,
    },
  });

  const nextjsArticle = await prisma.article.upsert({
    where: { slug: 'nextjs-deployment' },
    update: {},
    create: {
      title: 'Next.js 应用部署指南',
      slug: 'nextjs-deployment',
      excerpt: '学习如何将 Next.js 应用部署到各种平台',
      content: `# Next.js 应用部署指南

本指南将教你如何将 Next.js 应用部署到不同的平台...

## 部署选项

### 1. Vercel (推荐)
Vercel 是 Next.js 的官方部署平台...

### 2. Netlify
Netlify 提供简单的静态站点部署...

### 3. 自托管
使用 Docker 和云服务器进行自托管...`,
      difficulty: Difficulty.INTERMEDIATE,
      readTime: 20,
      featured: false,
      published: true,
      publishedAt: new Date(),
      authorId: author.id,
      domainId: computerScienceDomain.id,
      categoryId: devopsCategory.id,
    },
  });

  // 关联文章和标签
  await prisma.articleTag.createMany({
    data: [
      { articleId: reactArticle.id, tagId: reactTag.id },
      { articleId: reactArticle.id, tagId: javascriptTag.id },
      { articleId: nextjsArticle.id, tagId: nextjsTag.id },
      { articleId: nextjsArticle.id, tagId: deploymentTag.id },
    ],
    skipDuplicates: true,
  });

  // 创建技术解决方案分类
  const frontendTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'frontend-development' },
    update: {},
    create: {
      name: 'Frontend Development',
      slug: 'frontend-development',
      description: '前端开发解决方案和最佳实践',
      icon: 'Monitor',
      color: '#3B82F6',
      order: 1,
    },
  });

  const backendTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'backend-development' },
    update: {},
    create: {
      name: 'Backend Development',
      slug: 'backend-development',
      description: '后端开发架构和解决方案',
      icon: 'Server',
      color: '#10B981',
      order: 2,
    },
  });

  const databaseTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'database' },
    update: {},
    create: {
      name: 'Database',
      slug: 'database',
      description: '数据库设计和优化解决方案',
      icon: 'Database',
      color: '#F59E0B',
      order: 3,
    },
  });

  const devopsTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'devops' },
    update: {},
    create: {
      name: 'DevOps',
      slug: 'devops',
      description: 'DevOps实践和基础设施解决方案',
      icon: 'GitBranch',
      color: '#EF4444',
      order: 4,
    },
  });

  const mobileTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'mobile-development' },
    update: {},
    create: {
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: '移动应用开发解决方案',
      icon: 'Smartphone',
      color: '#8B5CF6',
      order: 5,
    },
  });

  const aiTechCategory = await prisma.techCategory.upsert({
    where: { slug: 'artificial-intelligence' },
    update: {},
    create: {
      name: 'Artificial Intelligence',
      slug: 'artificial-intelligence',
      description: 'AI和机器学习解决方案',
      icon: 'Brain',
      color: '#06B6D4',
      order: 6,
    },
  });

  console.log('✅ 数据库播种完成');
  console.log(`👤 创建用户: ${admin.name}, ${author.name}`);
  console.log(`🏷️ 创建域名: ${computerScienceDomain.name}, ${financeDomain.name}`);
  console.log(`📂 创建分类: ${frontendCategory.name}, ${backendCategory.name}, ${databaseCategory.name}, ${devopsCategory.name}`);
  console.log(`🔧 创建技术分类: ${frontendTechCategory.name}, ${backendTechCategory.name}, ${databaseTechCategory.name}, ${devopsTechCategory.name}, ${mobileTechCategory.name}, ${aiTechCategory.name}`);
  console.log(`🏷️ 创建标签: ${reactTag.name}, ${javascriptTag.name}, ${nextjsTag.name}, ${deploymentTag.name}`);
  console.log(`📝 创建文章: ${reactArticle.title}, ${nextjsArticle.title}`);
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
