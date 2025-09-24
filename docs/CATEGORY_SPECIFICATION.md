# KnoLib 分类规范文档

## 概述

本文档定义了 KnoLib 平台的知识分类体系，包括分类层级、命名规范、图标映射和数据结构标准。

## 分类层级结构

### 一级分类（Primary Categories）

KnoLib 采用三层分类体系：

```
一级分类 (Domain)
├── 二级分类 (Category)
│   ├── 三级分类 (Subcategory)
│   └── 内容项 (Content Items)
```

### 标准一级分类

| 分类名称 | 英文标识 | 图标 | 描述 |
|---------|---------|------|------|
| 计算机科学 | Computer Science | Code | 编程、软件开发、技术架构等 |
| 金融投资 | Finance | DollarSign | 投资理财、市场分析、风险管理等 |
| 摄影艺术 | Photography | Camera | 摄影技巧、后期处理、器材知识等 |
| 基础学科 | Basic Sciences | BookOpen | 数学、物理、学习方法等 |

## 数据结构规范

### TypeScript 接口定义

```typescript
interface ContentCategory {
  id: string;                    // 唯一标识符
  name: string;                  // 显示名称
  slug: string;                  // URL友好的标识符
  domain: string;                // 一级分类
  category?: string;             // 二级分类（可选）
  subcategory?: string;          // 三级分类（可选）
  icon: React.ComponentType<{ className?: string }>; // 图标组件
  description?: string;          // 描述信息
  tags?: string[];              // 标签
  level: 'domain' | 'category' | 'subcategory' | 'content'; // 层级
  parentId?: string;            // 父级ID
  order?: number;               // 排序权重
  isActive: boolean;            // 是否启用
  createdAt: Date;              // 创建时间
  updatedAt: Date;              // 更新时间
}
```

### 示例数据结构

```typescript
const categoryExamples: ContentCategory[] = [
  // 一级分类示例
  {
    id: 'cs-001',
    name: 'Computer Science',
    slug: 'computer-science',
    domain: 'Computer Science',
    icon: Code,
    description: '计算机科学相关知识领域',
    level: 'domain',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 二级分类示例
  {
    id: 'cs-frontend-001',
    name: 'Frontend Development',
    slug: 'frontend-development',
    domain: 'Computer Science',
    category: 'Frontend Development',
    icon: Monitor,
    description: '前端开发技术和框架',
    level: 'category',
    parentId: 'cs-001',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  
  // 三级分类示例
  {
    id: 'cs-frontend-react-001',
    name: 'React.js',
    slug: 'reactjs',
    domain: 'Computer Science',
    category: 'Frontend Development',
    subcategory: 'React.js',
    icon: Code,
    description: 'React.js 框架相关知识',
    level: 'subcategory',
    parentId: 'cs-frontend-001',
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
```

## 命名规范

### 分类命名原则

1. **一致性**: 使用统一的命名风格
2. **简洁性**: 名称简洁明了，易于理解
3. **唯一性**: 同级分类名称不重复
4. **国际化**: 支持中英文双语

### 命名格式

- **显示名称**: 使用正式的完整名称（如 "Frontend Development"）
- **Slug**: 使用小写字母和连字符（如 "frontend-development"）
- **ID**: 使用前缀+编号格式（如 "cs-frontend-001"）

### ID 前缀规范

| 一级分类 | 前缀 | 示例 |
|---------|------|------|
| Computer Science | cs | cs-001, cs-frontend-001 |
| Finance | fin | fin-001, fin-investment-001 |
| Photography | photo | photo-001, photo-technique-001 |
| Basic Sciences | sci | sci-001, sci-math-001 |

## 图标映射规范

### 图标选择原则

1. **语义化**: 图标应与分类内容相关
2. **一致性**: 同类分类使用相似风格的图标
3. **可识别性**: 图标应易于识别和区分

### 标准图标映射

```typescript
const iconMapping = {
  // 一级分类图标
  'Computer Science': Code,
  'Finance': DollarSign,
  'Photography': Camera,
  'Basic Sciences': BookOpen,
  
  // 二级分类图标
  'Frontend Development': Monitor,
  'Backend Development': Server,
  'Database': Database,
  'DevOps': GitBranch,
  'Mobile Development': Smartphone,
  'Investment': TrendingUp,
  'Risk Management': Shield,
  'Photography Techniques': Camera,
  'Post Processing': Image,
  'Mathematics': Calculator,
  'Physics': Atom,
  'Learning Methods': Brain,
  
  // 默认图标
  'default': BookOpen
};
```

### 图标获取函数

```typescript
function getCategoryIcon(category: string, level: string): React.ComponentType {
  // 精确匹配
  if (iconMapping[category]) {
    return iconMapping[category];
  }
  
  // 关键词匹配
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('computer') || lowerCategory.includes('tech') || lowerCategory.includes('code')) {
    return Code;
  } else if (lowerCategory.includes('finance') || lowerCategory.includes('money') || lowerCategory.includes('investment')) {
    return DollarSign;
  } else if (lowerCategory.includes('photo') || lowerCategory.includes('image')) {
    return Camera;
  } else if (lowerCategory.includes('science') || lowerCategory.includes('math') || lowerCategory.includes('physics')) {
    return BookOpen;
  } else if (lowerCategory.includes('frontend') || lowerCategory.includes('ui')) {
    return Monitor;
  } else if (lowerCategory.includes('backend') || lowerCategory.includes('server')) {
    return Server;
  } else if (lowerCategory.includes('database') || lowerCategory.includes('data')) {
    return Database;
  }
  
  // 默认图标
  return iconMapping.default;
}
```

## 分类管理规范

### 添加新分类

1. **确定层级**: 明确新分类属于哪个层级
2. **检查重复**: 确保同级别没有重复名称
3. **分配ID**: 按照ID规范分配唯一标识符
4. **选择图标**: 根据图标映射规范选择合适图标
5. **设置关系**: 正确设置父子关系
6. **更新文档**: 及时更新本规范文档

### 修改现有分类

1. **影响评估**: 评估修改对现有内容的影响
2. **数据迁移**: 制定数据迁移计划
3. **向后兼容**: 考虑向后兼容性
4. **测试验证**: 充分测试修改后的功能

### 删除分类

1. **内容检查**: 确认分类下没有关联内容
2. **依赖分析**: 检查其他分类的依赖关系
3. **软删除**: 优先使用软删除（isActive: false）
4. **清理工作**: 清理相关的缓存和索引

## 实现指南

### 动态分类生成

```typescript
// 从数据中动态生成分类列表
function generateCategoryTree(categories: ContentCategory[]): CategoryTree {
  const domains = categories.filter(cat => cat.level === 'domain');
  
  return domains.map(domain => ({
    ...domain,
    children: categories
      .filter(cat => cat.parentId === domain.id)
      .map(category => ({
        ...category,
        children: categories.filter(cat => cat.parentId === category.id)
      }))
  }));
}

// 获取特定层级的分类
function getCategoriesByLevel(categories: ContentCategory[], level: string): ContentCategory[] {
  return categories.filter(cat => cat.level === level && cat.isActive);
}

// 获取分类路径
function getCategoryPath(categories: ContentCategory[], categoryId: string): string[] {
  const category = categories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  const path = [category.name];
  if (category.parentId) {
    path.unshift(...getCategoryPath(categories, category.parentId));
  }
  
  return path;
}
```

### 分类验证

```typescript
// 分类数据验证
function validateCategory(category: ContentCategory): ValidationResult {
  const errors: string[] = [];
  
  if (!category.id || !category.id.match(/^[a-z]+-[a-z0-9-]+-\d{3}$/)) {
    errors.push('ID格式不正确');
  }
  
  if (!category.name || category.name.trim().length === 0) {
    errors.push('名称不能为空');
  }
  
  if (!category.slug || !category.slug.match(/^[a-z0-9-]+$/)) {
    errors.push('Slug格式不正确');
  }
  
  if (!['domain', 'category', 'subcategory', 'content'].includes(category.level)) {
    errors.push('层级值无效');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## 最佳实践

### 1. 分类设计原则

- **用户导向**: 从用户角度设计分类体系
- **逻辑清晰**: 分类层级逻辑清晰，易于理解
- **扩展性强**: 预留扩展空间，支持未来增长
- **维护简单**: 分类体系易于维护和管理

### 2. 性能优化

- **缓存策略**: 对分类数据进行适当缓存
- **懒加载**: 大型分类树采用懒加载策略
- **索引优化**: 为常用查询字段建立索引

### 3. 用户体验

- **搜索友好**: 支持分类名称和标签搜索
- **导航便利**: 提供面包屑导航和快速跳转
- **视觉一致**: 保持图标和样式的一致性

## 版本历史

- **v1.0.0** (2024-12-15): 初始版本，定义基础分类体系
- **v1.1.0** (待定): 计划添加多语言支持
- **v1.2.0** (待定): 计划添加自定义分类功能

---

*本文档将随着平台发展持续更新，请定期查看最新版本。*
