'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Mail, Shield, Link, Unlink } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { useOAuthProviders } from '@/lib/auth/use-oauth-providers';

interface LinkedAccount {
  id: string;
  provider: string;
  providerAccountId: string;
  type: string;
  providerInfo?: {
    name: string;
    displayName: string;
    icon?: string;
    color?: string;
  };
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { providers } = useOAuthProviders();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  const fetchLinkedAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/link-account');
      const data = await response.json();

      if (data.success) {
        setLinkedAccounts(data.data);
      } else {
        setMessage({ type: 'error', text: data.error || '获取关联账户失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
      console.error('获取关联账户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const unlinkAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/auth/unlink-account/${accountId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '账户关联已取消' });
        fetchLinkedAccounts(); // 重新获取列表
      } else {
        setMessage({ type: 'error', text: data.error || '取消关联失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
      console.error('取消关联失败:', error);
    }
  };

  const getAvailableProviders = () => {
    const linkedProviderNames = linkedAccounts.map(account => account.provider);
    return providers.filter(provider => !linkedProviderNames.includes(provider.name));
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              个人资料
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              管理您的账户信息和登录方式
            </p>
          </div>

          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>基本信息</span>
                </CardTitle>
                <CardDescription>
                  您的账户基本信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input
                    id="name"
                    value={user?.name || ''}
                    placeholder="请输入姓名"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">角色</Label>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <Button className="w-full" disabled>
                  保存更改
                </Button>
              </CardContent>
            </Card>

            {/* 关联账户 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5" />
                  <span>关联账户</span>
                </CardTitle>
                <CardDescription>
                  管理您的第三方登录账户
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {linkedAccounts.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      已关联账户
                    </h4>
                    {linkedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">
                            {account.providerInfo?.icon || '🔐'}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {account.providerInfo?.displayName || account.provider}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {account.providerAccountId}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unlinkAccount(account.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Unlink className="h-4 w-4 mr-1" />
                          取消关联
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    暂无关联的第三方账户
                  </p>
                )}

                {getAvailableProviders().length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      可关联账户
                    </h4>
                    {getAvailableProviders().map((provider) => (
                      <div
                        key={provider.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{provider.icon}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {provider.displayName}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                        >
                          <Link className="h-4 w-4 mr-1" />
                          关联账户
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
