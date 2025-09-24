# KnoLib 分类系统使用指南

## 概述

本指南介绍如何在 KnoLib 项目中使用标准化的分类系统。该系统提供了完整的分类管理功能，包括创建、验证、查询和维护分类数据。

## 快速开始

### 1. 导入必要的模块

```typescript
import { CategoryManager, ContentCategory } from '@/lib/category-manager';

// 仅在开发环境中导入测试数据
// import { getSampleCategories, getUniqueDomains } from '@/data/sample-categories';
```

### 2. 创建分类管理器实例

```typescript
// 生产环境：使用空的管理器，数据从API获取
const categoryManager = new CategoryManager([]);

// 开发环境：可以使用示例数据进行测试
// const categories = getSampleCategories();
// const categoryManager = new CategoryManager(categories);

// 从API获取数据的示例
async function loadCategoriesFromAPI() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    return new CategoryManager(categories);
  } catch (error) {
    console.error('加载分类数据失败:', error);
    return new CategoryManager([]); // 返回空管理器作为后备
  }
}
```

### 3. 基本操作

```typescript
// 获取所有活跃分类
const allCategories = categoryManager.getAllCategories();

// 获取唯一域名
const domains = categoryManager.getUniqueDomains();

// 根据域名获取分类
const csCategories = categoryManager.getCategoriesByDomain('Computer Science');

// 生成分类树
const categoryTree = categoryManager.generateCategoryTree();
```

## 核心功能

### 分类创建

```typescript
// 创建一级分类（域）
const domain = categoryManager.createCategory({
  name: 'Artificial Intelligence',
  domain: 'Artificial Intelligence',
  level: 'domain',
  description: 'AI and machine learning related topics',
  order: 5
});

// 创建二级分类
const category = categoryManager.createCategory({
  name: 'Machine Learning',
  domain: 'Artificial Intelligence',
  category: 'Machine Learning',
  level: 'category',
  parentId: domain.id,
  description: 'Machine learning algorithms and techniques',
  tags: ['ML', 'Algorithms', 'Data Science'],
  order: 1
});

// 创建三级分类
const subcategory = categoryManager.createCategory({
  name: 'Deep Learning',
  domain: 'Artificial Intelligence',
  category: 'Machine Learning',
  subcategory: 'Deep Learning',
  level: 'subcategory',
  parentId: category.id,
  description: 'Neural networks and deep learning',
  tags: ['Neural Networks', 'CNN', 'RNN', 'Transformers'],
  order: 1
});
```

### 分类查询

```typescript
// 按层级查询
const domains = categoryManager.getCategoriesByLevel('domain');
const categories = categoryManager.getCategoriesByLevel('category');
const subcategories = categoryManager.getCategoriesByLevel('subcategory');

// 搜索分类
const searchResults = categoryManager.searchCategories('machine learning');

// 获取分类路径
const path = categoryManager.getCategoryPath('cs-machine-learning-001');
// 返回: ['Computer Science', 'Machine Learning', 'Deep Learning']

// 获取统计信息
const stats = categoryManager.getCategoryStats();
console.log(stats);
// {
//   total: 25,
//   byLevel: { domain: 4, category: 12, subcategory: 9 },
//   byDomain: { 'Computer Science': 15, 'Finance': 5, ... }
// }
```

### 分类验证

```typescript
// 验证分类数据
const validation = CategoryManager.validateCategory(category);
if (!validation.isValid) {
  console.error('验证失败:', validation.errors);
}

// 生成标准化的ID和Slug
const id = CategoryManager.generateCategoryId('Computer Science', 'Frontend Development');
const slug = CategoryManager.generateSlug('React.js Framework');

// 获取合适的图标
const IconComponent = CategoryManager.getCategoryIcon('Machine Learning', 'category');
```

## 在组件中使用

### React 组件示例

```typescript
import React from 'react';
import { CategoryManager } from '@/lib/category-manager';
import { getSampleCategories } from '@/data/sample-categories';

export function CategorySelector() {
  const [categories] = React.useState(() => getSampleCategories());
  const [manager] = React.useState(() => new CategoryManager(categories));
  const [selectedDomain, setSelectedDomain] = React.useState('');

  const domains = React.useMemo(() => {
    return manager.getUniqueDomains();
  }, [manager]);

  const domainCategories = React.useMemo(() => {
    return selectedDomain ? manager.getCategoriesByDomain(selectedDomain) : [];
  }, [manager, selectedDomain]);

  return (
    <div>
      {/* 域名选择器 */}
      <div className="mb-4">
        <h3>选择知识域名</h3>
        {domains.map(domain => {
          const IconComponent = CategoryManager.getCategoryIcon(domain, 'domain');
          return (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`flex items-center space-x-2 p-2 rounded ${
                selectedDomain === domain ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{domain}</span>
            </button>
          );
        })}
      </div>

      {/* 分类显示 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {domainCategories.map(category => (
          <div key={category.id} className="p-4 border rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <category.icon className="w-5 h-5" />
              <h4 className="font-medium">{category.name}</h4>
            </div>
            <p className="text-sm text-gray-600">{category.description}</p>
            <div className="mt-2">
              <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                {category.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 分类树组件

```typescript
export function CategoryTree() {
  const [categories] = React.useState(() => getSampleCategories());
  const [manager] = React.useState(() => new CategoryManager(categories));

  const categoryTree = React.useMemo(() => {
    return manager.generateCategoryTree();
  }, [manager]);

  const renderCategory = (category: CategoryTree, level = 0) => {
    const IconComponent = category.icon;
    
    return (
      <div key={category.id} style={{ marginLeft: level * 20 }}>
        <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded">
          <IconComponent className="w-4 h-4" />
          <span className="font-medium">{category.name}</span>
          <span className="text-xs text-gray-500">({category.level})</span>
        </div>
        {category.children?.map(child => renderCategory(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {categoryTree.map(category => renderCategory(category))}
    </div>
  );
}
```

## 数据管理

### 添加新分类

```typescript
// 1. 确定分类层级和父级关系
const parentCategory = manager.getCategoriesByLevel('category')
  .find(cat => cat.name === 'Frontend Development');

// 2. 创建新分类
try {
  const newCategory = manager.createCategory({
    name: 'Svelte',
    domain: 'Computer Science',
    category: 'Frontend Development',
    subcategory: 'Svelte',
    level: 'subcategory',
    parentId: parentCategory?.id,
    description: 'Svelte framework for building user interfaces',
    tags: ['Svelte', 'SvelteKit', 'Reactive', 'Compiler'],
    order: 4
  });
  
  console.log('新分类创建成功:', newCategory);
} catch (error) {
  console.error('创建失败:', error.message);
}
```

### 更新分类

```typescript
// 更新分类信息
const updatedCategory = manager.updateCategory('cs-frontend-svelte-001', {
  description: '更新后的描述',
  tags: ['Svelte', 'SvelteKit', 'Reactive', 'Compiler', 'TypeScript'],
  order: 3
});

if (updatedCategory) {
  console.log('更新成功:', updatedCategory);
} else {
  console.log('分类不存在');
}
```

### 删除分类

```typescript
// 软删除分类（推荐）
const deleted = manager.deleteCategory('cs-frontend-svelte-001');
if (deleted) {
  console.log('分类已删除');
}
```

## 最佳实践

### 1. 分类命名

- **一致性**: 使用统一的命名风格
- **简洁性**: 名称简洁明了，避免过长
- **描述性**: 名称应准确描述分类内容
- **国际化**: 考虑多语言支持

```typescript
// 好的命名
'Frontend Development'
'Machine Learning'
'Investment Strategies'

// 避免的命名
'前端开发技术相关内容'
'ML_stuff'
'inv-strat'
```

### 2. 层级设计

- **逻辑清晰**: 分类层级应符合逻辑
- **深度适中**: 避免过深的层级结构（建议不超过4级）
- **扩展性**: 预留扩展空间

```typescript
// 推荐的层级结构
Domain (Computer Science)
├── Category (Frontend Development)
│   ├── Subcategory (React.js)
│   │   └── Content (React Hooks)
│   └── Subcategory (Vue.js)
└── Category (Backend Development)
```

### 3. 图标选择

- **语义化**: 图标应与内容相关
- **一致性**: 同类分类使用相似图标
- **可识别性**: 图标应易于识别

```typescript
// 使用分类管理器的图标选择
const icon = CategoryManager.getCategoryIcon('Machine Learning');
// 自动选择合适的图标，或者手动指定
```

### 4. 性能优化

```typescript
// 使用 useMemo 缓存计算结果
const domains = React.useMemo(() => {
  return manager.getUniqueDomains();
}, [manager]);

// 使用 useCallback 缓存函数
const handleDomainChange = React.useCallback((domain: string) => {
  setSelectedDomain(domain);
}, []);
```

## 故障排除

### 常见问题

1. **分类验证失败**
   ```typescript
   // 检查分类数据格式
   const validation = CategoryManager.validateCategory(category);
   console.log(validation.errors);
   ```

2. **图标不显示**
   ```typescript
   // 确保图标组件正确导入
   import { Code } from 'lucide-react';
   
   // 检查图标映射
   const IconComponent = CategoryManager.getCategoryIcon(categoryName);
   ```

3. **分类树为空**
   ```typescript
   // 检查数据是否正确加载
   console.log('总分类数:', manager.getAllCategories().length);
   console.log('域名数:', manager.getUniqueDomains().length);
   ```

### 调试工具

```typescript
// 获取详细统计信息
const stats = manager.getCategoryStats();
console.table(stats);

// 检查分类关系
const tree = manager.generateCategoryTree();
console.log('分类树:', JSON.stringify(tree, null, 2));

// 验证所有分类
const allCategories = manager.getAllCategories();
allCategories.forEach(cat => {
  const validation = CategoryManager.validateCategory(cat);
  if (!validation.isValid) {
    console.error(`分类 ${cat.name} 验证失败:`, validation.errors);
  }
});
```

## 扩展功能

### 自定义图标映射

```typescript
// 扩展图标映射
const customIconMapping = {
  'Blockchain': Bitcoin,
  'Cryptocurrency': Coins,
  'Web3': Globe,
};

// 自定义图标获取函数
function getCustomIcon(categoryName: string) {
  return customIconMapping[categoryName] || CategoryManager.getCategoryIcon(categoryName);
}
```

### 多语言支持

```typescript
interface LocalizedCategory extends ContentCategory {
  nameI18n: Record<string, string>;
  descriptionI18n: Record<string, string>;
}

// 获取本地化名称
function getLocalizedName(category: LocalizedCategory, locale: string): string {
  return category.nameI18n[locale] || category.name;
}
```

## 环境配置

### 开发环境 vs 生产环境

**开发环境特性：**
- 可以使用测试数据和示例数据
- 调试工具可用（`window.KnoLibDebug`）
- 测试页面可访问（`/test-categories`）
- 详细的控制台日志

**生产环境特性：**
- 使用空的分类管理器，数据从API获取
- 调试工具被禁用
- 测试页面返回404
- 最小化的日志输出

### 环境检测

```typescript
// 检查当前环境
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  // 开发环境特定代码
  console.log('开发模式：可以使用调试工具');
} else {
  // 生产环境特定代码
  console.log('生产模式：使用API数据');
}
```

### 数据源配置

```typescript
// 推荐的数据加载模式
async function initializeCategoryManager(): Promise<CategoryManager> {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境：可以选择使用测试数据
    const { getSampleCategories } = await import('@/data/sample-categories');
    return new CategoryManager(getSampleCategories());
  } else {
    // 生产环境：从API加载
    try {
      const response = await fetch('/api/categories');
      const categories = await response.json();
      return new CategoryManager(categories);
    } catch (error) {
      console.error('加载分类数据失败:', error);
      return new CategoryManager([]); // 后备方案
    }
  }
}
```

---

更多详细信息请参考：

**核心文档：**
- [分类规范文档](./CATEGORY_SPECIFICATION.md)
- [系统实现文档](./CATEGORY_SYSTEM_IMPLEMENTATION.md)
- [API 文档](../src/lib/category-manager.ts)

**开发资源：**
- [测试数据](../src/data/sample-categories.ts)（仅开发环境）
- [调试工具](../src/components/debug/)（仅开发环境）
- [测试页面](../src/app/test-categories/)（仅开发环境）
