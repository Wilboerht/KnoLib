/**
 * Article content component
 *
 * Displays the main content of the article, including Markdown rendering
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Download, ExternalLink, FileText, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleContentProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    readTime?: number;
    difficulty?: string;
    tags?: Array<{
      tag: {
        id: string;
        name: string;
        slug: string;
        color?: string;
      };
    }>;
    codeExamples?: Array<{
      id: string;
      language: string;
      code: string;
      description?: string;
      order: number;
    }>;
  };
}

// 格式化文件大小
// const formatFileSize = (url: string): string => {
//   // 这里可以通过 API 获取文件大小，暂时返回空字符串
//   return '';
// };

// 获取文件名
const getFileName = (url: string): string => {
  return url.split('/').pop() || 'file';
};

// 检查是否为媒体文件链接
const isMediaFile = (href: string): boolean => {
  const mediaExtensions = [
    // 图片
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    // 视频
    '.mp4', '.webm', '.ogv', '.avi', '.mov',
    // 音频
    '.mp3', '.wav', '.ogg', '.m4a', '.weba',
    // 文档
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.md',
    // 压缩文件
    '.zip', '.rar', '.7z'
  ];

  return mediaExtensions.some(ext => href.toLowerCase().includes(ext));
};

// 获取文件类型
const getFileType = (href: string): string => {
  const url = href.toLowerCase();
  if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp') || url.includes('.svg')) {
    return 'image';
  }
  if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogv') || url.includes('.avi') || url.includes('.mov')) {
    return 'video';
  }
  if (url.includes('.mp3') || url.includes('.wav') || url.includes('.ogg') || url.includes('.m4a') || url.includes('.weba')) {
    return 'audio';
  }
  if (url.includes('.pdf') || url.includes('.doc') || url.includes('.docx') || url.includes('.xls') || url.includes('.xlsx') || url.includes('.ppt') || url.includes('.pptx') || url.includes('.txt') || url.includes('.md')) {
    return 'document';
  }
  if (url.includes('.zip') || url.includes('.rar') || url.includes('.7z')) {
    return 'archive';
  }
  return 'other';
};

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <motion.article
      className="prose prose-lg dark:prose-invert max-w-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Article title */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </header>

      {/* Article content */}
      <div className="article-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }) {
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
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic mb-4">
                {children}
              </blockquote>
            ),
            img: ({ src, alt, title, ...props }) => {
              if (!src) return null;

              return (
                <div className="my-6">
                  <img
                    src={src}
                    alt={alt || ''}
                    title={title}
                    className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                    loading="lazy"
                    {...props}
                  />
                  {alt && (
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                      {alt}
                    </p>
                  )}
                </div>
              );
            },
            a: ({ href, children }) => {
              if (!href) {
                return <span>{children}</span>;
              }

              // 检查是否为媒体文件
              if (isMediaFile(href)) {
                const fileType = getFileType(href);
                const fileName = getFileName(href);

                // 视频文件
                if (fileType === 'video') {
                  return (
                    <div className="my-6">
                      <video
                        controls
                        className="w-full max-w-4xl mx-auto rounded-lg shadow-md"
                        style={{ maxHeight: '500px' }}
                      >
                        <source src={href} />
                        您的浏览器不支持视频播放。
                      </video>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {children || fileName}
                      </p>
                    </div>
                  );
                }

                // 音频文件
                if (fileType === 'audio') {
                  return (
                    <div className="my-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-lg">🎵</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {children || fileName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">音频文件</p>
                        </div>
                      </div>
                      <audio controls className="w-full">
                        <source src={href} />
                        您的浏览器不支持音频播放。
                      </audio>
                    </div>
                  );
                }

                // 文档文件
                if (fileType === 'document') {
                  return (
                    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {children || fileName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">文档文件</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(href, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            查看
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = href;
                              link.download = fileName;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 压缩文件
                if (fileType === 'archive') {
                  return (
                    <div className="my-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                            <Archive className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {children || fileName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">压缩文件</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = href;
                            link.download = fileName;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          下载
                        </Button>
                      </div>
                    </div>
                  );
                }
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
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Code examples */}
      {article.codeExamples && article.codeExamples.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Code Examples
          </h2>
          <div className="space-y-6">
            {article.codeExamples
              .sort((a, b) => a.order - b.order)
              .map((example) => (
                <div
                  key={example.id}
                  className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6"
                >
                  {example.description && (
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {example.description}
                    </p>
                  )}
                  <SyntaxHighlighter
                    language={example.language}
                    style={oneDark}
                    className="rounded-lg"
                  >
                    {example.code}
                  </SyntaxHighlighter>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map(({ tag }) => (
              <span
                key={tag.id}
                className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                style={tag.color ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </motion.article>
  );
}
