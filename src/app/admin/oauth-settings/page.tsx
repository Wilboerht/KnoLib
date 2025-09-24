'use client';

import { useState, useEffect } from 'react';
import { AdminProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, Eye, EyeOff, ArrowLeft, Edit, X } from 'lucide-react';
import Link from 'next/link';
import { OAuthLogo } from '@/components/icons/oauth-logos';

interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  clientId?: string;
  clientSecret?: string;
  enabled: boolean;
  order: number;
  icon?: string;
  color?: string;
}

// 预定义的提供商配置
const defaultProviders = [
  {
    name: 'google',
    displayName: 'Google',
    color: '#db4437',
    description: 'Google OAuth 2.0 登录',
    setupUrl: 'https://console.developers.google.com/',
  },
  {
    name: 'github',
    displayName: 'GitHub',
    color: '#333',
    description: 'GitHub OAuth 登录',
    setupUrl: 'https://github.com/settings/applications/new',
  },
  {
    name: 'microsoft',
    displayName: 'Microsoft',
    color: '#0078d4',
    description: 'Microsoft Azure AD 登录',
    setupUrl: 'https://portal.azure.com/',
  },
  {
    name: 'wechat',
    displayName: '微信',
    color: '#07c160',
    description: '微信开放平台登录',
    setupUrl: 'https://open.weixin.qq.com/',
  },
  {
    name: 'alipay',
    displayName: '支付宝',
    color: '#1677ff',
    description: '支付宝开放平台登录',
    setupUrl: 'https://open.alipay.com/',
  },
];

export default function OAuthSettingsPage() {
  const { isAuthenticated, token } = useAuth();
  const [providers, setProviders] = useState<OAuthProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [editingProvider, setEditingProvider] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProviders();
    }
  }, [isAuthenticated, token]);

  const fetchProviders = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('/api/admin/oauth-providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success) {
        // 合并默认配置和数据库配置
        const mergedProviders = defaultProviders.map(defaultProvider => {
          const existingProvider = data.data.find((p: OAuthProvider) => p.name === defaultProvider.name);
          return existingProvider || {
            id: '',
            name: defaultProvider.name,
            displayName: defaultProvider.displayName,
            clientId: '',
            clientSecret: '',
            enabled: false,
            order: 0,
            icon: defaultProvider.name,
            color: defaultProvider.color,
          };
        });
        setProviders(mergedProviders);
      } else {
        setMessage({ type: 'error', text: data.error || '获取配置失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
      console.error('获取 OAuth 配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProvider = async (provider: OAuthProvider) => {
    if (!token) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/oauth-providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(provider),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '配置保存成功' });
        setEditingProvider(null); // 退出编辑模式
        fetchProviders(); // 重新获取数据
      } else {
        setMessage({ type: 'error', text: data.error || '保存失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误' });
      console.error('保存 OAuth 配置失败:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateProvider = (index: number, field: keyof OAuthProvider, value: any) => {
    const updatedProviders = [...providers];
    updatedProviders[index] = { ...updatedProviders[index], [field]: value };
    setProviders(updatedProviders);
  };

  const toggleSecretVisibility = (providerName: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [providerName]: !prev[providerName],
    }));
  };

  // 格式化 Client ID 显示，省略中间部分
  const formatClientId = (clientId: string) => {
    if (!clientId || clientId.length <= 20) return clientId;
    return `${clientId.substring(0, 8)}...${clientId.substring(clientId.length - 8)}`;
  };

  if (loading) {
    return (
      <AdminProtectedRoute>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] pt-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminProtectedRoute>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-[calc(100vh-4rem)] pt-16">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回管理面板
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                OAuth 登录配置
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                配置第三方登录提供商，用户可以使用这些账户登录系统
              </p>
            </div>

          {message && (
            <Alert className={`mb-6 ${message.type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
              <AlertDescription className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={providers[0]?.name} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              {providers.map((provider) => (
                <TabsTrigger key={provider.name} value={provider.name} className="flex items-center space-x-2">
                  <OAuthLogo provider={provider.name} size={20} />
                  <span className="hidden sm:inline">{provider.displayName}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {providers.map((provider, index) => {
              const defaultProvider = defaultProviders.find(p => p.name === provider.name);
              return (
                <TabsContent key={provider.name} value={provider.name}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <OAuthLogo provider={provider.name} size={32} />
                          <span>{provider.displayName} 登录配置</span>
                        </div>
                        {provider.clientId && provider.clientSecret && editingProvider !== provider.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProvider(provider.name)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            修改
                          </Button>
                        )}
                        {editingProvider === provider.name && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProvider(null)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            取消
                          </Button>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {defaultProvider?.description}
                        {defaultProvider?.setupUrl && (
                          <span>
                            {' '}
                            <a
                              href={defaultProvider.setupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              前往配置 →
                            </a>
                          </span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={provider.enabled}
                          onCheckedChange={(checked) => updateProvider(index, 'enabled', checked)}
                          disabled={editingProvider !== provider.name &&
                                   !!(provider.clientId && provider.clientId.trim() !== '' &&
                                   provider.clientSecret && provider.clientSecret.trim() !== '')}
                        />
                        <Label>启用 {provider.displayName} 登录</Label>
                      </div>

                      {/* 如果已配置且不在编辑模式，显示只读信息 */}
                      {provider.clientId && provider.clientId.trim() !== '' &&
                       provider.clientSecret && provider.clientSecret.trim() !== '' &&
                       editingProvider !== provider.name ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Client ID</Label>
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                                <span className="text-sm font-mono">{formatClientId(provider.clientId)}</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Client Secret</Label>
                              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                                <span className="text-sm font-mono">••••••••</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>显示顺序</Label>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border w-32">
                              <span className="text-sm">{provider.order}</span>
                            </div>
                          </div>

                          <div className="text-sm text-green-600 dark:text-green-400">
                            ✅ 配置已保存，点击"修改"按钮可以编辑配置
                          </div>
                        </div>
                      ) : (
                        /* 编辑模式或未配置时显示表单 */
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`${provider.name}-clientId`}>Client ID</Label>
                              <Input
                                id={`${provider.name}-clientId`}
                                value={provider.clientId || ''}
                                onChange={(e) => updateProvider(index, 'clientId', e.target.value)}
                                placeholder="输入 Client ID"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`${provider.name}-clientSecret`}>Client Secret</Label>
                              <div className="relative">
                                <Input
                                  id={`${provider.name}-clientSecret`}
                                  type={showSecrets[provider.name] ? 'text' : 'password'}
                                  value={provider.clientSecret || ''}
                                  onChange={(e) => updateProvider(index, 'clientSecret', e.target.value)}
                                  placeholder="输入 Client Secret"
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => toggleSecretVisibility(provider.name)}
                                >
                                  {showSecrets[provider.name] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`${provider.name}-order`}>显示顺序</Label>
                            <Input
                              id={`${provider.name}-order`}
                              type="number"
                              value={provider.order}
                              onChange={(e) => updateProvider(index, 'order', parseInt(e.target.value) || 0)}
                              className="w-32"
                            />
                          </div>

                          <Button
                            onClick={() => saveProvider(provider)}
                            disabled={saving || !provider.clientId || !provider.clientSecret}
                            className="w-full"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                保存中...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                保存配置
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </Tabs>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
