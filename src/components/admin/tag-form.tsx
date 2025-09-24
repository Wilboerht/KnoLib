/**
 * Tag Form Component
 * 
 * Form component for creating and editing tags
 */

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, Loader2 } from "lucide-react";

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

interface TagFormProps {
  tag?: Tag | null;
  onSave: () => void;
  onCancel: () => void;
}

// Predefined color options
const COLOR_OPTIONS = [
  '#EF4444', // red
  '#F97316', // orange
  '#F59E0B', // amber
  '#EAB308', // yellow
  '#84CC16', // lime
  '#22C55E', // green
  '#10B981', // emerald
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#EC4899', // pink
  '#F43F5E', // rose
  '#6B7280', // gray
  '#374151', // gray-700
];

export function TagForm({ tag, onSave, onCancel }: TagFormProps) {
  const [formData, setFormData] = React.useState({
    name: tag?.name || '',
    description: tag?.description || '',
    color: tag?.color || COLOR_OPTIONS[0],
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tag name cannot be empty';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Tag name cannot exceed 50 characters';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = tag ? `/api/tags/${tag.id}` : '/api/tags';
      const method = tag ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        onSave();
      } else {
        setErrors({ submit: result.error || 'Operation failed' });
      }
    } catch (error) {
      console.error('Submission failed:', error);
      setErrors({ submit: 'Network error, please try again' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for corresponding field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {tag ? 'Edit Tag' : 'New Tag'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tag Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Tag Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter tag name"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter tag description (optional)"
              rows={3}
              disabled={loading}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <Label>Tag Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-gray-300 dark:border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleInputChange('color', color)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formData.name || 'Tag Name'}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {tag ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {tag ? 'Update Tag' : 'Create Tag'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
