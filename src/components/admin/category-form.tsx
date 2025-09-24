/**
 * Category creation/editing form component
 */

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSelector } from "./icon-selector";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  _count: {
    articles: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Domain {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFormProps {
  category?: Category | null;
  domainId: string;
  domains: Domain[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Preset color options
const COLOR_OPTIONS = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
];

export function CategoryForm({
  category,
  domainId,
  domains,
  isOpen,
  onClose,
  onSuccess
}: CategoryFormProps) {
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    order: 0,
    domainId: domainId,
  });
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted before rendering portal
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Cleanup effect to reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setErrors({});
    }
  }, [isOpen]);

  // Update form when category data changes
  React.useEffect(() => {
    if (!isOpen) return; // Only update when modal is actually open

    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        color: category.color || '#3B82F6',
        order: category.order || 0,
        domainId: domainId,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6',
        order: 0,
        domainId: domainId,
      });
    }
    setErrors({});
  }, [category, domainId, isOpen]);

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Category name cannot be empty';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    }

    if (!formData.domainId) {
      newErrors.domainId = 'Please select a domain';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.order < 0) {
      newErrors.order = 'Sort order cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || loading) {
      return;
    }

    setLoading(true);

    try {
      const url = category ? `/api/categories/${category.id}` : '/api/categories';
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          icon: formData.icon.trim() || undefined,
          color: formData.color,
          order: formData.order,
          domainId: formData.domainId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Use setTimeout to ensure DOM updates are processed
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 0);
      } else {
        if (response.status === 409) {
          setErrors({ name: 'Category name already exists, please use a different name' });
        } else {
          setErrors({ submit: result.error || 'Operation failed, please try again' });
        }
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      setErrors({ submit: 'Network error, please try again' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!mounted) return null;

  const selectedDomain = domains.find(d => d.id === formData.domainId);

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="category-form-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            key="category-form-modal"
            className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
        {/* Form Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {category ? 'Edit Category' : 'New Category'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Domain <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.domainId}
              onChange={(e) => handleInputChange('domainId', e.target.value)}
              disabled={loading}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white ${
                errors.domainId ? 'border-red-500' : ''
              }`}
            >
              <option value="">Select a domain</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
            {errors.domainId && (
              <p className="text-red-500 text-sm mt-1">{errors.domainId}</p>
            )}
            {selectedDomain && (
              <p className="text-gray-500 text-xs mt-1">
                Category will be created under "{selectedDomain.name}" domain
              </p>
            )}
          </div>

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Frontend Development"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Category Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of this category..."
              rows={3}
              disabled={loading}
              className={`w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:text-white resize-none ${
                errors.description ? 'border-red-500' : ''
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Category Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Icon (Optional)
            </label>
            <IconSelector
              value={formData.icon}
              onChange={(iconName) => handleInputChange('icon', iconName)}
              disabled={loading}
            />
            <p className="text-gray-500 text-xs mt-1">
              Choose an icon to represent this category
            </p>
          </div>

          {/* Category Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange('color', color.value)}
                  disabled={loading}
                  className={`w-full h-10 rounded-md border-2 transition-all ${
                    formData.color === color.value
                      ? 'border-gray-900 dark:border-white scale-105'
                      : 'border-gray-300 dark:border-slate-600 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Selected color: {COLOR_OPTIONS.find(c => c.value === formData.color)?.name}
            </p>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sort Order
            </label>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
              placeholder="0"
              min="0"
              disabled={loading}
              className={errors.order ? 'border-red-500' : ''}
            />
            {errors.order && (
              <p className="text-red-500 text-sm mt-1">{errors.order}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Lower numbers appear first
            </p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {category ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {category ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>
          </div>
        </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
