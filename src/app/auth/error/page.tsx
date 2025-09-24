'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const errorMessages = {
  Configuration: '服务配置错误，请联系管理员',
  AccessDenied: '访问被拒绝，您没有权限访问此资源',
  Verification: '验证失败，请重试',
  Default: '登录过程中发生错误，请重试',
  OAuthSignin: 'OAuth 登录失败',
  OAuthCallback: 'OAuth 回调错误',
  OAuthCreateAccount: '创建 OAuth 账户失败',
  EmailCreateAccount: '创建邮箱账户失败',
  Callback: '回调处理失败',
  OAuthAccountNotLinked: '该 OAuth 账户未关联到任何用户，请先注册或使用其他方式登录',
  EmailSignin: '邮箱登录失败',
  CredentialsSignin: '用户名或密码错误',
  SessionRequired: '需要登录才能访问此页面',
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';

  const getErrorMessage = (errorCode: string) => {
    return errorMessages[errorCode as keyof typeof errorMessages] || errorMessages.Default;
  };

  const getErrorDescription = (errorCode: string) => {
    switch (errorCode) {
      case 'Configuration':
        return '系统配置存在问题，请联系技术支持团队解决。';
      case 'AccessDenied':
        return '您的账户可能没有足够的权限，或者管理员已限制您的访问。';
      case 'Verification':
        return '验证过程失败，这可能是临时问题，请稍后重试。';
      case 'OAuthSignin':
        return '第三方登录服务暂时不可用，请尝试其他登录方式。';
      case 'OAuthCallback':
        return '第三方登录回调处理失败，请重新尝试登录。';
      case 'OAuthCreateAccount':
        return '无法创建第三方账户，可能是因为邮箱已被使用。';
      case 'OAuthAccountNotLinked':
        return '该第三方账户尚未关联到系统账户，请先注册或使用邮箱登录后在个人设置中关联。';
      case 'CredentialsSignin':
        return '请检查您的邮箱和密码是否正确，或尝试重置密码。';
      case 'SessionRequired':
        return '您需要先登录才能访问请求的页面。';
      default:
        return '这可能是临时问题，请稍后重试或联系技术支持。';
    }
  };

  const getSuggestions = (errorCode: string) => {
    switch (errorCode) {
      case 'Configuration':
        return [
          '联系系统管理员',
          '检查系统状态页面',
          '稍后重试'
        ];
      case 'AccessDenied':
        return [
          '联系管理员申请权限',
          '使用其他账户登录',
          '检查账户状态'
        ];
      case 'OAuthAccountNotLinked':
        return [
          '使用邮箱注册新账户',
          '使用邮箱登录现有账户',
          '在个人设置中关联第三方账户'
        ];
      case 'CredentialsSignin':
        return [
          '检查邮箱和密码',
          '尝试重置密码',
          '使用第三方登录'
        ];
      default:
        return [
          '刷新页面重试',
          '清除浏览器缓存',
          '使用其他登录方式',
          '联系技术支持'
        ];
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
              登录失败
            </CardTitle>
            <CardDescription className="text-red-600 dark:text-red-400">
              {getErrorMessage(error)}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="mb-4">{getErrorDescription(error)}</p>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  建议解决方案：
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {getSuggestions(error).map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                重试
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回上一页
              </Button>
              
              <Link href="/">
                <Button variant="ghost" className="w-full">
                  返回首页
                </Button>
              </Link>
            </div>

            {error && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                错误代码: {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
