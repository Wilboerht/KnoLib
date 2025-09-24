"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Plus, X, Image, Bold, Italic, Code, Link, List, Quote, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { MediaInserter } from "@/components/ui/media-inserter";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// Article interface for form data
interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  href: string;
  readTime: number;
  lastUpdated: string;
  author: string;
  description: string;
  content: string;
  featured: boolean;
  tags: string[];
  domain: string;
  published: boolean;
}

interface Domain {
  id: string;
  name: string;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormProps {
  onSubmit: (article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Partial<Article>;
}

export function ArticleForm({ onSubmit, initialData }: ArticleFormProps) {
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [showMediaInserter, setShowMediaInserter] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const contentTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [newTag, setNewTag] = React.useState("");

  const [formData, setFormData] = React.useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    category: typeof initialData?.category === 'string'
      ? initialData.category
      : (initialData?.category?.name || ""),
    difficulty: initialData?.difficulty || "Beginner" as const,
    description: initialData?.excerpt || initialData?.description || "",
    content: initialData?.content || "",
    readTime: initialData?.readTime || "5 min read",
    tags: Array.isArray(initialData?.tags)
      ? initialData.tags.map(tagItem => {
          if (typeof tagItem === 'string') return tagItem;
          if (tagItem?.tag?.name) return tagItem.tag.name;
          if (tagItem?.name) return tagItem.name;
          return String(tagItem);
        })
      : [],
    domain: typeof initialData?.domain === 'string'
      ? initialData.domain
      : (initialData?.domain?.name || ""),
    featured: initialData?.featured || false,
    published: initialData?.published !== undefined ? initialData.published : true
  });

  // Load domain and category data
  React.useEffect(() => {
    const loadDomains = async () => {
      try {
        const response = await fetch('/api/domains');
        const result = await response.json();

        if (result.success) {
          setDomains(result.data);

          // If no initial data, set default values
          if (!initialData && result.data.length > 0) {
            const firstDomain = result.data[0];
            setFormData(prev => ({
              ...prev,
              domain: firstDomain.name,
              category: firstDomain.categories.length > 0 ? firstDomain.categories[0].name : ""
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load domain data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, [initialData]);

  // Auto-generate slug
  React.useEffect(() => {
    if (formData.title && !initialData?.slug) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, initialData?.slug]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // 插入文本到光标位置
  const insertTextAtCursor = (text: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = formData.content;

    const newContent = currentContent.substring(0, start) + text + currentContent.substring(end);
    handleInputChange('content', newContent);

    // 设置光标位置
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Markdown 工具栏功能
  const insertBold = () => insertTextAtCursor('**粗体文本**');
  const insertItalic = () => insertTextAtCursor('*斜体文本*');
  const insertCode = () => insertTextAtCursor('`代码`');
  const insertLink = () => insertTextAtCursor('[链接文本](https://example.com)');
  const insertList = () => insertTextAtCursor('\n- 列表项\n- 列表项\n');
  const insertQuote = () => insertTextAtCursor('\n> 引用文本\n');
  const insertHeading = () => insertTextAtCursor('\n## 标题\n');

  // 处理媒体插入
  const handleMediaInsert = (markdown: string) => {
    insertTextAtCursor(`\n${markdown}\n`);
    setShowMediaInserter(false);
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }));

    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');

    setFormData(prev => ({ ...prev, slug: cleanSlug }));

    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: "" }));
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleAddNewTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || !formData.title.trim()) {
      newErrors.title = "Article title is required";
    }

    if (!formData.slug || !formData.slug.trim()) {
      newErrors.slug = "Article slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.content || !formData.content.trim()) {
      newErrors.content = "Article content is required";
    }

    if (!formData.category || (typeof formData.category === 'string' && !formData.category.trim())) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        difficulty: formData.difficulty,
        href: `/knowledge/${formData.category.toLowerCase().replace(/\s+/g, '-')}/${formData.slug}`,
        readTime: formData.readTime,
        lastUpdated: new Date().toISOString().split('T')[0],
        author: "Wilboerht", // Fixed author name for personal knowledge sharing platform
        description: formData.description,
        content: formData.content,
        featured: formData.featured,
        tags: formData.tags,
        domain: formData.domain,
        published: formData.published
      };

      await onSubmit(article);
    } catch (error) {
      console.error('Error submitting article:', error);
      setErrors({ general: 'Failed to submit article. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Edit Article' : 'Add New Article'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {initialData ? 'Update article information and content' : 'Create a new article for your knowledge base'}
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Article Title *</Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g., Getting Started with React Hooks"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g., getting-started-react-hooks"
              className={errors.slug ? "border-red-500" : ""}
            />
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief article description..."
            rows={3}
          />
        </div>

        {/* Content */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="content">Content (Markdown) *</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="h-4 w-4 mr-1" />
                {showPreview ? '编辑' : '预览'}
              </Button>
            </div>
          </div>

          {/* Markdown 工具栏 */}
          <div className="flex items-center space-x-1 p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-md">
            <Button type="button" variant="ghost" size="sm" onClick={insertBold} title="粗体">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertItalic} title="斜体">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertCode} title="代码">
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="链接">
              <Link className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertList} title="列表">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={insertQuote} title="引用">
              <Quote className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowMediaInserter(true)}
              title="插入媒体"
            >
              <Image className="h-4 w-4 mr-1" />
              媒体
            </Button>
          </div>

          {showPreview ? (
            <div className="min-h-[400px] p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-b-md">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {formData.content ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children, ...props }) => {
                        // 检查是否包含图片，如果是则使用 div
                        const hasImage = React.Children.toArray(children).some(
                          child => React.isValidElement(child) && child.type === 'img'
                        );

                        if (hasImage) {
                          return <div className="my-4" {...props}>{children}</div>;
                        }

                        return <p {...props}>{children}</p>;
                      },
                      code: ({ node, inline, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      img: ({ src, alt, title, ...props }) => {
                        if (!src) return null;

                        return (
                          <span className="block my-6">
                            <img
                              src={src}
                              alt={alt || ''}
                              title={title}
                              className="max-w-full h-auto rounded-lg shadow-md mx-auto block"
                              loading="lazy"
                              {...props}
                            />
                            {alt && (
                              <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                                {alt}
                              </span>
                            )}
                          </span>
                        );
                      },
                      a: ({ href, children }) => {
                        if (!href) {
                          return <span>{children}</span>;
                        }

                        // 检查是否为媒体文件
                        const isMediaFile = (url: string): boolean => {
                          const mediaExtensions = [
                            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
                            '.mp4', '.webm', '.ogv', '.avi', '.mov',
                            '.mp3', '.wav', '.ogg', '.m4a', '.weba',
                            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md',
                            '.zip', '.rar', '.7z'
                          ];
                          return mediaExtensions.some(ext => url.toLowerCase().includes(ext));
                        };

                        const getFileType = (url: string): string => {
                          const urlLower = url.toLowerCase();
                          if (urlLower.includes('.mp4') || urlLower.includes('.webm') || urlLower.includes('.ogv')) {
                            return 'video';
                          }
                          if (urlLower.includes('.mp3') || urlLower.includes('.wav') || urlLower.includes('.ogg')) {
                            return 'audio';
                          }
                          return 'document';
                        };

                        const getFileName = (url: string): string => {
                          return url.split('/').pop() || 'file';
                        };

                        if (isMediaFile(href)) {
                          const fileType = getFileType(href);
                          const fileName = getFileName(href);

                          // 视频文件
                          if (fileType === 'video') {
                            return (
                              <span className="block my-6">
                                <video
                                  controls
                                  className="w-full max-w-4xl mx-auto rounded-lg shadow-md block"
                                  style={{ maxHeight: '500px' }}
                                >
                                  <source src={href} />
                                  您的浏览器不支持视频播放。
                                </video>
                                <span className="block text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                                  {children || fileName}
                                </span>
                              </span>
                            );
                          }

                          // 音频文件
                          if (fileType === 'audio') {
                            return (
                              <span className="block my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="flex items-center space-x-3 mb-3">
                                  <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 text-lg">🎵</span>
                                  </span>
                                  <span>
                                    <span className="block font-medium text-gray-900 dark:text-white">
                                      {children || fileName}
                                    </span>
                                    <span className="block text-sm text-gray-500 dark:text-gray-400">音频文件</span>
                                  </span>
                                </span>
                                <audio controls className="w-full">
                                  <source src={href} />
                                  您的浏览器不支持音频播放。
                                </audio>
                              </span>
                            );
                          }

                          // 文档文件
                          return (
                            <span className="block my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                              <span className="flex items-center space-x-3">
                                <span className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                                  <span className="text-red-600 dark:text-red-400">📎</span>
                                </span>
                                <span>
                                  <span className="block font-medium text-gray-900 dark:text-white">
                                    {children || fileName}
                                  </span>
                                  <span className="block text-sm text-gray-500 dark:text-gray-400">文档文件</span>
                                </span>
                              </span>
                            </span>
                          );
                        }

                        // 普通链接
                        return (
                          <a
                            href={href}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {children}
                          </a>
                        );
                      },
                    }}
                  >
                    {formData.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">开始编写内容以查看预览...</p>
                )}
              </div>
            </div>
          ) : (
            <Textarea
              ref={contentTextareaRef}
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your article content in Markdown format..."
              rows={15}
              className={`font-mono text-sm rounded-t-none ${errors.content ? "border-red-500" : ""}`}
            />
          )}

          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Use Markdown syntax for formatting. Supports code blocks, headers, lists, etc.
          </p>

          {/* 媒体插入器 */}
          {showMediaInserter && (
            <MediaInserter
              uploadedBy="default-user-id" // TODO: 从认证系统获取真实用户ID
              onInsert={handleMediaInsert}
              onClose={() => setShowMediaInserter(false)}
            />
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category */}
          <div>
            <Label htmlFor="category">Category *</Label>
            {loading ? (
              <div className="flex items-center space-x-2 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading categories...</span>
              </div>
            ) : (
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${errors.category ? "border-red-500" : ""}`}
              >
                <option value="">Select a category</option>
                {domains.map(domain =>
                  domain.categories.map(category => (
                    <option key={`${domain.id}-${category.id}`} value={category.name}>
                      {domain.name} - {category.name}
                    </option>
                  ))
                )}
              </select>
            )}
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Difficulty */}
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Read Time */}
          <div>
            <Label htmlFor="readTime">Read Time</Label>
            <Input
              id="readTime"
              type="text"
              value={formData.readTime}
              onChange={(e) => handleInputChange('readTime', e.target.value)}
              placeholder="e.g., 5 min read"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Knowledge Domain */}
          <div>
            <Label htmlFor="domain">Knowledge Domain</Label>
            <select
              id="domain"
              value={formData.domain}
              onChange={(e) => handleInputChange('domain', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="">Select a domain</option>
              {domains.map(domain => (
                <option key={domain.id} value={domain.name}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags</Label>

          {/* Selected Tags */}
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => {
                const tagString = typeof tag === 'string' ? tag : String(tag);
                return (
                  <span
                    key={`tag-${index}-${tagString}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                  >
                    {tagString}
                    <button
                      type="button"
                      onClick={() => removeTag(tagString)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* Add Custom Tag */}
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
            />
            <Button type="button" onClick={handleAddNewTag} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <input
              id="featured"
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="featured">Featured Article</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="published"
              type="checkbox"
              checked={formData.published}
              onChange={(e) => handleInputChange('published', e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <Label htmlFor="published">Publish Immediately</Label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
          <Button variant="outline" type="button">
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {initialData ? 'Update Article' : 'Create Article'}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
