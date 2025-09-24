'use client';

import { useState, useEffect } from 'react';

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon?: string;
  color?: string;
}

export function useOAuthProviders() {
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/providers');
        const data = await response.json();

        if (data.success) {
          setProviders(data.data);
        } else {
          setError(data.error || '获取登录方式失败');
        }
      } catch (err) {
        setError('网络错误');
        console.error('获取 OAuth 提供商失败:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return { providers, loading, error };
}
