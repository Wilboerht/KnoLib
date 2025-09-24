"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Eye,
  Copy,
  RefreshCw,
  ArrowLeft,
  Image,
  Video,
  Music,
  FileText,
  Archive
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
import Link from "next/link";

// Media file interface
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

// File type filters
const FILE_FILTERS = [
  { key: 'all', label: 'All', icon: Grid, count: 0 },
  { key: 'image', label: 'Images', icon: Image, count: 0 },
  { key: 'video', label: 'Videos', icon: Video, count: 0 },
  { key: 'audio', label: 'Audio', icon: Music, count: 0 },
  { key: 'document', label: 'Documents', icon: FileText, count: 0 },
  { key: 'archive', label: 'Archives', icon: Archive, count: 0 },
];

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file type
const getFileCategory = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet') || mimeType.includes('presentation') || mimeType.includes('text')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return 'archive';
  return 'other';
};

export default function MediaManagementPage() {
  const [mediaFiles, setMediaFiles] = React.useState<MediaFile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState("all");
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const [showUpload, setShowUpload] = React.useState(false);

  // Load media files
  const loadMediaFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        uploadedBy: 'default-user-id', // TODO: Get real user ID from auth system
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
      console.error('Failed to load media files:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  React.useEffect(() => {
    loadMediaFiles();
  }, [selectedFilter]);

  // Filter media files
  const filteredFiles = React.useMemo(() => {
    return mediaFiles.filter(file => 
      file.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mediaFiles, searchTerm]);

  // Calculate file type statistics
  const fileStats = React.useMemo(() => {
    const stats = { all: mediaFiles.length, image: 0, video: 0, audio: 0, document: 0, archive: 0, other: 0 };
    mediaFiles.forEach(file => {
      const category = getFileCategory(file.mimeType);
      stats[category as keyof typeof stats]++;
    });
    return stats;
  }, [mediaFiles]);

  // Handle file upload completion
  const handleUploadComplete = (files: MediaFile[]) => {
    setMediaFiles(prev => [...files, ...prev]);
    setShowUpload(false);
  };

  // Delete file
  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const response = await fetch(`/api/upload/${fileId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => file.id !== fileId));
        setSelectedFiles(prev => prev.filter(id => id !== fileId));
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  // Batch delete files
  const handleBatchDelete = async () => {
    if (selectedFiles.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} selected files?`)) return;
    
    try {
      await Promise.all(
        selectedFiles.map(fileId => 
          fetch(`/api/upload/${fileId}`, { method: 'DELETE' })
        )
      );
      
      setMediaFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    } catch (error) {
      console.error('Failed to batch delete files:', error);
    }
  };

  // Copy link
  const handleCopyLink = async (file: MediaFile) => {
    try {
      await navigator.clipboard.writeText(file.url);
      // TODO: Add toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Download file
  const handleDownloadFile = (file: MediaFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.filename;
    link.click();
  };

  // Toggle file selection
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Media Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage uploaded media files
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={loadMediaFiles}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {FILE_FILTERS.map((filter) => {
              const Icon = filter.icon;
              const count = fileStats[filter.key as keyof typeof fileStats] || 0;
              
              return (
                <motion.div
                  key={filter.key}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedFilter === filter.key
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedFilter(filter.key)}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${
                      selectedFilter === filter.key 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {filter.label}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {count}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {selectedFiles.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBatchDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedFiles.length})
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>

          {/* File List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No matching files found' : 'No media files yet'}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="absolute top-2 left-2 z-10"
                    />

                    {/* File Preview */}
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

                    {/* File Info */}
                    <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, '_blank')}
                        className="text-white hover:bg-white/20"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(file)}
                        className="text-white hover:bg-white/20"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadFile(file)}
                        className="text-white hover:bg-white/20"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFile(file.id)}
                        className="text-white hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                    />

                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {file.mimeType.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          {file.mimeType.startsWith('video/') && <Video className="h-6 w-6 text-gray-400" />}
                          {file.mimeType.startsWith('audio/') && <Music className="h-6 w-6 text-gray-400" />}
                          {!file.mimeType.startsWith('video/') && !file.mimeType.startsWith('audio/') && <FileText className="h-6 w-6 text-gray-400" />}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()} • {file.uploader.name}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(file)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDownloadFile(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Upload File Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Upload Files
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                    ×
                  </Button>
                </div>
                
                <FileUpload
                  uploadedBy="default-user-id" // TODO: Get real user ID from auth system
                  onUploadComplete={handleUploadComplete}
                  maxFiles={10}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
