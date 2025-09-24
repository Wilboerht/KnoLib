'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            权限不足
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            抱歉，您没有访问此页面的权限。
            {user && (
              <>
                <br />
                当前用户：{user.email} ({user.role})
              </>
            )}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            返回上一页
          </button>
          
          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            返回首页
          </Link>

          {user && (
            <button
              onClick={logout}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              退出登录
            </button>
          )}
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>如果您认为这是一个错误，请联系管理员。</p>
        </div>
      </div>
    </div>
  );
}
