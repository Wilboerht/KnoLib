"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  FileText,
  Code,
  MessageSquare,
  FolderOpen,
  ArrowLeft,
  // 图标选择器中的所有图标
  Monitor,
  Server,
  Database,
  Cloud,
  Smartphone,
  Globe,
  Briefcase,
  Camera,
  Calculator,
  Palette,
  Music,
  Heart,
  Star,
  Zap,
  Target,
  Trophy,
  Lightbulb,
  Rocket,
  Shield,
  Settings,
  Users,
  Stethoscope,
  GraduationCap,
  Car,
  Plane,
  Home,
  ShoppingCart,
  Utensils,
  Gamepad2,
  GitBranch
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  _count?: { articles: number };
  articles?: Article[];
}

interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  categories?: Category[];
  _count?: { articles: number };
}

// 图标映射函数
const getIconComponent = (iconName: string, defaultIcon: React.ComponentType<any> = Globe) => {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Monitor,
    Server,
    Code,
    Database,
    Cloud,
    Smartphone,
    Globe,
    BookOpen,
    Briefcase,
    Camera,
    Calculator,
    Palette,
    Music,
    Heart,
    Star,
    Zap,
    Target,
    Trophy,
    Lightbulb,
    Rocket,
    Shield,
    Settings,
    Users,
    Stethoscope,
    GraduationCap,
    Car,
    Plane,
    Home,
    ShoppingCart,
    Utensils,
    Gamepad2,
    GitBranch
  };

  return iconMap[iconName] || defaultIcon;
};

export default function KnowledgePage() {
  const searchParams = useSearchParams();
  const domainSlug = searchParams.get('domain');

  const [searchQuery, setSearchQuery] = React.useState("");
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingStep, setLoadingStep] = React.useState<string>('Initializing...');
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState([
    { icon: FileText, label: "Articles", count: "0" },
    { icon: Code, label: "Code Examples", count: "0" },
    { icon: MessageSquare, label: "FAQs", count: "0" }
  ]);

  // Get selected domain based on URL parameter
  const selectedDomain = React.useMemo(() => {
    if (!domainSlug || domains.length === 0) return null;
    return domains.find(d => d.slug === domainSlug) || null;
  }, [domainSlug, domains]);

  // Load data with retry mechanism
  React.useEffect(() => {
    const loadData = async (retryCount = 0) => {
      try {
        setError(null);
        setLoadingStep('Loading domains and articles...');

        // 使用轻量级的域名查询
        const [domainsResponse, articlesResponse] = await Promise.all([
          fetch('/api/domains?light=true'),
          fetch('/api/articles')
        ]);

        setLoadingStep('Processing data...');

        // 检查响应状态
        if (!domainsResponse.ok || !articlesResponse.ok) {
          throw new Error(`HTTP error! domains: ${domainsResponse.status}, articles: ${articlesResponse.status}`);
        }

        const domainsResult = await domainsResponse.json();
        const articlesResult = await articlesResponse.json();

        if (!domainsResult.success) {
          throw new Error(domainsResult.error || 'Failed to load domains');
        }

        if (!articlesResult.success) {
          throw new Error(articlesResult.error || 'Failed to load articles');
        }

        setLoadingStep('Setting up data...');

        // 设置数据
        setDomains(domainsResult.data);
        setArticles(articlesResult.data);

        // Update statistics
        setStats([
          { icon: FileText, label: "Articles", count: articlesResult.data.length.toString() },
          { icon: Code, label: "Code Examples", count: "0" },
          { icon: MessageSquare, label: "FAQs", count: "0" }
        ]);

        setLoadingStep('Complete!');

      } catch (error) {
        console.error('Failed to load data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        // 重试机制：最多重试 2 次
        if (retryCount < 2) {
          console.log(`Retrying... (${retryCount + 1}/2)`);
          setLoadingStep(`Retrying... (${retryCount + 1}/2)`);
          setTimeout(() => loadData(retryCount + 1), 1000 * (retryCount + 1));
          return;
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Convert domains to display format with article information
  const displayDomains = React.useMemo(() => {
    return domains.map(domain => ({
      ...domain,
      categories: domain.categories || [],
      articles: articles.filter(article =>
        domain.categories && domain.categories.some(cat => cat.slug === article.category?.slug)
      )
    }));
  }, [domains, articles]);

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section - Simplified */}
      <section className={`${selectedDomain ? 'py-8' : 'py-12'} bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800`}>
        <Container>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={`text-center ${selectedDomain ? 'mb-6' : 'mb-8'}`}>
              {selectedDomain ? (
                <>
                  {/* Back button */}
                  <div className="mb-4">
                    <Link href="/knowledge">
                      <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Knowledge Base
                      </Button>
                    </Link>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedDomain.name}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                    {selectedDomain.description}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Knowledge Base
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
                    Comprehensive documentation and guides for the KnoLib platform
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    <Link href="/knowledge/all">
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        View All Articles
                      </Button>
                    </Link>
                    <Link href="/knowledge/search">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Stats - Only show on main knowledge page */}
            {!selectedDomain && (
              <>
                {/* Stats - Minimal text display */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Currently hosting <span className="font-medium text-gray-700 dark:text-gray-300">{stats[0]?.count || 0} articles</span>,
                    <span className="font-medium text-gray-700 dark:text-gray-300"> {stats[1]?.count || 0} code examples</span>, and
                    <span className="font-medium text-gray-700 dark:text-gray-300"> {stats[2]?.count || 0} FAQs</span>
                  </p>
                </motion.div>
              </>
            )}
          </motion.div>
        </Container>
      </section>

      {/* Categories Section - Redesigned */}
      <section className={`${selectedDomain ? 'py-6' : 'py-12'}`}>
        <Container>
          {/* Only show section title on main knowledge page */}
          {!selectedDomain && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Browse Documentation
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                Find guides, tutorials, and reference materials organized by category.
              </p>
            </motion.div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white dark:bg-slate-800 transition ease-in-out duration-150">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingStep}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                  Failed to load data
                </h3>
                <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : selectedDomain ? (
            // Show categories of selected domain
            selectedDomain.categories && selectedDomain.categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedDomain.categories.map((category, index) => (
                  <Link key={category.id} href={`/knowledge/${category.slug}`}>
                    <motion.div
                      className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300 h-32 flex flex-col"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div
                          className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ backgroundColor: category.color + '20' }}
                        >
                          {React.createElement(getIconComponent(category.icon || '', FolderOpen), {
                            className: "w-5 h-5",
                            style: { color: category.color }
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {category._count?.articles || 0} articles
                          </p>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 overflow-hidden"
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 2,
                             WebkitBoxOrient: 'vertical',
                             lineHeight: '1.4em',
                             maxHeight: '2.8em'
                           }}>
                          {category.description}
                        </p>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  No Categories Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                  No categories have been created under the {selectedDomain.name} domain yet.
                </p>
              </motion.div>
            )
          ) : displayDomains.length > 0 ? (
            // Show all domains
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayDomains.map((domain, index) => (
                <Link key={domain.id} href={`/knowledge?domain=${domain.slug}`}>
                  <motion.div
                    className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300 h-32 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                        {React.createElement(getIconComponent(domain.icon || '', Globe), {
                          className: "w-5 h-5 text-blue-600 dark:text-blue-400"
                        })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {domain.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {domain._count?.articles || 0} articles • {domain.categories?.length || 0} categories
                        </p>
                      </div>
                    </div>
                    {domain.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 overflow-hidden"
                         style={{
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           lineHeight: '1.4em',
                           maxHeight: '2.8em'
                         }}>
                        {domain.description}
                      </p>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Knowledge Base Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
                We&apos;re currently organizing and refining our knowledge base content. Stay tuned for comprehensive documentation and tutorials.
              </p>
              <Link href="/about">
                <Button variant="outline">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          )}
        </Container>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-gray-50 dark:bg-slate-800">
        <Container>
          <motion.div
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Need Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Can&apos;t find what you&apos;re looking for? Get help from our community or support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/knowledge/search">
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Advanced Search
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Community
                  </Button>
                </Link>

              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
