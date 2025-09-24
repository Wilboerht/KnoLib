'use client';

import { useState, useEffect } from 'react';
import { OAuthButton } from '@/components/auth/oauth-button';

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color?: string;
}

export default function TestOAuthPage() {
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch('/api/auth/providers');
        const data = await response.json();
        console.log('获取到的提供商数据:', data);
        
        if (data.success) {
          setProviders(data.data);
        }
      } catch (error) {
        console.error('获取提供商失败:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  if (loading) {
    return <div className="p-8">加载中...</div>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">OAuth 测试页面</h1>
      
      <div className="space-y-4">
        {providers.map((provider) => (
          <div key={provider.id}>
            <h3 className="text-lg font-medium mb-2">{provider.displayName}</h3>
            <OAuthButton provider={provider} callbackUrl="/" />

            {/* 添加一个简单的测试按钮 */}
            <button
              onClick={() => {
                console.log('简单测试按钮被点击:', provider.name);
                alert(`测试按钮点击: ${provider.displayName}`);
              }}
              className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              测试按钮
            </button>

            {/* 添加一个直接的 OAuth 测试按钮 */}
            <button
              onClick={async () => {
                console.log('=== 直接 OAuth 测试 ===');
                console.log('Provider:', provider);
                try {
                  const { signIn } = await import('next-auth/react');
                  console.log('开始调用 signIn...');

                  // 尝试不同的调用方式
                  console.log('方式1: signIn(provider.name, options)');
                  const result1 = await signIn(provider.name, {
                    callbackUrl: '/',
                    redirect: false
                  });
                  console.log('方式1结果:', result1);

                  // 如果方式1失败，尝试直接重定向
                  if (!result1 || result1.error) {
                    console.log('方式2: 直接重定向到 signin 页面');
                    window.location.href = `/api/auth/signin/${provider.name}?callbackUrl=${encodeURIComponent('/')}`;
                  }
                } catch (error) {
                  console.error('signIn 错误:', error);
                }
              }}
              className="ml-4 px-4 py-2 bg-green-500 text-white rounded"
            >
              直接OAuth测试
            </button>
          </div>
        ))}
      </div>
      
      {providers.length === 0 && (
        <p className="text-gray-500">没有找到可用的 OAuth 提供商</p>
      )}
    </div>
  );
}
