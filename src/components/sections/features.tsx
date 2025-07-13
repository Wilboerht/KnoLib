"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Users,
  Search,
  Award,
  MessageSquare,
  GraduationCap,
  Clock,
  Star
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { AllDocsIcon } from "@/components/ui/all-docs-icon";

const features = [
  {
    icon: AllDocsIcon,
    title: "知识管理",
    description: "实用的个人知识管理工具，利用科学的信息组织方法，将学习与思考的成果系统化整理。",
    color: "blue"
  },
  {
    icon: Search,
    title: "智能知识发现",
    description: "基于AI的智能搜索引擎，快速定位相关知识内容，让知识获取更加高效便捷。",
    color: "purple"
  },
  {
    icon: Users,
    title: "知识协作网络",
    description: "定期与同行交流学习心得，分享实践经验，在知识碰撞中获得新的启发与成长。",
    color: "green"
  },
  {
    icon: Brain,
    title: "个性化学习路径",
    description: "根据个人兴趣和发展方向，制定专属的学习计划，让每一步学习都更有针对性。",
    color: "yellow"
  },
  {
    icon: Award,
    title: "知识贡献激励",
    description: "通过持续的知识输出与分享，不断完善个人知识体系，在帮助他人的同时提升自己。",
    color: "cyan"
  },
  {
    icon: MessageSquare,
    title: "知识问答社区",
    description: "构建开放的学习交流空间，在问答互动中深化理解，让知识在分享中不断增值。",
    color: "pink"
  }
];

const colorClasses = {
  blue: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800",
  purple: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800",
  green: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800",
  yellow: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800",
  cyan: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800",
  pink: "text-slate-900 bg-slate-100 dark:text-white dark:bg-slate-800"
};



export function Features() {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 relative z-20">
      <Container>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            构建个人知识体系
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            全方位的个人知识管理平台，让学习过程中的思考与收获得到有效沉淀，
            助力个人持续学习与成长。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -3 }}
              >
                <div className="h-full p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl border border-white/20 dark:border-slate-700/30 shadow-sm hover:shadow-lg hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colorClasses[feature.color as keyof typeof colorClasses]} mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Stats Section */}
        <motion.div 
          className="mt-20 pt-16 border-t border-gray-200 dark:border-slate-700"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <AllDocsIcon className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">25K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Learning Resources</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <GraduationCap className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">95%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Skill Improvement Rate</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Clock className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Knowledge Access</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <Star className="w-8 h-8 text-slate-900 dark:text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
