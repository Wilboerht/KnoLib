"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconSelector } from "@/components/admin/icon-selector";
import Link from "next/link";

interface FormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isProtected: boolean;
  password: string;
  confirmPassword: string;
}

const colorOptions = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
];

export default function CreateTechCategory() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    order: 0,
    isProtected: false,
    password: "",
    confirmPassword: "",
  });

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }));
    
    // Clear name error when user starts typing
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: "" }));
    }
  };

  const handleSlugChange = (value: string) => {
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
    
    setFormData(prev => ({ ...prev, slug: cleanSlug }));
    
    // Clear slug error when user starts typing
    if (errors.slug) {
      setErrors(prev => ({ ...prev, slug: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Category slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Password validation for protected categories
    if (formData.isProtected) {
      if (!formData.password.trim()) {
        newErrors.password = "Password is required for protected categories";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }

      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = "Please confirm the password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tech-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/tech-solutions/categories');
      } else {
        // Handle server errors
        if (data.error.includes('name already exists')) {
          setErrors({ name: 'Category name already exists' });
        } else if (data.error.includes('slug already exists')) {
          setErrors({ slug: 'Category slug already exists' });
        } else {
          setErrors({ general: data.error });
        }
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({ general: 'Failed to create category. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="py-8">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/admin/tech-solutions/categories">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Categories
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Tech Category
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Add a new category for organizing your tech solutions
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              {/* Category Name */}
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Frontend Solutions"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Category Slug */}
              <div>
                <Label htmlFor="slug">Category Slug *</Label>
                <Input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g., frontend-solutions"
                  className={errors.slug ? "border-red-500" : ""}
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  URL-friendly version of the name. Only lowercase letters, numbers, and hyphens.
                </p>
                {errors.slug && (
                  <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this category..."
                  rows={3}
                />
              </div>

              {/* Icon */}
              <div>
                <Label htmlFor="icon">Icon</Label>
                <IconSelector
                  value={formData.icon}
                  onChange={(iconName) => setFormData(prev => ({ ...prev, icon: iconName }))}
                  disabled={loading}
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Optional. Choose an icon to represent this category.
                </p>
              </div>

              {/* Color */}
              <div>
                <Label>Category Color</Label>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`w-10 h-10 rounded-lg border-2 transition-all ${
                        formData.color === color.value
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-slate-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Order */}
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Lower numbers appear first. Default is 0.
                </p>
              </div>

              {/* Password Protection */}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    id="isProtected"
                    type="checkbox"
                    checked={formData.isProtected}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isProtected: e.target.checked,
                      password: e.target.checked ? prev.password : "",
                      confirmPassword: e.target.checked ? prev.confirmPassword : ""
                    }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="isProtected" className="text-sm font-medium">
                    Password Protected Category
                  </Label>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  When enabled, users will need to enter a password to access solutions in this category.
                </p>

                {formData.isProtected && (
                  <div className="space-y-4 bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                    <div>
                      <Label htmlFor="password">Category Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password for this category"
                        className={errors.password ? "border-red-500" : ""}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirm the password"
                        className={errors.confirmPassword ? "border-red-500" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link href="/admin/tech-solutions/categories">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Category
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
