'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { OAuthLogo } from '@/components/icons/oauth-logos';

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color?: string;
}

interface OAuthButtonProps {
  provider: OAuthProvider;
  callbackUrl?: string;
  className?: string;
}

// 预定义的颜色样式
const providerStyles = {
  google: {
    color: 'bg-white hover:bg-gray-50 border border-gray-300',
    textColor: 'text-gray-700',
  },
  github: {
    color: 'bg-gray-900 hover:bg-gray-800',
    textColor: 'text-white',
  },
  microsoft: {
    color: 'bg-white hover:bg-gray-50 border border-gray-300',
    textColor: 'text-gray-700',
  },
  wechat: {
    color: 'bg-green-500 hover:bg-green-600',
    textColor: 'text-white',
  },
  alipay: {
    color: 'bg-blue-500 hover:bg-blue-600',
    textColor: 'text-white',
  },
};

export function OAuthButton({ provider, callbackUrl = '/', className = '' }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('=== OAuth 登录调试信息 ===');
      console.log('Provider 对象:', provider);
      console.log('Provider name:', provider.name);
      console.log('Provider id:', provider.id);
      console.log('CallbackUrl:', callbackUrl);
      console.log('开始调用 signIn...');

      // 尝试使用 provider.name 调用 signIn
      // NextAuth 需要提供商 ID 作为第一个参数
      const result = await signIn(provider.name, {
        callbackUrl,
        redirect: false  // 先设置为 false 来看看返回结果
      });
      console.log('signIn 返回结果:', result);

      // 如果 signIn 返回 undefined 或失败，尝试直接重定向
      if (!result || result.error) {
        console.log('signIn 失败，尝试直接重定向');
        window.location.href = `/api/auth/signin/${provider.name}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
      } else if (result?.url) {
        console.log('signIn 成功，重定向到:', result.url);
        window.location.href = result.url;
      }
      console.log('OAuth 登录结果:', result);
    } catch (error) {
      console.error('OAuth 登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const style = providerStyles[provider.name as keyof typeof providerStyles] || {
    color: 'bg-gray-500 hover:bg-gray-600',
    textColor: 'text-white',
  };

  return (
    <Button
      onClick={() => {
        console.log('OAuth 按钮被点击:', provider.name);
        handleSignIn();
      }}
      disabled={isLoading}
      className={`w-full flex items-center justify-center space-x-3 ${style.color} ${style.textColor} ${className}`}
      variant="default"
    >
      <OAuthLogo provider={provider.name} size={20} />
      <span>
        {isLoading ? '登录中...' : `使用 ${provider.displayName} 登录`}
      </span>
    </Button>
  );
}

interface OAuthButtonListProps {
  providers: OAuthProvider[];
  callbackUrl?: string;
  className?: string;
}

export function OAuthButtonList({ providers, callbackUrl, className = '' }: OAuthButtonListProps) {
  if (providers.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-900 text-gray-500 dark:text-gray-400">
            或使用第三方账户登录
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {providers.map((provider) => (
          <OAuthButton
            key={provider.id}
            provider={provider}
            callbackUrl={callbackUrl}
          />
        ))}
      </div>
    </div>
  );
}
