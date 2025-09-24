'use client';

/**
 * 鉴权相关的自定义 Hooks
 */

import { useAuth } from './context';

/**
 * 检查用户是否有特定权限
 */
export function usePermission() {
  const { user } = useAuth();

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };

  const isEditor = (): boolean => {
    return hasRole(['ADMIN', 'EDITOR']);
  };

  const isAuthor = (): boolean => {
    return hasRole(['ADMIN', 'EDITOR', 'AUTHOR']);
  };

  const canManageUsers = (): boolean => {
    return isAdmin();
  };

  const canManageContent = (): boolean => {
    return isEditor();
  };

  const canCreateContent = (): boolean => {
    return isAuthor();
  };

  const canEditOwnContent = (authorId?: string): boolean => {
    if (!user || !authorId) return false;
    return user.id === authorId || isEditor();
  };

  const canDeleteContent = (authorId?: string): boolean => {
    if (!user) return false;
    if (isAdmin()) return true;
    if (isEditor()) return true;
    return user.id === authorId;
  };

  return {
    user,
    hasRole,
    isAdmin,
    isEditor,
    isAuthor,
    canManageUsers,
    canManageContent,
    canCreateContent,
    canEditOwnContent,
    canDeleteContent,
  };
}

/**
 * 检查用户是否已认证
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  return {
    isAuthenticated,
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
  };
}

/**
 * 检查用户是否有管理员权限
 */
export function useRequireAdmin() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin } = usePermission();
  
  return {
    isAuthenticated,
    isAdmin: isAdmin(),
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
    requireAdmin: !isLoading && isAuthenticated && !isAdmin(),
  };
}

/**
 * 检查用户是否有编辑权限
 */
export function useRequireEditor() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isEditor } = usePermission();
  
  return {
    isAuthenticated,
    isEditor: isEditor(),
    isLoading,
    requireAuth: !isLoading && !isAuthenticated,
    requireEditor: !isLoading && isAuthenticated && !isEditor(),
  };
}
