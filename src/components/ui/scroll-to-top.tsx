"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  // 监听滚动事件
  React.useEffect(() => {
    const toggleVisibility = () => {
      // 当页面滚动超过 300px 时显示按钮
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // 滚动到顶部的函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Pure Liquid Glass Button - No Background */}
          <button
            onClick={scrollToTop}
            className="relative h-12 w-12 rounded-full backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-white/30 dark:hover:border-white/15 hover:scale-105 active:scale-95"
            aria-label="Scroll to top"
          >
            {/* Subtle inner highlight */}
            <div className="absolute inset-[1px] rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className="relative z-10 flex items-center justify-center h-full w-full">
              <ArrowUp className="h-5 w-5 text-gray-700 dark:text-gray-200 transition-colors duration-300" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
