"use client";

import * as React from "react";
import { DocLayout } from "@/components/docs/doc-layout";
import { BookOpen, Users, Zap, Shield, Clock, Globe } from "lucide-react";

const breadcrumbs = [
  { label: "Knowledge Base", href: "/knowledge" },
  { label: "Getting Started", href: "/knowledge/getting-started" },
  { label: "Introduction to KnoLib", href: "/knowledge/getting-started/introduction" }
];

const tableOfContents = [
  { id: "overview", title: "Overview" },
  { id: "key-features", title: "Key Features" },
  { id: "who-should-use", title: "Who Should Use KnoLib" },
  { id: "getting-started", title: "Getting Started" }
];

const features = [
  {
    icon: BookOpen,
    title: "Knowledge Management",
    description: "Centralize and organize your personal knowledge in one accessible platform."
  },
  {
    icon: Users,
    title: "Knowledge Sharing",
    description: "Share your insights and learn from others with easy publishing features."
  },
  {
    icon: Zap,
    title: "Smart Search",
    description: "Find information instantly with AI-powered search and content discovery."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Keep your knowledge safe with privacy controls and secure access."
  },
  {
    icon: Clock,
    title: "Version Control",
    description: "Track changes and maintain document history with built-in version control."
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Access your knowledge base from anywhere with cloud-based infrastructure."
  }
];

export default function IntroductionPage() {
  return (
    <DocLayout
      title="Introduction to KnoLib"
      description="Welcome to KnoLib, your comprehensive personal knowledge sharing platform. Learn about our core features and how to get started."
      breadcrumbs={breadcrumbs}
      lastUpdated="December 15, 2024"
      readTime="10 min read"
      author="Wilboerht"
      difficulty="Beginner"
      tableOfContents={tableOfContents}
      nextPage={{ title: "Quick Start Guide", href: "/knowledge/getting-started/quick-start" }}
    >
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section id="overview" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            What is KnoLib?
          </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                KnoLib is a personal knowledge sharing platform designed to help individuals
                centralize, organize, and share their learning journey. It combines the power of
                modern tools with intelligent search capabilities to create a comprehensive
                personal knowledge ecosystem.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Whether you&apos;re documenting learning notes, sharing insights, or building a comprehensive
                knowledge base, KnoLib provides the tools and infrastructure to make knowledge sharing
                seamless and effective.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  💡 Key Insight
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  KnoLib transforms scattered information into organized, searchable, and actionable knowledge 
                  that drives better decision-making across your organization.
                </p>
              </div>
            </section>

        <section id="key-features" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Key Features
          </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center mb-3">
                        <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

        <section id="who-should-use" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Who Should Use KnoLib
          </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                KnoLib is designed for individuals who want to improve their personal knowledge
                management and learning processes:
              </p>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>学习者:</strong> 希望系统化整理学习笔记和知识的个人</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>知识工作者:</strong> 需要管理大量信息和文档的专业人士</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>内容创作者:</strong> 希望分享知识和经验的博主、作者</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span><strong>终身学习者:</strong> 持续学习和成长的个人</span>
                </li>
              </ul>
            </section>

        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Getting Started
          </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready to begin your KnoLib journey? Here&apos;s what you need to do:
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Explore the Knowledge Base</h3>
                    <p className="text-gray-600 dark:text-gray-300">Start browsing our comprehensive knowledge base and documentation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Learn the Basics</h3>
                    <p className="text-gray-600 dark:text-gray-300">Understand core concepts and how to navigate the platform effectively</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Start Creating Content</h3>
                    <p className="text-gray-600 dark:text-gray-300">Begin building your knowledge base with articles, guides, and documentation</p>
                  </div>
                </div>
              </div>
            </section>
      </div>
    </DocLayout>
  );
}
