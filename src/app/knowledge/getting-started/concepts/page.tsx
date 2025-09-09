"use client";

import * as React from "react";
import { DocLayout } from "@/components/docs/doc-layout";
import { Folder, Users, FileText, Tag, Search, Lock } from "lucide-react";

const breadcrumbs = [
  { label: "Knowledge Base", href: "/knowledge" },
  { label: "Getting Started", href: "/knowledge/getting-started" },
  { label: "Basic Concepts", href: "/knowledge/getting-started/concepts" }
];

const tableOfContents = [
  { id: "workspaces", title: "Workspaces" },
  { id: "content-types", title: "Content Types" },
  { id: "organization", title: "Organization & Structure" },
  { id: "collaboration", title: "Collaboration" },
  { id: "permissions", title: "Permissions & Access" },
  { id: "search-discovery", title: "Search & Discovery" }
];

const concepts: any[] = [];

export default function ConceptsPage() {
  return (
    <DocLayout
      title="Basic Concepts"
      description="Learn the fundamental concepts and terminology used throughout KnoLib. Understanding these concepts will help you make the most of the platform."
      breadcrumbs={breadcrumbs}
      lastUpdated="December 15, 2024"
      readTime="12 min read"
      author="KnoLib Team"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
      previousPage={{ title: "Quick Start Guide", href: "/knowledge/getting-started/quick-start" }}
      nextPage={{ title: "First Steps", href: "/knowledge/getting-started/first-steps" }}
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Before diving into using KnoLib, it&apos;s important to understand the core concepts that form
          the foundation of the platform. This guide will introduce you to the key terminology and
          concepts you&apos;ll encounter throughout your KnoLib journey.
        </p>

        {/* Concepts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {concepts.map((concept) => {
            const Icon = concept.icon;
            return (
              <div key={concept.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {concept.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {concept.description}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {concept.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Detailed Sections */}
        <section id="workspaces" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Workspaces
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Workspaces are the top-level containers in KnoLib that organize your knowledge and team collaboration. 
            Think of them as separate environments where different teams, projects, or departments can manage 
            their knowledge independently.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Workspace Types
            </h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">🔒 Private Workspaces</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Only you can access and manage the content. Perfect for personal knowledge management.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">👥 Team Workspaces</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Shared with specific team members. Ideal for project documentation and team collaboration.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200">🏢 Organization Workspaces</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Accessible to all organization members. Great for company-wide policies and procedures.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="content-types" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Content Types
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            KnoLib supports various content types to accommodate different ways of organizing and presenting information. 
            Each type is optimized for specific use cases and content structures.
          </p>

          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📄 Articles
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Rich text documents that support formatting, images, videos, and embedded content. 
                Perfect for detailed explanations, documentation, and knowledge sharing.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Best for:</strong> Documentation, tutorials, explanations, announcements
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📋 Guides
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Step-by-step instructions and procedures with structured formatting. 
                Includes checklists, numbered steps, and progress tracking.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Best for:</strong> Procedures, workflows, training materials, onboarding
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ❓ FAQs
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Question and answer format optimized for addressing common inquiries. 
                Supports categorization and search optimization.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Best for:</strong> Support documentation, troubleshooting, common questions
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📊 Resources
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Collections of files, links, and reference materials. 
                Supports file attachments, external links, and metadata.
              </p>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                <strong>Best for:</strong> File libraries, link collections, reference materials
              </div>
            </div>
          </div>
        </section>

        <section id="organization" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Organization & Structure
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            KnoLib provides multiple ways to organize and structure your content, making it easy to find 
            and discover relevant information. You can use these organizational tools individually or 
            combine them for maximum effectiveness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                🏷️ Categories & Tags
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Categories provide broad topic-based groupings, while tags offer specific keywords 
                for cross-referencing and detailed classification.
              </p>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Example:</strong><br />
                  Category: &quot;Development&quot;<br />
                  Tags: &quot;API&quot;, &quot;Authentication&quot;, &quot;Best Practices&quot;
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📁 Collections
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Curated groups of related content that can span multiple categories. 
                Perfect for creating learning paths or project-specific documentation.
              </p>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Example:</strong><br />
                  &quot;New Employee Onboarding&quot;<br />
                  &quot;API Integration Guide&quot;
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="collaboration" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Collaboration
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            KnoLib is designed for team collaboration, providing features that enable multiple people 
            to contribute to and maintain your knowledge base effectively.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Multiple team members can edit the same document simultaneously, with changes 
                  synchronized in real-time and conflict resolution built-in.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Comments & Discussions
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Add comments to specific sections of content, start discussions, and 
                  collaborate on improvements without cluttering the main content.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                <Search className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Review Workflows
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Set up approval processes for content publication, ensuring quality 
                  and accuracy before information goes live.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="permissions" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Permissions & Access
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            KnoLib provides granular access control to ensure that sensitive information is protected 
            while enabling appropriate collaboration and knowledge sharing.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
              🔐 Security Principle
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200">
              KnoLib follows the principle of least privilege - users are granted the minimum 
              level of access required to perform their job functions effectively.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Permission Levels
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">👁️ View</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Read-only access to content. Can view and search but cannot modify.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">✏️ Edit</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Can modify existing content and create new content within assigned areas.
                </p>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">👑 Admin</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Full control including user management, permissions, and workspace settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="search-discovery" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Search & Discovery
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Finding the right information quickly is crucial for effective knowledge management. 
            KnoLib provides powerful search and discovery features to help users locate relevant content.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔍 Search Capabilities
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>Full-text search:</strong> Search across all content including text, titles, and metadata</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>Faceted search:</strong> Filter results by content type, category, author, and date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>Advanced queries:</strong> Use operators and filters for precise search results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>Saved searches:</strong> Save frequently used search queries for quick access</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🤖 AI-Powered Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                KnoLib uses artificial intelligence to help users discover relevant content and make connections 
                between related information.
              </p>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                  <span><strong>Content recommendations:</strong> Suggested articles based on reading history and interests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                  <span><strong>Related content:</strong> Automatically identified connections between articles</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                  <span><strong>Smart categorization:</strong> AI-assisted tagging and categorization suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Summary */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🎯 Key Takeaways
          </h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Workspaces organize your knowledge and control access levels</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Different content types serve different purposes and use cases</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Multiple organizational tools help structure and categorize content</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Collaboration features enable effective team knowledge sharing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Granular permissions ensure security while enabling collaboration</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 dark:text-blue-400 mr-2">✓</span>
              <span>Powerful search and AI-driven discovery help find relevant information</span>
            </li>
          </ul>
        </div>
      </div>
    </DocLayout>
  );
}
