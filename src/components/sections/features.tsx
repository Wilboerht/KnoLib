"use client";

import * as React from "react";
import { motion } from "framer-motion";

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



          {/* Personal Philosophy */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative inline-block">
              {/* Subtle background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/10 dark:to-purple-950/10 rounded-2xl transform rotate-1"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-slate-700/50 rounded-2xl px-8 py-6">
                <div className="text-3xl text-blue-300 dark:text-blue-700 mb-2">&ldquo;</div>
                <blockquote className="text-xl font-dingtalk-jinbu font-light text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                  知识因分享而增值
                  <span className="block text-gray-600 dark:text-gray-400">思考因交流而深化</span>
                </blockquote>
                <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-3"></div>
                <cite className="text-sm text-gray-500 dark:text-gray-500 font-medium">Wilboerht</cite>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
