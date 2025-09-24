'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Eye, Share2, Download, Github, ExternalLink, Tag, Calendar, User, Lock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SolutionNavigation } from '@/components/tech-solution/solution-navigation';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { CategoryPasswordModal } from '@/components/tech-solutions/category-password-modal';

interface TechSolution {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  projectType: string;
  techStack: string[];
  featured: boolean;
  published: boolean;
  views: number;
  publishedAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
    isProtected?: boolean;
  };
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
}



export default function SolutionDetailPage({
  params
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const resolvedParams = use(params);
  const [solution, setSolution] = useState<TechSolution | null>(null);
  const [relatedSolutions, setRelatedSolutions] = useState<TechSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [resolvedParams.category, resolvedParams.slug]);

  const fetchData = async () => {
    try {
      // First, get the category information to check if it's protected
      const categoryResponse = await fetch(`/api/tech-categories?slug=${resolvedParams.category}`);

      if (!categoryResponse.ok) {
        notFound();
        return;
      }

      const categoryData = await categoryResponse.json();
      if (!categoryData.success || !categoryData.data || categoryData.data.length === 0) {
        notFound();
        return;
      }

      const category = categoryData.data[0];

      // Check if category is protected
      if (category.isProtected) {
        // Check if already verified in this session
        const isAlreadyVerified = sessionStorage.getItem(`tech-category-${resolvedParams.category}-verified`) === 'true';
        if (!isAlreadyVerified) {
          setShowPasswordModal(true);
          setAccessDenied(true);
          setLoading(false);
          return;
        }
        setIsVerified(true);
      } else {
        setIsVerified(true);
      }

      // Now fetch the solution
      const response = await fetch(`/api/tech-solutions/${resolvedParams.slug}`);

      if (response.ok) {
        const data = await response.json();

        if (!data.data || data.data.category.slug !== resolvedParams.category) {
          notFound();
          return;
        }

        setSolution(data.data);

        // Fetch related solutions
        const relatedRes = await fetch(`/api/tech-solutions?published=true&category=${resolvedParams.category}&limit=3&exclude=${data.data.id}`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedSolutions(relatedData.data || []);
        }

        // Increment view count
        fetch(`/api/tech-solutions/${resolvedParams.slug}/view`, { method: 'POST' });
      } else {
        notFound();
      }
    } catch (error) {
      console.error('Error fetching solution:', error);
      notFound();
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSuccess = async () => {
    setShowPasswordModal(false);
    setIsVerified(true);
    setAccessDenied(false);
    // Retry fetching data after successful password verification
    await fetchData();
  };

  const handlePasswordCancel = () => {
    // Redirect back to category page
    window.location.href = `/tech-solutions/${resolvedParams.category}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: solution?.title,
          text: solution?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = async () => {
    if (!solution) return;

    try {
      // 动态导入 jsPDF
      const { jsPDF } = await import('jspdf');

      // 创建 PDF 实例
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // 设置中文字体支持
      pdf.setFont('helvetica');

      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // 添加水印和版权信息
      pdf.setFontSize(8);
      pdf.setTextColor(200, 200, 200);
      pdf.text('© KnoLib - Knowledge Library', pageWidth - 60, 10);

      // 标题
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'bold');
      const titleLines = pdf.splitTextToSize(solution.title, maxWidth);
      pdf.text(titleLines, margin, yPosition);
      yPosition += titleLines.length * 8 + 10;

      // 描述
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const descLines = pdf.splitTextToSize(solution.excerpt, maxWidth);
      pdf.text(descLines, margin, yPosition);
      yPosition += descLines.length * 6 + 15;

      // 项目信息
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Project Information', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const projectInfo = [
        `Project Type: ${solution.projectType}`,
        `Category: ${solution.category.name}`,
        `Tech Stack: ${solution.techStack.join(', ')}`,
        `Views: ${solution.views}`,
        `Published: ${new Date(solution.publishedAt).toLocaleDateString()}`,
        `Updated: ${new Date(solution.updatedAt).toLocaleDateString()}`
      ];

      projectInfo.forEach(info => {
        const infoLines = pdf.splitTextToSize(info, maxWidth);
        pdf.text(infoLines, margin, yPosition);
        yPosition += infoLines.length * 5 + 2;
      });

      yPosition += 10;

      // 内容标题
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Content', margin, yPosition);
      yPosition += 10;

      // 内容 - 简化处理，移除 Markdown 格式
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      // 简单处理 Markdown 内容，移除格式符号
      const cleanContent = solution.content
        .replace(/#{1,6}\s/g, '') // 移除标题符号
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗体符号
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体符号
        .replace(/`(.*?)`/g, '$1') // 移除代码符号
        .replace(/```[\s\S]*?```/g, '[Code Block]') // 替换代码块
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // 移除链接格式

      const contentLines = pdf.splitTextToSize(cleanContent, maxWidth);

      contentLines.forEach((line: string) => {
        if (yPosition > 270) { // 接近页面底部
          pdf.addPage();
          yPosition = 20;

          // 在新页面添加水印
          pdf.setFontSize(8);
          pdf.setTextColor(200, 200, 200);
          pdf.text('© KnoLib - Knowledge Library', pageWidth - 60, 10);
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
        }

        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });

      // 添加页脚版权信息
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Downloaded from KnoLib - ${window.location.href}`, margin, 285);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 40, 285);
      }

      // 下载 PDF
      pdf.save(`${solution.slug}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      // 如果 PDF 生成失败，回退到文本下载
      const textContent = `${solution.title}\n\n${solution.excerpt}\n\n${solution.content}`;
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${solution.slug}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </Container>
      </div>
    );
  }

  // Show access denied message if category is protected and not verified
  if (accessDenied && !isVerified) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Protected Content
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This content is in a protected category. Please enter the password to access it.
              </p>
              <Link href={`/tech-solutions/${resolvedParams.category}`}>
                <Button variant="outline">
                  Back to Category
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        {showPasswordModal && (
          <CategoryPasswordModal
            categorySlug={resolvedParams.category}
            categoryName={resolvedParams.category}
            onSuccess={handlePasswordSuccess}
            onCancel={handlePasswordCancel}
          />
        )}
      </div>
    );
  }

  if (!solution) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      <Container>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/tech-solutions" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  Tech Solutions
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <Link href={`/tech-solutions/${solution.category.slug}`} className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                  {solution.category.name}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">/</span>
                <span className="text-gray-900 dark:text-white font-medium">{solution.title}</span>
              </div>
            </motion.div>

            {/* Header */}
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Category Badge & Featured Star */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className="text-xs px-2 py-1 text-white"
                    style={{ backgroundColor: solution.category.color }}
                  >
                    {solution.category.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {solution.difficulty}
                  </Badge>
                </div>
                {solution.featured && (
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {solution.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-4xl">
                {solution.excerpt}
              </p>

              {/* Meta Info - Simplified */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Published {new Date(solution.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{solution.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>Updated {new Date(solution.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </motion.section>

            {/* Tags */}
            {solution.tags.length > 0 && (
              <motion.section
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {solution.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-sm px-3 py-1"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Content */}
            <motion.section
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="prose prose-lg dark:prose-invert max-w-4xl
                prose-headings:text-gray-900 dark:prose-headings:text-white
                prose-p:text-gray-700 dark:prose-p:text-gray-300
                prose-p:leading-relaxed
                prose-headings:font-semibold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-16 prose-h1:first:mt-0 prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-700 prose-h1:pb-4
                prose-h2:text-2xl prose-h2:mb-5 prose-h2:mt-14 prose-h2:text-gray-800 dark:prose-h2:text-gray-200
                prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-10 prose-h3:text-gray-700 dark:prose-h3:text-gray-300
                prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-8 prose-h4:font-medium
                prose-h5:text-base prose-h5:mb-2 prose-h5:mt-6 prose-h5:font-medium
                prose-h6:text-sm prose-h6:mb-2 prose-h6:mt-4 prose-h6:font-medium
                prose-p:mb-5 prose-p:mt-0 prose-p:text-base prose-p:leading-7
                prose-li:mb-3 prose-li:leading-7 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:pl-2
                prose-ul:mb-8 prose-ol:mb-8 prose-ul:mt-3 prose-ol:mt-3 prose-ul:space-y-2 prose-ol:space-y-2
                prose-ul:pl-6 prose-ol:pl-6
                prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
                prose-blockquote:mb-8 prose-blockquote:mt-6 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:italic
                prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-medium prose-code:text-gray-800 dark:prose-code:text-gray-200
                prose-pre:mb-8 prose-pre:mt-6 prose-pre:rounded-lg prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-pre:shadow-sm
                prose-table:mb-8 prose-table:mt-6 prose-table:border-collapse prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700
                prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:px-4 prose-th:py-2
                prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
                prose-hr:mb-12 prose-hr:mt-12 prose-hr:border-gray-300 dark:prose-hr:border-gray-600">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgb(249 250 251)',
                            border: 'none',
                            color: 'rgb(55 65 81)', // 深灰色文字
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                          codeTagProps={{
                            style: {
                              color: 'rgb(55 65 81)', // 确保代码文字颜色更深
                              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
                            }
                          }}
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
                    // 自定义段落渲染，为技术栈项目添加特殊样式
                    p({ children, ...props }) {
                      const text = String(children);
                      // 检测是否是技术栈项目（包含 " - " 分隔符）
                      if (text.includes(' - ') && !text.includes('\n') && text.length < 100) {
                        const [tech, description] = text.split(' - ');
                        return (
                          <p className="mb-3 flex items-start gap-3 py-1" {...props}>
                            <span className="font-semibold text-gray-900 dark:text-white min-w-0 flex-shrink-0">
                              {tech}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">-</span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {description}
                            </span>
                          </p>
                        );
                      }
                      return <p {...props}>{children}</p>;
                    },
                    // 自定义标题渲染，跳过重复的 H1 标题
                    h1({ children, ...props }) {
                      const titleText = String(children);
                      // 如果 H1 标题与页面标题相同，则跳过渲染
                      if (titleText === solution.title) {
                        return null;
                      }
                      return (
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-16 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700" {...props}>
                          {children}
                        </h1>
                      );
                    },
                    h2({ children, ...props }) {
                      return (
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-12 mb-6 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3({ children, ...props }) {
                      return (
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-10 mb-4" {...props}>
                          {children}
                        </h3>
                      );
                    },
                  }}
                >
                  {solution.content}
                </ReactMarkdown>
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {/* Compact Info Card */}
              <motion.div
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Quick Actions */}
                <div className="flex gap-2 mb-5">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                {/* Solution Info */}
                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{solution.projectType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <Link href={`/tech-solutions/${solution.category.slug}`}>
                      <Badge
                        className="text-xs text-white hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ backgroundColor: solution.category.color }}
                      >
                        {solution.category.name}
                      </Badge>
                    </Link>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Views:</span>
                    <span className="text-gray-900 dark:text-white font-medium">{solution.views}</span>
                  </div>
                </div>

                {/* Tech Stack Preview */}
                <div className="mb-5">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1">
                    {solution.techStack.slice(0, 4).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                        {tech}
                      </Badge>
                    ))}
                    {solution.techStack.length > 4 && (
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        +{solution.techStack.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Related Solutions */}
                {relatedSolutions.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-5">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      Related Solutions
                    </h4>
                    <div className="space-y-3">
                      {relatedSolutions.slice(0, 3).map((related) => (
                        <Link
                          key={related.id}
                          href={`/tech-solutions/${related.category.slug}/${related.slug}`}
                          className="block group"
                        >
                          <div className="p-3 bg-white dark:bg-gray-700 rounded-lg hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between mb-1">
                              <h5 className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                                {related.title}

                              </h5>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                              {related.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                              <span>{related.views} views</span>
                              <Badge
                                className="text-xs"
                                style={{ backgroundColor: related.category.color, color: 'white' }}
                              >
                                {related.category.name}
                              </Badge>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    {relatedSolutions.length > 3 && (
                      <Link href={`/tech-solutions/${solution.category.slug}`}>
                        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs">
                          View all {relatedSolutions.length} solutions
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Solution Navigation */}
        <SolutionNavigation
          category={solution.category}
          currentSlug={solution.slug}
        />
      </Container>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
