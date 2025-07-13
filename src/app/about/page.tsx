"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, Share2, Lightbulb } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "知识文章", value: "200+" },
  { label: "学习笔记", value: "500+" },
  { label: "技术分享", value: "100+" },
  { label: "持续更新", value: "3年+" },
];

const values = [
  {
    icon: BookOpen,
    title: "知识沉淀",
    description: "将学习过程中的思考和总结记录下来，形成系统化的知识体系。"
  },
  {
    icon: Share2,
    title: "开放分享",
    description: "相信知识的价值在于分享，希望我的经验能对他人有所帮助。"
  },
  {
    icon: Lightbulb,
    title: "持续学习",
    description: "保持对新技术和新知识的好奇心，不断充实和更新知识库。"
  },
  {
    icon: Heart,
    title: "用心整理",
    description: "每一篇文章都经过仔细思考和整理，力求内容的准确性和实用性。"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50/80 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm">
        <Container>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              我的个人
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                知识分享库
              </span>
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              这里记录着我在学习和工作中的思考与总结，希望这些知识能够帮助到有需要的人。
              每一篇文章都是我用心整理的学习成果。
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
        <Container>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-slate-700/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                关于我
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  我是一名热爱学习和分享的技术爱好者，在软件开发、数据分析和人工智能等领域
                  有着浓厚的兴趣。这个知识库记录了我在学习过程中的思考和总结。
                </p>
                <p>
                  从最初的学习笔记到现在的系统化知识整理，这里承载着我的成长轨迹。
                  我相信知识的价值在于分享，希望我的经验能够帮助到其他学习者。
                </p>
                <p>
                  无论是技术教程、学习心得还是项目经验，我都会用心整理并持续更新，
                  让这个知识库成为一个有价值的学习资源。
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl p-8 text-white">
                <div className="h-full flex flex-col justify-center">
                  <div className="text-6xl font-bold mb-4">2021</div>
                  <div className="text-xl">开始系统化整理和分享知识</div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              我的理念
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              这些核心理念指导着我整理和分享知识的方式，也是我持续学习和成长的动力。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-slate-900 dark:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Knowledge Areas Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800">
        <Container>
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              知识领域
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              这里涵盖了我在学习和工作中涉及的主要技术领域和知识方向。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "前端开发", desc: "React、Vue、TypeScript 等现代前端技术" },
              { title: "后端开发", desc: "Node.js、Python、数据库设计与优化" },
              { title: "数据分析", desc: "数据处理、可视化、机器学习基础" },
              { title: "工具使用", desc: "开发工具、部署流程、效率提升" },
              { title: "学习方法", desc: "技术学习心得、问题解决思路" },
              { title: "项目经验", desc: "实际项目开发中的经验总结" }
            ].map((area, index) => (
              <motion.div
                key={area.title}
                className="text-center p-6 bg-white dark:bg-slate-700 rounded-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {area.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <Container>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              一起学习交流
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              如果你对这里的内容感兴趣，或者有任何问题和建议，欢迎与我交流讨论。
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              联系我
            </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
