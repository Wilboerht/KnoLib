/**
 * Tag Management Page
 *
 * Administrators can create, edit, and delete tags here
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Tag as TagIcon, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { TagForm } from "@/components/admin/tag-form";

interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  _count: {
    articles: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TagsManagePage() {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
  const [filteredTags, setFilteredTags] = React.useState<Tag[]>([]);

  // Load tag data
  const loadTags = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tags');
      const result = await response.json();
      
      if (result.success) {
        setTags(result.data);
      } else {
        console.error('Failed to load tags:', result.error);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Search filtering
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchQuery, tags]);

  // Handle successful tag creation/update
  const handleTagSaved = () => {
    setShowForm(false);
    setEditingTag(null);
    loadTags();
  };

  // Handle tag deletion
  const handleDeleteTag = async (tag: Tag) => {
    if (!confirm(`Are you sure you want to delete tag "${tag.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        loadTags();
      } else {
        alert('Delete failed: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to delete tag:', error);
      alert('Delete failed, please try again');
    }
  };

  // Handle tag editing
  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Navigation */}
          <Link href="/admin/knowledge">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Management
            </Button>
          </Link>

          {/* Page Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Tag Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage article tags and organize content classification
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditingTag(null);
                  setShowForm(true);
                }}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Tag
              </Button>
            </div>

            {/* Search Box */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Tag List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : filteredTags.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTags.map((tag, index) => (
                  <motion.div
                    key={tag.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: tag.color || '#6B7280' }}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {tag.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tag._count.articles} articles
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTag(tag)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTag(tag)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {tag.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tag.description}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <TagIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No matching tags found' : 'No tags yet'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchQuery
                    ? `No tags found containing "${searchQuery}"`
                    : 'No tags have been created yet'
                  }
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      setEditingTag(null);
                      setShowForm(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Tag
                  </Button>
                )}
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Tag Form Modal */}
      {showForm && (
        <TagForm
          tag={editingTag}
          onSave={handleTagSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingTag(null);
          }}
        />
      )}
    </div>
  );
}
