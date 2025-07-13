"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Edit, Share2, BookmarkPlus, Clock, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DocSidebar } from "./doc-sidebar";
import Link from "next/link";

interface DocLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  lastUpdated?: string;
  readTime?: string;
  author?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  tableOfContents?: Array<{ id: string; title: string; level?: number }>;
  previousPage?: { title: string; href: string };
  nextPage?: { title: string; href: string };
  children: React.ReactNode;
}

export function DocLayout({
  title,
  description,
  breadcrumbs,
  lastUpdated,
  readTime,
  author,
  difficulty,
  tableOfContents,
  previousPage,
  nextPage,
  children
}: DocLayoutProps) {
  const [activeSection, setActiveSection] = React.useState<string>("");

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" }
    );

    tableOfContents?.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [tableOfContents]);

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-16 sm:pt-20">
      {/* Breadcrumb Navigation - Simplified */}
      <div className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <Container>
          <div className="py-3">
            <nav className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </Container>
      </div>

      <Container>
        <div className="flex gap-6">
          {/* Sidebar */}
          <DocSidebar className="hidden lg:block" />

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Article Header - More Compact */}
            <motion.div
              className="py-8 border-b border-gray-100 dark:border-slate-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
              </h1>
              {description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  {description}
                </p>
              )}

              {/* Meta Information - Redesigned */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {lastUpdated && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span>Updated {lastUpdated}</span>
                  </div>
                )}
                {readTime && (
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    <span>{readTime}</span>
                  </div>
                )}
                {author && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1.5" />
                    <span>{author}</span>
                  </div>
                )}
                {difficulty && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                )}
              </div>

              {/* Action Buttons - Simplified */}
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </motion.div>

            {/* Article Content - More Compact */}
            <motion.div
              className="py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {children}
            </motion.div>

            {/* Navigation - Enhanced */}
            <motion.div
              className="py-6 border-t border-gray-100 dark:border-slate-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex justify-between items-center">
                {previousPage ? (
                  <Link
                    href={previousPage.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Previous</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {previousPage.title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextPage && (
                  <Link
                    href={nextPage.href}
                    className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group"
                  >
                    <div className="text-right">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Next</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {nextPage.title}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-2 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </Link>
                )}
              </div>
            </motion.div>
          </div>

          {/* Table of Contents Sidebar - Improved */}
          {tableOfContents && tableOfContents.length > 0 && (
            <motion.div
              className="hidden lg:block w-56 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="sticky top-20 sm:top-24 py-8">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  On This Page
                </h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm py-1.5 px-2 rounded transition-colors ${
                        activeSection === item.id
                          ? "text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                      } ${item.level === 2 ? "ml-3" : item.level === 3 ? "ml-6" : ""}`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}
