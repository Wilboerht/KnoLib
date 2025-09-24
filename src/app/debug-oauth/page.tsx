'use client';

import { useEffect, useState } from 'react';

export default function DebugOAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const getDebugInfo = async () => {
      try {
        // 获取 NextAuth 配置信息
        const response = await fetch('/api/auth/providers');
        const providers = await response.json();
        
        const info = {
          currentUrl: window.location.origin,
          expectedRedirectUri: `${window.location.origin}/api/auth/callback/google`,
          nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
          providers: providers,
          timestamp: new Date().toISOString()
        };
        
        setDebugInfo(info);
      } catch (error) {
        console.error('获取调试信息失败:', error);
      }
    };

    getDebugInfo();
  }, []);

  if (!debugInfo) {
    return <div className="p-8">加载调试信息...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth 调试信息</h1>
      
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            🔧 Google OAuth 配置要求
          </h2>
          <div className="text-sm text-yellow-700 space-y-2">
            <p><strong>重定向 URI 必须在 Google Cloud Console 中配置：</strong></p>
            <code className="block bg-yellow-100 p-2 rounded text-xs">
              {debugInfo.expectedRedirectUri}
            </code>
            <p className="mt-2">
              请确保在 Google Cloud Console 的 OAuth 2.0 客户端配置中添加了上述重定向 URI。
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">
            📋 当前配置信息
          </h2>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>当前域名：</strong> {debugInfo.currentUrl}</p>
            <p><strong>NextAuth URL：</strong> {debugInfo.nextAuthUrl}</p>
            <p><strong>生成时间：</strong> {debugInfo.timestamp}</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            🔍 可用的 OAuth 提供商
          </h2>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(debugInfo.providers, null, 2)}
          </pre>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ 常见问题排查
          </h2>
          <div className="text-sm text-red-700 space-y-2">
            <p><strong>1. 重定向 URI 不匹配：</strong></p>
            <p>确保 Google Cloud Console 中配置的重定向 URI 与上面显示的完全一致。</p>
            
            <p><strong>2. Client ID 或 Client Secret 错误：</strong></p>
            <p>检查数据库中保存的 Google OAuth 凭据是否正确。</p>
            
            <p><strong>3. Google+ API 未启用：</strong></p>
            <p>在 Google Cloud Console 中启用 Google+ API 或 People API。</p>
            
            <p><strong>4. 域名验证：</strong></p>
            <p>确保在 Google Cloud Console 中验证了您的域名。</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-800 mb-2">
            ✅ 下一步操作
          </h2>
          <div className="text-sm text-green-700 space-y-2">
            <p>1. 复制上面的重定向 URI</p>
            <p>2. 前往 <a href="https://console.cloud.google.com/apis/credentials" target="_blank" className="underline">Google Cloud Console</a></p>
            <p>3. 选择您的 OAuth 2.0 客户端</p>
            <p>4. 在"已获授权的重定向 URI"中添加复制的 URI</p>
            <p>5. 保存配置并等待几分钟生效</p>
            <p>6. 重新测试 Google 登录</p>
          </div>
        </div>
      </div>
    </div>
  );
}
