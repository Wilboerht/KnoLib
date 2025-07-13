"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Heart } from "lucide-react";
import { Container } from "@/components/ui/container";

export function Features() {
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
              为什么创建 KnoLib？
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
                三年前，我发现自己陷入了一个困境：学了很多东西，但总是记不住；
                看了很多文章，但缺乏系统性；有了一些想法，却没有地方好好整理。
              </p>

              <p>
                更重要的是，我意识到一个人的学习是有限的。当我把自己的思考写下来，
                分享给别人时，往往会收到意想不到的反馈和启发。那些看似简单的问题，
                在与他人的交流中变得更加深刻；那些零散的知识点，
                在分享的过程中逐渐形成了体系。
              </p>

              <p>
                我开始相信：<strong>知识因分享而增值，思考因交流而深化</strong>。
                一个封闭的知识库只是个人的备忘录，而一个开放的知识平台
                才能真正发挥知识的价值。
              </p>

              <p>
                于是，KnoLib 诞生了。它不仅是我个人的知识仓库，
                更是一个开放的思考空间，希望每一次分享都能带来新的思考，
                每一次交流都能产生新的价值。
              </p>
            </div>
          </motion.div>

          {/* Key Principles */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">开放分享</h3>
              <p className="text-gray-600 dark:text-gray-300">
                知识因分享而增值，每一次分享都让知识变得更有价值
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">深度交流</h3>
              <p className="text-gray-600 dark:text-gray-300">
                思考因交流而深化，在对话中发现新的思维角度
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">持续成长</h3>
              <p className="text-gray-600 dark:text-gray-300">
                在分享与交流的循环中，实现个人和社区的共同成长
              </p>
            </div>
          </motion.div>

          {/* Personal Touch */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-8">
              <blockquote className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
                "知识因分享而增值，思考因交流而深化。<br />
                这里不是为了展示我知道多少，而是为了与你一起探索未知。"
              </blockquote>
              <cite className="text-gray-500 dark:text-gray-400">— Wilboerht</cite>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
