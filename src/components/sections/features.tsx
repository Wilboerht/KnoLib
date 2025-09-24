"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Code,
  // 图标选择器中的所有图标
  Monitor,
  Server,
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
} from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";

interface TechCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  isActive: boolean;
  _count: { solutions: number };
}

interface Domain {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  categories: Category[];
  _count: { articles: number };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  _count: { articles: number };
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

export function Features() {
  const [domains, setDomains] = React.useState<Domain[]>([]);
  const [techCategories, setTechCategories] = React.useState<TechCategory[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [techCategoriesLoading, setTechCategoriesLoading] = React.useState(true);
  const [selectedDomain, setSelectedDomain] = React.useState<string>("");

  // Load domain and category data
  React.useEffect(() => {
    const loadDomains = async () => {
      try {
        const response = await fetch('/api/domains');
        const result = await response.json();

        if (result.success) {
          setDomains(result.data);
          if (result.data.length > 0) {
            setSelectedDomain(result.data[0].name);
          }
        }
      } catch (error) {
        console.error('Failed to load domain data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, []);

  // Load tech categories data
  React.useEffect(() => {
    const loadTechCategories = async () => {
      try {
        const response = await fetch('/api/tech-categories?isActive=true');
        const result = await response.json();

        if (result.success) {
          setTechCategories(result.data);
        }
      } catch (error) {
        console.error('Failed to load tech categories:', error);
      } finally {
        setTechCategoriesLoading(false);
      }
    };

    loadTechCategories();
  }, []);

  // Get all categories under the selected domain
  const filteredCategories = React.useMemo(() => {
    const domain = domains.find(d => d.name === selectedDomain);
    return domain?.categories || [];
  }, [domains, selectedDomain]);

  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative z-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Story Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-dingtalk-jinbu font-light text-gray-900 dark:text-white mb-6">
              Why Create KnoLib?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </motion.div>

          {/* Story Content */}
          <motion.div
            className="prose prose-lg dark:prose-invert max-w-none"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
              <p>
                Three years ago, I found myself in a dilemma: I learned many things but could never remember them;
                I read countless articles but lacked systematic organization; I had ideas but nowhere to properly organize them.
              </p>

              <p>
                More importantly, I realized that individual learning has its limits. When I wrote down my thoughts
                and shared them with others, I often received unexpected feedback and inspiration. Those seemingly simple questions
                became more profound through exchanges with others; those scattered knowledge points
                gradually formed a system through the process of sharing.
              </p>

              <p>
                I began to believe: <strong>Knowledge gains value through sharing, thinking deepens through exchange</strong>.
                A closed knowledge base is just a personal memo, while an open knowledge platform
                can truly unleash the value of knowledge.
              </p>

              <p>
                Thus, KnoLib was born. It is not only my personal knowledge repository,
                but also an open space for thinking, hoping that every sharing brings new thoughts,
                and every exchange creates new value.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Knowledge Domains Section */}
      <Container>
        <motion.div
          className="max-w-6xl mx-auto mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h2 className="text-3xl font-dingtalk-jinbu font-light text-gray-900 dark:text-white mb-6 drop-shadow-sm">
              Knowledge Domains
            </h2>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
              </div>
            ) : domains.length > 0 ? (
              <div className="flex flex-wrap items-center gap-4">
                {domains.map((domain) => {
                  const isSelected = selectedDomain === domain.name;

                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => setSelectedDomain(domain.name)}
                      className={`relative flex items-center space-x-2 px-3 py-3 text-sm transition-all duration-200 ${
                        isSelected
                          ? "text-gray-900 dark:text-white font-semibold"
                          : "text-gray-600 dark:text-gray-400 font-medium hover:text-gray-800 dark:hover:text-gray-200"
                      }`}
                    >
                      {React.createElement(getIconComponent(domain.icon || '', Globe), {
                        className: "w-4 h-4"
                      })}
                      <span>{domain.name}</span>
                      <span className="text-xs text-gray-500">({domain._count.articles})</span>
                      {/* Bottom border for selected state */}
                      {isSelected && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white"
                          layoutId="activeTab"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No domain data available</p>
              </div>
            )}
          </div>

          {domains.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Knowledge Domains Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Knowledge domains will be displayed here when content is available.
              </p>
            </motion.div>
          ) : filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((category, index) => (
                <Link key={category.id} href={`/knowledge/${category.slug}`}>
                  <motion.div
                    className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-lg"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {React.createElement(getIconComponent(category.icon || '', FolderOpen), {
                          className: "w-5 h-5",
                          style: { color: category.color }
                        })}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category._count.articles} articles
                        </p>
                      </div>
                    </div>
                    {category.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {category.description}
                      </p>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Content Available
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                No content available in the &quot;{selectedDomain}&quot; domain yet. Stay tuned!
              </p>
            </motion.div>
          )}
        </motion.div>
      </Container>

      {/* Technical Solutions Section */}
      <Container>
        <motion.div
          id="technical-solutions"
          className="max-w-6xl mx-auto mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-12">
            <h2 className="text-3xl font-dingtalk-jinbu font-light text-gray-900 dark:text-white mb-6 drop-shadow-sm">
              Technical Solutions
            </h2>
          </div>

          {techCategoriesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Loading technical solutions...</p>
            </div>
          ) : techCategories.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              <div className="space-y-2">
                {techCategories.map((category, index) => (
                  <Link key={category.id} href={`/tech-solutions/${category.slug}`}>
                    <motion.div
                      className="group flex items-center py-3 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      whileHover={{ x: 2 }}
                    >
                      {/* Icon */}
                      <div
                        className="w-8 h-8 flex items-center justify-center rounded-md mr-3 flex-shrink-0"
                        style={{
                          backgroundColor: category.color ? `${category.color}20` : '#3B82F620'
                        }}
                      >
                        <Code
                          className="w-4 h-4"
                          style={{
                            color: category.color || '#3B82F6'
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {category.name}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 flex-shrink-0">
                            {category._count.solutions} solution{category._count.solutions !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {category.description && (
                          <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="ml-3 flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Code className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Technical Solutions Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Technical solution categories will be displayed here when available.
              </p>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
