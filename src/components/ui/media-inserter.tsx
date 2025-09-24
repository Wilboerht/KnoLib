/**
 * 媒体插入组件
 * 
 * 提供文件选择、上传、插入到 Markdown 的功能，支持不同文件类型的样式
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Video,
  Music,
  FileText,
  Grid,
  List,
  X,
  Plus,
  Copy,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 媒体文件接口
interface MediaFile {
  id: string;
  filename: string;
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
  uploader: {
    id: string;
    name: string;
    email: string;
  };
}

// 组件属性接口
interface MediaInserterProps {
  uploadedBy: string;
  onInsert: (markdown: string) => void;
  onClose: () => void;
  className?: string;
}

// 文件类型过滤器
const FILE_FILTERS = [
  { key: 'all', label: '全部', icon: Grid },
  { key: 'image', label: '图片', icon: Image },
  { key: 'video', label: '视频', icon: Video },
  { key: 'audio', label: '音频', icon: Music },
  { key: 'document', label: '文档', icon: FileText },
];

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 生成 Markdown 代码
const generateMarkdown = (file: MediaFile): string => {
  const { filename, url, mimeType, width, height } = file;
  
  if (mimeType.startsWith('image/')) {
    // 图片
    const sizeAttr = width && height ? ` width="${width}" height="${height}"` : '';
    return `![${filename}](${url}${sizeAttr})`;
  } else if (mimeType.startsWith('video/')) {
    // 视频
    return `<video controls width="100%" style="max-width: 800px;">
  <source src="${url}" type="${mimeType}">
  您的浏览器不支持视频播放。
</video>`;
  } else if (mimeType.startsWith('audio/')) {
    // 音频
    return `<audio controls>
  <source src="${url}" type="${mimeType}">
  您的浏览器不支持音频播放。
</audio>`;
  } else {
    // 其他文件（文档、压缩包等）
    return `[📎 ${filename}](${url})`;
  }
};

export function MediaInserter({ uploadedBy, onInsert, onClose }: MediaInserterProps) {
  const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // 加载媒体文件
  const loadMediaFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        uploadedBy,
        limit: '100',
      });
      
      if (selectedFilter !== 'all') {
        params.append('category', selectedFilter);
      }

      const response = await fetch(`/api/upload?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setMediaFiles(result.data.mediaFiles || []);
      }
    } catch (error) {
      console.error('加载媒体文件失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  React.useEffect(() => {
    loadMediaFiles();
  }, [selectedFilter, uploadedBy]);

  // 过滤媒体文件
  const filteredFiles = React.useMemo(() => {
    return mediaFiles.filter(file => 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mediaFiles, searchTerm]);

  // 处理文件上传完成
  const handleUploadComplete = (files: MediaFile[]) => {
    setMediaFiles(prev => [...files, ...prev]);
  };

  // 插入媒体文件
  const handleInsert = (file: MediaFile) => {
    const markdown = generateMarkdown(file);
    onInsert(markdown);
  };

  // 复制链接
  const handleCopyLink = async (file: MediaFile) => {
    try {
      await navigator.clipboard.writeText(file.url);
      // 这里可以添加一个 toast 提示
    } catch (error) {
      console.error('复制链接失败:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-4xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          插入媒体文件
        </h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 内容 */}
      <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
        <Tabs defaultValue="library" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library">媒体库</TabsTrigger>
            <TabsTrigger value="upload">上传文件</TabsTrigger>
          </TabsList>

          {/* 媒体库 */}
          <TabsContent value="library" className="space-y-4">
            {/* 搜索和过滤 */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="搜索文件..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {/* 文件类型过滤 */}
                <div className="flex items-center space-x-1">
                  {FILE_FILTERS.map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <Button
                        key={filter.key}
                        variant={selectedFilter === filter.key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.key)}
                      >
                        <Icon className="h-4 w-4 mr-1" />
                        {filter.label}
                      </Button>
                    );
                  })}
                </div>

                {/* 视图模式切换 */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* 文件列表 */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {searchTerm ? '没有找到匹配的文件' : '暂无媒体文件'}
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-3 gap-4">
                  {filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {/* 文件预览 */}
                      <div className="aspect-square mb-2 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center overflow-hidden">
                        {file.mimeType.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {file.mimeType.startsWith('video/') && <Video className="h-8 w-8" />}
                            {file.mimeType.startsWith('audio/') && <Music className="h-8 w-8" />}
                            {!file.mimeType.startsWith('video/') && !file.mimeType.startsWith('audio/') && <FileText className="h-8 w-8" />}
                          </div>
                        )}
                      </div>

                      {/* 文件信息 */}
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </p>

                      {/* 操作按钮 */}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleInsert(file)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          插入
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(file)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      {/* 文件图标 */}
                      <div className="flex-shrink-0">
                        {file.mimeType.startsWith('image/') ? (
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                            {file.mimeType.startsWith('video/') && <Video className="h-5 w-5 text-gray-400" />}
                            {file.mimeType.startsWith('audio/') && <Music className="h-5 w-5 text-gray-400" />}
                            {!file.mimeType.startsWith('video/') && !file.mimeType.startsWith('audio/') && <FileText className="h-5 w-5 text-gray-400" />}
                          </div>
                        )}
                      </div>

                      {/* 文件信息 */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleInsert(file)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          插入
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyLink(file)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* 上传文件 */}
          <TabsContent value="upload">
            <FileUpload
              uploadedBy={uploadedBy}
              onUploadComplete={handleUploadComplete}
              maxFiles={5}
            />
          </TabsContent>
        </Tabs>
        </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
