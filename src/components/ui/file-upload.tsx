/**
 * 文件上传组件
 * 
 * 支持拖拽上传、进度显示、文件预览等功能
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, File, Image, Video, Music, Archive, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// 文件类型图标映射
const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Video;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return Archive;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation') || mimeType.startsWith('text/')) return FileText;
  return File;
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// 文件上传项接口
interface FileUploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  result?: any;
}

// 组件属性接口
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // 字节
  maxFiles?: number;
  uploadedBy: string;
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export function FileUpload({
  accept = "*/*",
  multiple = true,
  maxSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 10,
  uploadedBy,
  onUploadComplete,
  onUploadError,
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [uploadItems, setUploadItems] = React.useState<FileUploadItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // 处理文件选择
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    
    // 检查文件数量限制
    if (uploadItems.length + fileArray.length > maxFiles) {
      onUploadError?.(`最多只能上传 ${maxFiles} 个文件`);
      return;
    }

    // 检查文件大小
    const oversizedFiles = fileArray.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      onUploadError?.(`文件大小不能超过 ${formatFileSize(maxSize)}`);
      return;
    }

    // 创建上传项
    const newItems: FileUploadItem[] = fileArray.map(file => ({
      id: Math.random().toString(36).substring(2),
      file,
      status: 'idle',
      progress: 0,
    }));

    setUploadItems(prev => [...prev, ...newItems]);

    // 开始上传
    newItems.forEach(item => uploadFile(item));
  };

  // 上传文件
  const uploadFile = async (item: FileUploadItem) => {
    setUploadItems(prev => 
      prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i)
    );

    try {
      const formData = new FormData();
      formData.append('file', item.file);
      formData.append('uploadedBy', uploadedBy);

      const xhr = new XMLHttpRequest();

      // 监听上传进度
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadItems(prev => 
            prev.map(i => i.id === item.id ? { ...i, progress } : i)
          );
        }
      });

      // 处理上传完成
      xhr.addEventListener('load', () => {
        if (xhr.status === 201) {
          const result = JSON.parse(xhr.responseText);
          setUploadItems(prev => 
            prev.map(i => i.id === item.id ? { 
              ...i, 
              status: 'success', 
              progress: 100,
              result: result.data 
            } : i)
          );
        } else {
          const error = JSON.parse(xhr.responseText);
          setUploadItems(prev => 
            prev.map(i => i.id === item.id ? { 
              ...i, 
              status: 'error', 
              error: error.error || '上传失败' 
            } : i)
          );
        }
      });

      // 处理上传错误
      xhr.addEventListener('error', () => {
        setUploadItems(prev => 
          prev.map(i => i.id === item.id ? { 
            ...i, 
            status: 'error', 
            error: '网络错误' 
          } : i)
        );
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);

    } catch (error) {
      setUploadItems(prev => 
        prev.map(i => i.id === item.id ? { 
          ...i, 
          status: 'error', 
          error: error instanceof Error ? error.message : '上传失败' 
        } : i)
      );
    }
  };

  // 移除上传项
  const removeItem = (id: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== id));
  };

  // 清空所有项
  const clearAll = () => {
    setUploadItems([]);
  };

  // 获取成功上传的文件
  const getSuccessfulUploads = () => {
    return uploadItems
      .filter(item => item.status === 'success')
      .map(item => item.result);
  };

  // 监听上传完成
  React.useEffect(() => {
    const successfulUploads = getSuccessfulUploads();
    if (successfulUploads.length > 0 && uploadItems.every(item => item.status !== 'uploading')) {
      onUploadComplete?.(successfulUploads);
    }
  }, [uploadItems]);

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上传区域 */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          拖拽文件到这里或点击上传
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          支持图片、文档、视频、音频等多种格式，最大 {formatFileSize(maxSize)}
        </p>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          选择文件
        </Button>
      </div>

      {/* 上传列表 */}
      <AnimatePresence>
        {uploadItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                上传文件 ({uploadItems.length})
              </h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearAll}
              >
                清空
              </Button>
            </div>

            {uploadItems.map((item) => {
              const FileIcon = getFileIcon(item.file.type);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.file.size)}
                    </p>
                    
                    {item.status === 'uploading' && (
                      <Progress value={item.progress} className="mt-2" />
                    )}
                    
                    {item.status === 'error' && (
                      <p className="text-xs text-red-500 mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {item.error}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {item.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    
                    {item.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
