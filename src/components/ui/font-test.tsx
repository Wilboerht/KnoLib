"use client";

import * as React from "react";

export function FontTest() {
  return (
    <div className="p-8 bg-white dark:bg-slate-900 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">字体测试</h2>
      
      {/* Inter 字体测试 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Inter (默认)</h3>
        <p className="font-sans text-base text-gray-900 dark:text-white">
          The quick brown fox jumps over the lazy dog. 这是Inter字体的测试文本。
        </p>
        <p className="font-sans text-2xl font-bold text-gray-900 dark:text-white mt-2">
          KnoLib - Knowledge Sharing Platform
        </p>
      </div>

      {/* Poppins 字体测试 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Poppins</h3>
        <p className="font-poppins text-base text-gray-900 dark:text-white">
          The quick brown fox jumps over the lazy dog. 这是Poppins字体的测试文本。
        </p>
        <p className="font-poppins text-2xl font-bold text-gray-900 dark:text-white mt-2">
          KnoLib - Knowledge Sharing Platform
        </p>
      </div>

      {/* DingTalk 进步体测试 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">DingTalk 进步体</h3>
        <p className="font-dingtalk-jinbu text-base text-gray-900 dark:text-white">
          The quick brown fox jumps over the lazy dog. 这是钉钉进步体的测试文本。
        </p>
        <p className="font-dingtalk-jinbu text-2xl font-bold text-gray-900 dark:text-white mt-2">
          KnoLib - 企业知识分享平台
        </p>
        <p className="font-dingtalk-jinbu text-4xl font-bold text-blue-600 mt-2">
          钉钉进步体大标题测试
        </p>
      </div>

      {/* DingTalk Sans测试 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">DingTalk Sans</h3>
        <p className="font-dingtalk-sans text-base text-gray-900 dark:text-white">
          The quick brown fox jumps over the lazy dog. 这是DingTalk Sans字体的测试文本。
        </p>
        <p className="font-dingtalk-sans text-2xl font-bold text-gray-900 dark:text-white mt-2">
          KnoLib - 企业知识分享平台
        </p>
        <p className="font-dingtalk-sans text-4xl font-bold text-green-600 mt-2">
          DingTalk Sans大标题测试
        </p>
      </div>

      {/* 中英文混合测试 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">中英文混合测试</h3>
        <div className="space-y-3">
          <p className="font-dingtalk-jinbu text-lg text-gray-900 dark:text-white">
            <span className="font-bold">钉钉进步体：</span>Welcome to KnoLib 欢迎使用知识库平台 2024年最新版本
          </p>
          <p className="font-dingtalk-sans text-lg text-gray-900 dark:text-white">
            <span className="font-bold">DingTalk Sans：</span>Welcome to KnoLib 欢迎使用知识库平台 2024年最新版本
          </p>
        </div>
      </div>
    </div>
  );
}
