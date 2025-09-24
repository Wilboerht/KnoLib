"use client";

import { useState, useEffect } from "react";
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
  isActive: boolean;
  isProtected: boolean;
  password: string;
  confirmPassword: string;
}

interface TechCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  isProtected: boolean;
  password?: string;
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTechCategory({ params }: PageProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [category, setCategory] = useState<TechCategory | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    order: 0,
    isActive: true,
    isProtected: false,
    password: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Get category ID from params
  useEffect(() => {
    params.then(({ id }) => {
      setCategoryId(id);
    });
  }, [params]);

  // Load category data
  useEffect(() => {
    if (!categoryId) return;

    const loadCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tech-categories/${categoryId}`);
        const data = await response.json();

        if (data.success) {
          const cat = data.data;
          setCategory(cat);
          setFormData({
            name: cat.name,
            slug: cat.slug,
            description: cat.description || "",
            icon: cat.icon || "",
            color: cat.color || "#3B82F6",
            order: cat.order,
            isActive: cat.isActive,
            isProtected: cat.isProtected || false,
            password: cat.isProtected && cat.password ? "••••••••" : "",
            confirmPassword: cat.isProtected && cat.password ? "••••••••" : "",
          });
        } else {
          setErrors({ general: "Category not found" });
        }
      } catch (error) {
        console.error('Error loading category:', error);
        setErrors({ general: "Failed to load category" });
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleSlugChange = (value: string) => {
    const cleanSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
    
    setFormData(prev => ({ ...prev, slug: cleanSlug }));
    
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
      // Only validate password if it's a new category or user is changing password
      const isExistingPassword = formData.password === "••••••••";

      if (!isExistingPassword) {
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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare data for submission
      const submitData = { ...formData };

      // If password is the placeholder, don't send it (keep existing password)
      if (formData.password === "••••••••") {
        delete submitData.password;
      }

      const response = await fetch(`/api/tech-categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/tech-solutions/categories');
      } else {
        if (data.error.includes('name already exists')) {
          setErrors({ name: 'Category name already exists' });
        } else if (data.error.includes('slug already exists')) {
          setErrors({ slug: 'Category slug already exists' });
        } else {
          setErrors({ general: data.error });
        }
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setErrors({ general: 'Failed to update category. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-300">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Category not found</p>
          <Link href="/admin/tech-solutions/categories">
            <Button>Back to Categories</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              Edit Tech Category
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Update category information and settings
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
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="isActive">Active Category</Label>
              </div>

              {/* Password Protection */}
              <div className="flex items-center space-x-2">
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
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Label htmlFor="isProtected">Password Protected Category</Label>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm -mt-4">
                When enabled, visitors will need to enter a password to view articles in this category
              </p>

              {/* Password Fields - Only show when protection is enabled */}
              {formData.isProtected && (
                <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  {/* Show current password status */}
                  {formData.password === "••••••••" && (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700 dark:text-green-300">
                          Password is currently set
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
                          setIsChangingPassword(true);
                        }}
                        className="text-xs"
                      >
                        Change Password
                      </Button>
                    </div>
                  )}

                  {/* Show password input fields when changing password or no password set */}
                  {formData.password !== "••••••••" && (
                    <>
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

                      {/* Cancel change password option */}
                      {category?.isProtected && category?.password && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, password: "••••••••", confirmPassword: "••••••••" }));
                            setIsChangingPassword(false);
                            setErrors(prev => ({ ...prev, password: "", confirmPassword: "" }));
                          }}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Cancel Password Change
                        </Button>
                      )}
                    </>
                  )}

                  <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 p-3 rounded">
                    <strong>Note:</strong> If you change the password, all users will need to re-enter the new password to access this category.
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link href="/admin/tech-solutions/categories">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
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
