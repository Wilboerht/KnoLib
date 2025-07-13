"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const benefits = [
  "Free access to knowledge base",
  "No registration required",
  "24/7 learning support",
  "Expert-curated content"
];

export function CTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-700 relative overflow-hidden z-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

      {/* Floating Elements */}
      <div className="absolute top-16 left-8 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      <div className="absolute bottom-16 right-8 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-400/20 rounded-full blur-lg" />

      <Container className="relative">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Ready to accelerate your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
              learning journey?
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 text-base leading-7 text-blue-100 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join thousands of professionals who trust our platform to enhance their
            skills, share knowledge, and drive career growth.
          </motion.p>

          {/* Benefits */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-center space-x-1.5 text-blue-100"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="default"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-4 w-4 text-blue-700 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              variant="outline"
              size="default"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
            >
              Browse Knowledge Base
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-16 pt-8 border-t border-white/20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-blue-200 text-sm mb-6">Join the learning community</p>

            {/* Learning Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {[
                { label: "Articles", count: "200+" },
                { label: "Topics", count: "50+" },
                { label: "Updates", count: "Weekly" },
                { label: "Access", count: "Free" }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center"
                >
                  <div className="text-white/80 text-lg font-semibold">{stat.count}</div>
                  <div className="text-white/60 text-xs font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Status Badge */}
          <motion.div
            className="mt-8 inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-medium">Always Learning</span>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
