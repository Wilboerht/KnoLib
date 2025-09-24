'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { usePermission } from '@/lib/auth/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRoles?: string[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
  unauthorizedComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireRoles = [],
  fallbackPath = '/',
  loadingComponent,
  unauthorizedComponent,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasRole } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(fallbackPath);
        return;
      }

      if (requireRoles.length > 0 && isAuthenticated && !hasRole(requireRoles)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, requireRoles, hasRole, router, fallbackPath]);

  // 显示加载状态
  if (isLoading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 检查认证状态
  if (requireAuth && !isAuthenticated) {
    return null; // 将重定向到登录页面
  }

  // 检查权限
  if (requireRoles.length > 0 && isAuthenticated && !hasRole(requireRoles)) {
    return unauthorizedComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">权限不足</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// 预定义的保护组件
export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireRoles={['ADMIN']}>
      {children}
    </ProtectedRoute>
  );
}

export function EditorProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireRoles={['ADMIN', 'EDITOR']}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthorProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireRoles={['ADMIN', 'EDITOR', 'AUTHOR']}>
      {children}
    </ProtectedRoute>
  );
}
