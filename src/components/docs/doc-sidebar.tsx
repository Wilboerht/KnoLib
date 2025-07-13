"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, BookOpen, Users, Code, Settings, Search, MessageSquare, HelpCircle } from "lucide-react";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: "Getting Started",
    icon: BookOpen,
    children: [
      { title: "Introduction", href: "/knowledge/getting-started/introduction" },
      { title: "Quick Start", href: "/knowledge/getting-started/quick-start" },
      { title: "Basic Concepts", href: "/knowledge/getting-started/concepts" },
      { title: "First Steps", href: "/knowledge/getting-started/first-steps" }
    ]
  },
  {
    title: "User Guide",
    icon: Users,
    children: [
      { title: "Dashboard Overview", href: "/knowledge/user-guide/dashboard" },
      { title: "Managing Content", href: "/knowledge/user-guide/content" },
      { title: "Collaboration Features", href: "/knowledge/user-guide/collaboration" },
      { title: "Search & Discovery", href: "/knowledge/user-guide/search" },
      { title: "Notifications", href: "/knowledge/user-guide/notifications" },
      { title: "Profile Settings", href: "/knowledge/user-guide/profile" }
    ]
  },
  {
    title: "Administration",
    icon: Settings,
    children: [
      { title: "User Management", href: "/knowledge/admin/users" },
      { title: "Permissions & Roles", href: "/knowledge/admin/permissions" },
      { title: "System Configuration", href: "/knowledge/admin/config" },
      { title: "Analytics & Reporting", href: "/knowledge/admin/analytics" },
      { title: "Backup & Recovery", href: "/knowledge/admin/backup" },
      { title: "Security Settings", href: "/knowledge/admin/security" }
    ]
  },
  {
    title: "API Reference",
    icon: Code,
    children: [
      { title: "REST API Overview", href: "/knowledge/api/rest" },
      { title: "Authentication", href: "/knowledge/api/auth" },
      { title: "GraphQL API", href: "/knowledge/api/graphql" },
      { title: "Webhooks", href: "/knowledge/api/webhooks" },
      { title: "Rate Limiting", href: "/knowledge/api/rate-limiting" },
      { title: "Error Handling", href: "/knowledge/api/errors" }
    ]
  }
];

interface DocSidebarProps {
  className?: string;
}

export function DocSidebar({ className = "" }: DocSidebarProps) {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    // Auto-expand sections that contain the current page
    const newExpanded = new Set<string>();
    navigation.forEach((section) => {
      if (section.children?.some(child => child.href === pathname)) {
        newExpanded.add(section.title);
      }
    });
    setExpandedSections(newExpanded);
  }, [pathname]);

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className={`w-60 flex-shrink-0 ${className}`}>
      <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto py-6">
        <nav className="space-y-1">
          {navigation.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.has(section.title);
            const hasActiveChild = section.children?.some(child => child.href === pathname);

            return (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    hasActiveChild
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    {Icon && <Icon className="h-4 w-4 mr-2.5" />}
                    <span>{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {isExpanded && section.children && (
                  <div className="mt-1 ml-7 space-y-0.5">
                    {section.children.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href || "#"}
                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                          pathname === item.href
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quick Links - Redesigned */}
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Quick Access
          </h3>
          <div className="space-y-1">
            <Link
              href="/knowledge"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              All Documentation
            </Link>
            <Link
              href="/knowledge/search"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Link>
            <Link
              href="/community"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Community
            </Link>
            <Link
              href="/contact"
              className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-md transition-colors"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
