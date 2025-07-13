"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Search, BookOpen, Users, Zap, FileText, Code, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories = [
  {
    title: "Getting Started",
    description: "Essential guides for new users",
    icon: Zap,
    count: 12,
    articles: [
      { title: "Introduction to KnoLib", href: "/knowledge/getting-started/introduction" },
      { title: "Quick Start Guide", href: "/knowledge/getting-started/quick-start" },
      { title: "Basic Concepts", href: "/knowledge/getting-started/concepts" },
      { title: "Installation & Setup", href: "/knowledge/getting-started/installation" },
      { title: "First Project", href: "/knowledge/getting-started/first-project" },
      { title: "Configuration", href: "/knowledge/getting-started/configuration" },
      { title: "Troubleshooting", href: "/knowledge/getting-started/troubleshooting" },
      { title: "Best Practices", href: "/knowledge/getting-started/best-practices" }
    ]
  },
  {
    title: "User Guide",
    description: "Comprehensive user documentation",
    icon: BookOpen,
    count: 28,
    articles: [
      { title: "Dashboard Overview", href: "/knowledge/user-guide/dashboard" },
      { title: "Managing Content", href: "/knowledge/user-guide/content" },
      { title: "Creating Articles", href: "/knowledge/user-guide/creating-articles" },
      { title: "Organizing Content", href: "/knowledge/user-guide/organizing" },
      { title: "Collaboration Features", href: "/knowledge/user-guide/collaboration" },
      { title: "Search & Discovery", href: "/knowledge/user-guide/search" },
      { title: "Comments & Reviews", href: "/knowledge/user-guide/comments" },
      { title: "Notifications", href: "/knowledge/user-guide/notifications" },
      { title: "Profile Settings", href: "/knowledge/user-guide/profile" },
      { title: "Workspace Management", href: "/knowledge/user-guide/workspaces" }
    ]
  },
  {
    title: "Administration",
    description: "System administration guides",
    icon: Users,
    count: 18,
    articles: [
      { title: "User Management", href: "/knowledge/admin/users" },
      { title: "Permissions & Roles", href: "/knowledge/admin/permissions" },
      { title: "System Configuration", href: "/knowledge/admin/config" },
      { title: "Analytics & Reporting", href: "/knowledge/admin/analytics" },
      { title: "Backup & Recovery", href: "/knowledge/admin/backup" },
      { title: "Security Settings", href: "/knowledge/admin/security" },
      { title: "Integration Management", href: "/knowledge/admin/integrations" },
      { title: "Performance Monitoring", href: "/knowledge/admin/monitoring" }
    ]
  },
  {
    title: "API Reference",
    description: "Technical documentation and APIs",
    icon: Code,
    count: 24,
    articles: [
      { title: "REST API Overview", href: "/knowledge/api/rest" },
      { title: "Authentication", href: "/knowledge/api/auth" },
      { title: "GraphQL API", href: "/knowledge/api/graphql" },
      { title: "Webhooks", href: "/knowledge/api/webhooks" },
      { title: "Rate Limiting", href: "/knowledge/api/rate-limiting" },
      { title: "Error Handling", href: "/knowledge/api/errors" },
      { title: "SDKs & Libraries", href: "/knowledge/api/sdks" },
      { title: "API Examples", href: "/knowledge/api/examples" }
    ]
  },
  {
    title: "Tutorials",
    description: "Step-by-step tutorials",
    icon: BookOpen,
    count: 15,
    articles: [
      { title: "Building Your First Knowledge Base", href: "/knowledge/tutorials/first-kb" },
      { title: "Setting Up Team Collaboration", href: "/knowledge/tutorials/team-setup" },
      { title: "Advanced Search Techniques", href: "/knowledge/tutorials/advanced-search" },
      { title: "Custom Integrations", href: "/knowledge/tutorials/integrations" },
      { title: "Content Migration", href: "/knowledge/tutorials/migration" },
      { title: "Performance Optimization", href: "/knowledge/tutorials/optimization" }
    ]
  },
  {
    title: "FAQ",
    description: "Frequently asked questions",
    icon: MessageSquare,
    count: 35,
    articles: [
      { title: "General Questions", href: "/knowledge/faq/general" },
      { title: "Account & Billing", href: "/knowledge/faq/billing" },
      { title: "Technical Issues", href: "/knowledge/faq/technical" },
      { title: "Security & Privacy", href: "/knowledge/faq/security" },
      { title: "Integration Questions", href: "/knowledge/faq/integrations" },
      { title: "Performance & Limits", href: "/knowledge/faq/performance" }
    ]
  }
];

const stats = [
  { icon: FileText, label: "Articles", count: "132" },
  { icon: Code, label: "Code Examples", count: "45" },
  { icon: MessageSquare, label: "FAQs", count: "35" },
  { icon: Users, label: "Contributors", count: "12" }
];

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section - Simplified */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <Container>
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Knowledge Base
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
                Comprehensive documentation and guides for the KnoLib platform
              </p>
              <Link href="/knowledge/all">
                <Button variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View All Articles
                </Button>
              </Link>
            </div>

            {/* Search Bar - Enhanced */}
            <motion.div
              className="relative max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
                  spellCheck={false}
                  autoComplete="off"
                  suppressHydrationWarning
                />
                <Button
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  Search
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Categories Section - Redesigned */}
      <section className="py-12">
        <Container>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-slate-600 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg mr-3">
                        <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {category.count} articles
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>

                  <div className="space-y-1 mb-4">
                    {category.articles.slice(0, 6).map((article) => (
                      <Link
                        key={article.title}
                        href={article.href}
                        className="block p-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group"
                      >
                        <div className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </div>
                      </Link>
                    ))}
                    {category.articles.length > 6 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{category.articles.length - 6} more articles
                      </div>
                    )}
                  </div>

                  <Link href={`/knowledge/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View All ({category.count})
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
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
                <Link href="/contact">
                  <Button>
                    Contact Support
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
