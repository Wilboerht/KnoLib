"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 sm:pt-20">
      {/* Hero Section - Minimal */}
      <section className="relative min-h-[60vh] flex items-center justify-center">
        <Container className="relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-dingtalk-jinbu font-light text-black dark:text-white">
              Learn better, explore further.
            </h1>
          </motion.div>
        </Container>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <Container>
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-dingtalk-jinbu font-light text-gray-900 dark:text-white mb-6">
              KnoLib
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              If you&apos;re interested in the content here, or have any questions and suggestions, feel free to reach out for discussion.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
