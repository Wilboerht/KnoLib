"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, RefreshCw, ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/admin/article-form";
// Article interface for admin management
interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  href: string;
  readTime: number;
  lastUpdated: string;
  author: string;
  description: string;
  content: string;
  featured: boolean;
  tags: string[];
  domain: string;
  published: boolean;
}
import { ArticleAPI } from "@/lib/api/articles";
import Link from "next/link";
import { EditorProtectedRoute } from "@/components/auth/protected-route";

function ArticleAdminPageContent() {

  const [articles, setArticles] = React.useState<any[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<any>(null);

  // Load article data
  const loadArticles = React.useCallback(async () => {
    if (!isDevelopment) return;

    setLoading(true);
    setError(null);

    try {
      const response = await ArticleAPI.getArticles({ published: undefined }); // Get all articles, including unpublished ones

      if (response.success && response.data) {
        setArticles(response.data);

        // Calculate statistics
        const total = response.data.length;
        const published = response.data.filter((a: any) => a.published).length;
        const featured = response.data.filter((a: any) => a.featured).length;
        const byDifficulty = response.data.reduce((acc: any, article: any) => {
          acc[article.difficulty] = (acc[article.difficulty] || 0) + 1;
          return acc;
        }, {});
        const byCategory = response.data.reduce((acc: any, article: any) => {
          const categoryName = article.category?.name || 'Uncategorized';
          acc[categoryName] = (acc[categoryName] || 0) + 1;
          return acc;
        }, {});

        // Calculate real domain statistics
        const byDomain = response.data.reduce((acc: any, article: any) => {
          const domainName = article.domain?.name || 'Uncategorized';
          acc[domainName] = (acc[domainName] || 0) + 1;
          return acc;
        }, {});

        setStats({
          total,
          published,
          featured,
          byDifficulty,
          byCategory,
          byDomain
        });
      } else {
        setError(response.error || 'Failed to load articles');
      }
    } catch (err) {
      setError('Failed to load articles');
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  }, [isDevelopment]);

  React.useEffect(() => {
    loadArticles();
  }, [loadArticles]);



  const handleAddArticle = async (articleData: any) => {
    try {
      // Get default author and domain ID (from existing articles or database)
      let defaultAuthorId = articles[0]?.authorId;
      let defaultDomainId = articles[0]?.domainId;

      // If no articles exist, get the first user and domain from database
      if (!defaultAuthorId || !defaultDomainId) {
        try {
          const [usersResponse, domainsResponse] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/domains')
          ]);

          if (usersResponse.ok && domainsResponse.ok) {
            const usersData = await usersResponse.json();
            const domainsData = await domainsResponse.json();

            if (usersData.success && usersData.data.length > 0) {
              defaultAuthorId = usersData.data[0].id;
            }
            if (domainsData.success && domainsData.data.length > 0) {
              defaultDomainId = domainsData.data[0].id;
            }
          }
        } catch (error) {
          console.error('Failed to fetch default IDs:', error);
        }
      }

      // Fallback to hardcoded values if still not found (use actual IDs from database)
      if (!defaultAuthorId) {
        defaultAuthorId = 'cmfh3hv9d0002iws6npx32a6k'; // Actual user ID from database
      }
      if (!defaultDomainId) {
        defaultDomainId = 'cmfjqyv1k0000giksnky3spjc'; // Actual domain ID from database
      }

      // Find category ID by category name
      let categoryId = undefined;
      if (articleData.category) {
        const category = articles.find(a => a.category?.name === articleData.category)?.category;
        categoryId = category?.id;
      }

      const createData = {
        title: articleData.title,
        slug: articleData.slug,
        excerpt: articleData.description, // Map description to excerpt
        content: articleData.content,
        difficulty: articleData.difficulty?.toUpperCase() || 'BEGINNER',
        readTime: parseInt(articleData.readTime?.replace(/\D/g, '') || '5'),
        featured: articleData.featured || false,
        published: articleData.published ?? true,
        publishedAt: articleData.published ? new Date().toISOString() : undefined,
        authorId: defaultAuthorId,
        domainId: defaultDomainId,
        categoryId: categoryId,
        tags: Array.isArray(articleData.tags) ?
          articleData.tags.map((tag: string) => tag.toLowerCase()) :
          [],
      };

      console.log('Using authorId:', defaultAuthorId);
      console.log('Using domainId:', defaultDomainId);
      console.log('Submitted data:', createData);

      const response = await ArticleAPI.createArticle(createData);

      if (response.success) {
        setShowForm(false);
        setEditingArticle(null);
        await loadArticles(); // Reload article list
        alert('Article added successfully!');
      } else {
        alert(`Failed to add: ${response.error}`);
        console.error('API error:', response);
      }
    } catch (error) {
      console.error('Failed to add article:', error);
      alert('Failed to add article');
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setShowForm(true);
  };

  const handleUpdateArticle = async (articleData: any) => {
    if (!editingArticle) return;

    try {
      const response = await ArticleAPI.updateArticle(editingArticle.slug, articleData);

      if (response.success) {
        setShowForm(false);
        setEditingArticle(null);
        await loadArticles(); // Reload article list
        alert('Article updated successfully!');
      } else {
        alert(`Update failed: ${response.error}`);
      }
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to update article');
    }
  };

  const handleDeleteArticle = async (article: any) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await ArticleAPI.deleteArticle(article.slug);

        if (response.success) {
          await loadArticles(); // Reload article list
          alert('Article deleted successfully!');
        } else {
          alert(`Delete failed: ${response.error}`);
        }
      } catch (error) {
        console.error('Failed to delete article:', error);
        alert('Failed to delete article');
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gray-50 dark:bg-slate-900">
      <Container>
        <div className="py-8">
          {/* Breadcrumb Navigation */}
          <Link href="/admin/knowledge">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Knowledge Management
            </Button>
          </Link>

          {/* Page Title */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Article Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage knowledge base articles (using real database)
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={loadArticles}
                disabled={loading}
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  setEditingArticle(null);
                  setShowForm(true);
                }}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Article
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <div className="text-red-800 dark:text-red-200">
                Error: {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          )}

          {/* Statistics */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">{stats.published}</div>
                <div className="text-gray-600 dark:text-gray-400">Published Articles</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{stats.featured}</div>
                <div className="text-gray-600 dark:text-gray-400">Featured Articles</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-purple-600">
                  {Object.keys(stats.byCategory).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Categories</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(stats.byDomain).length}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Knowledge Domains</div>
              </div>
            </div>
          )}

          {/* Article Form */}
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <ArticleForm
                onSubmit={editingArticle ? handleUpdateArticle : handleAddArticle}
                initialData={editingArticle || undefined}
              />
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingArticle(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Article List */}
          {!showForm && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Article List ({articles.length})
                </h2>
              </div>
              
              {articles.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No articles yet. Click the button above to add your first article.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                  {articles.map((article) => (
                    <div key={article.id} className="p-6 hover:bg-gray-50 dark:hover:bg-slate-700">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {article.excerpt || 'No description'}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{article.category?.name || 'Uncategorized'}</span>
                            <span>•</span>
                            <span>{article.difficulty}</span>
                            <span>•</span>
                            <span>{article.readTime ? `${article.readTime} min read` : 'Not set'}</span>
                            <span>•</span>
                            <span>Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={article.published ? 'text-green-600' : 'text-red-600'}>
                              {article.published ? 'Published' : 'Draft'}
                            </span>
                            {article.featured && (
                              <>
                                <span>•</span>
                                <span className="text-yellow-600 dark:text-yellow-400">Featured</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/knowledge/${article.category?.slug || 'general'}/${article.slug}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditArticle(article)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteArticle(article)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function ArticleAdminPage() {
  return (
    <EditorProtectedRoute>
      <ArticleAdminPageContent />
    </EditorProtectedRoute>
  );
}
