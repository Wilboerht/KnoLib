"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { MediaInserter } from "@/components/ui/media-inserter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MediaDemoPage() {
  const [showMediaInserter, setShowMediaInserter] = React.useState(false);
  const [content, setContent] = React.useState(`# 媒体插入功能演示

这是一个演示页面，展示如何在 Markdown 编辑器中插入各种媒体文件。

## 支持的文件类型

### 图片
- JPG, PNG, GIF, WebP, SVG
- 自动显示预览
- 支持 alt 文本

### 视频
- MP4, WebM, OGV, AVI, MOV
- 自动生成 HTML5 video 标签
- 支持控制条

### 音频
- MP3, WAV, OGG, M4A, WebA
- 自动生成 HTML5 audio 标签
- 美观的播放器界面

### 文档
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, MD
- 提供查看和下载按钮
- 文件信息显示

### 压缩文件
- ZIP, RAR, 7Z
- 提供下载功能
- 文件大小显示

点击下方的"插入媒体"按钮来测试功能！
`);

  const handleMediaInsert = (markdown: string) => {
    setContent(prev => prev + '\n\n' + markdown);
    setShowMediaInserter(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="py-8">
          {/* 页面头部 */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回管理后台
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  媒体插入功能演示
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  测试文章编辑器中的媒体插入功能
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 编辑器 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="content">Markdown 编辑器</Label>
                <Button
                  onClick={() => setShowMediaInserter(true)}
                  size="sm"
                >
                  插入媒体
                </Button>
              </div>
              
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="font-mono text-sm"
                placeholder="在这里编写 Markdown 内容..."
              />

                {/* 媒体插入器 */}
                {showMediaInserter && (
                  <MediaInserter
                    uploadedBy="demo-user-id"
                    onInsert={handleMediaInsert}
                    onClose={() => setShowMediaInserter(false)}
                  />
                )}
            </div>

            {/* 预览 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <Label className="mb-4 block">预览效果</Label>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          </div>

          {/* 功能说明 */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              功能特性
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  🖼️ 智能图片处理
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  自动生成响应式图片标签，支持懒加载和 alt 文本
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                  🎥 视频音频支持
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  自动生成 HTML5 媒体标签，提供原生播放控制
                </p>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  📄 文档管理
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  美观的文档卡片，支持在线预览和下载功能
                </p>
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  📁 拖拽上传
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  支持拖拽上传，实时进度显示，批量文件处理
                </p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="font-medium text-red-900 dark:text-red-100 mb-2">
                  🔒 类型验证
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  严格的文件类型和大小验证，确保安全性
                </p>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">
                  🎨 响应式设计
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  完全响应式界面，支持深色模式和移动设备
                </p>
              </div>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              使用说明
            </h2>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <p>点击"插入媒体"按钮打开媒体插入器</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <p>选择"媒体库"查看已上传的文件，或选择"上传文件"上传新文件</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <p>使用文件类型过滤器快速找到需要的文件</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">4</span>
                <p>点击文件的"插入"按钮将其添加到 Markdown 内容中</p>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">5</span>
                <p>系统会自动生成适合的 Markdown 代码，不同文件类型有不同的样式</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
