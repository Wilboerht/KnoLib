"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import Link from "next/link";

interface FormData {
  title: string;
  slug: string;
  content: string;
  summary: string;
  categoryId: string;
  techStack: string[];
  projectType: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  published: boolean;
}

interface TechCategory {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

const difficultyOptions = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

const commonTechStack = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring',
  'C#', '.NET', 'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Vercel', 'Netlify', 'Firebase',
  'GraphQL', 'REST API', 'WebSocket', 'Microservices', 'Serverless'
];

export default function CreateTechSolution() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<TechCategory[]>([]);
  const [newTech, setNewTech] = useState("");
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    content: "",
    summary: "",
    categoryId: "",
    techStack: [],
    projectType: "",
    difficulty: "INTERMEDIATE",
    published: false,
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch('/api/tech-categories');
        const data = await response.json();

        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }));
    
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

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

  const addTechStack = (tech: string) => {
    if (tech && !formData.techStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech]
      }));
    }
  };

  const removeTechStack = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleAddNewTech = () => {
    if (newTech.trim()) {
      addTechStack(newTech.trim());
      setNewTech("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Solution title is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Solution slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Solution content is required";
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
      const response = await fetch('/api/tech-solutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/tech-solutions/solutions');
      } else {
        if (data.error.includes('slug already exists')) {
          setErrors({ slug: 'Solution slug already exists' });
        } else {
          setErrors({ general: data.error });
        }
      }
    } catch (error) {
      console.error('Error creating solution:', error);
      setErrors({ general: 'Failed to create solution. Please try again.' });
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
              <Link href="/admin/tech-solutions/solutions">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Solutions
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Tech Solution
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Add a new technical solution to your knowledge base
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

              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Solution Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., React State Management with Zustand"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <Label htmlFor="slug">Solution Slug *</Label>
                  <Input
                    id="slug"
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="e.g., react-state-management-zustand"
                    className={errors.slug ? "border-red-500" : ""}
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Brief summary of the solution..."
                  rows={3}
                />
              </div>

              {/* Content */}
              <div>
                <Label htmlFor="content">Content (Markdown) *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write your solution content in Markdown format..."
                  rows={15}
                  className={errors.content ? "border-red-500" : ""}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Use Markdown syntax for formatting. Supports code blocks, headers, lists, etc.
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  {categoriesLoading ? (
                    <div className="flex items-center space-x-2 p-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-500">Loading categories...</span>
                    </div>
                  ) : (
                    <select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    {difficultyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Type */}
                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Input
                    id="projectType"
                    type="text"
                    value={formData.projectType}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                    placeholder="e.g., Web App, Mobile App, API"
                  />
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <Label>Tech Stack</Label>
                
                {/* Selected Tech Stack */}
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechStack(tech)}
                          className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Common Tech Stack */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Common technologies:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonTechStack.filter(tech => !formData.techStack.includes(tech)).slice(0, 12).map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => addTechStack(tech)}
                        className="px-3 py-1 text-sm border border-gray-300 dark:border-slate-600 rounded-full hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Tech */}
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add custom technology..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTech())}
                  />
                  <Button type="button" onClick={handleAddNewTech} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    id="published"
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="published">Publish Immediately</Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link href="/admin/tech-solutions/solutions">
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
                      Create Solution
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
