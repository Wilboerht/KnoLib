"use client";

import * as React from "react";
import { DocLayout } from "@/components/docs/doc-layout";
import { CheckCircle, AlertCircle, Play } from "lucide-react";

const breadcrumbs = [
  { label: "Knowledge Base", href: "/knowledge" },
  { label: "Getting Started", href: "/knowledge/getting-started" },
  { label: "Quick Start", href: "/knowledge/getting-started/quick-start" }
];

const tableOfContents = [
  { id: "prerequisites", title: "Prerequisites" },
  { id: "platform-access", title: "Platform Access" },
  { id: "first-workspace", title: "Create Your First Workspace" },
  { id: "invite-team", title: "Invite Team Members" },
  { id: "create-content", title: "Create Your First Content" },
  { id: "organize-content", title: "Organize Your Content" },
  { id: "next-steps", title: "Next Steps" }
];

export default function QuickStartPage() {
  return (
    <DocLayout
      title="Quick Start Guide"
      description="Get up and running with KnoLib in just a few minutes. This guide will walk you through the essential steps to set up your knowledge base."
      breadcrumbs={breadcrumbs}
      lastUpdated="December 15, 2024"
      readTime="8 min read"
      author="KnoLib Team"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
      previousPage={{ title: "Introduction to KnoLib", href: "/knowledge/getting-started/introduction" }}
      nextPage={{ title: "Basic Concepts", href: "/knowledge/getting-started/concepts" }}
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* Prerequisites */}
        <section id="prerequisites" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prerequisites
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Before you begin, make sure you have the following:
          </p>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">A valid email address for account creation</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">Admin permissions for your organization (if setting up for a team)</span>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">A modern web browser (Chrome, Firefox, Safari, or Edge)</span>
            </div>
          </div>
        </section>

        {/* Platform Access */}
        <section id="platform-access" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Access
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Let&apos;s start by accessing the KnoLib platform:
          </p>
          
          <div className="space-y-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Access KnoLib
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Start exploring KnoLib's knowledge base and resources directly through the platform.
              </p>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <code className="text-sm text-gray-800 dark:text-gray-200">
                  https://knolib.com/knowledge
                </code>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Verify Your Email
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Check your email inbox for a verification link and click it to activate your account.
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Complete Your Profile
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Fill in your basic information including your name, role, and organization details.
              </p>
            </div>
          </div>
        </section>

        {/* First Workspace */}
        <section id="first-workspace" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your First Workspace
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Workspaces are the foundation of your knowledge organization in KnoLib. They act as 
            containers for your content and team collaboration.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Pro Tip
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  Start with a workspace that reflects your main use case - whether it&apos;s documentation,
                  team knowledge, or project resources. You can always create additional workspaces later.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Step 1:</strong> Click the &quot;Create Workspace&quot; button in your dashboard
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Step 2:</strong> Choose a descriptive name (e.g., &quot;Engineering Docs&quot;, &quot;Company Wiki&quot;)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  <strong>Step 3:</strong> Set the visibility (Private, Team, or Organization-wide)
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Play className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-gray-600 dark:text-gray-300">
                  <strong>Step 4:</strong> Add a description to help others understand the workspace purpose
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Invite Team */}
        <section id="invite-team" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Invite Team Members
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Knowledge sharing is most effective when your entire team is involved. Here&apos;s how to
            invite team members to your workspace:
          </p>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invitation Methods
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">📧 Email Invitations</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Send direct email invitations with custom messages and role assignments.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔗 Invite Links</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Generate shareable links for easy team onboarding.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">📋 Bulk Import</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Upload a CSV file to invite multiple team members at once.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Create Content */}
        <section id="create-content" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your First Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Now let&apos;s create your first piece of content. KnoLib supports various content types
            to match your team&apos;s needs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📄 Articles</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Rich text documents with formatting, images, and embedded content.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📋 Guides</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Step-by-step tutorials and how-to documentation.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">❓ FAQs</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Question and answer format for common inquiries.
              </p>
            </div>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Resources</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                File attachments, links, and reference materials.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              🚀 Quick Start Suggestion
            </h3>
            <p className="text-yellow-800 dark:text-yellow-200">
              Create a &quot;Welcome&quot; article as your first piece of content. This can serve as an
              introduction to your workspace and help new team members get oriented.
            </p>
          </div>
        </section>

        {/* Organize Content */}
        <section id="organize-content" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Organize Your Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Good organization is key to making your knowledge base discoverable and useful. 
            KnoLib provides several ways to structure your content:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🏷️ Categories and Tags
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                Use categories for broad topics and tags for specific themes or keywords.
              </p>
              <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Example:</strong> Category: &quot;Development&quot; | Tags: &quot;API&quot;, &quot;Authentication&quot;, &quot;Best Practices&quot;
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                📁 Collections
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Group related articles into collections for easy navigation and discovery.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🔗 Cross-References
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Link related articles together to create a web of interconnected knowledge.
              </p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section id="next-steps" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Next Steps
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Congratulations! You&apos;ve successfully set up your KnoLib workspace and created your
            first content. Here&apos;s what to explore next:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/knowledge/getting-started/concepts" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Basic Concepts</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn the fundamental concepts and terminology used in KnoLib.
              </p>
            </a>
            <a href="/knowledge/user-guide/dashboard" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Dashboard Overview</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Get familiar with the KnoLib dashboard and its features.
              </p>
            </a>
            <a href="/knowledge/user-guide/collaboration" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Collaboration Features</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Discover how to collaborate effectively with your team.
              </p>
            </a>
            <a href="/knowledge/admin/users" className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">User Management</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn how to manage users and permissions in your workspace.
              </p>
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
