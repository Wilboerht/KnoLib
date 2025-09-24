'use client';

/**
 * 鉴权上下文和 Hook
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // 从 localStorage 加载 token
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // 验证 token 并获取用户信息
      fetchCurrentUser(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 获取当前用户信息
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.data.user);
        } else {
          // Token 无效，清除本地存储
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      } else {
        // Token 无效，清除本地存储
        localStorage.removeItem('auth_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { user: userData, token: userToken } = data.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('auth_token', userToken);
      } else {
        throw new Error(data.error || '登录失败');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const register = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { user: userData, token: userToken } = data.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('auth_token', userToken);
      } else {
        throw new Error(data.error || '注册失败');
      }
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 退出登录
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');

    // 调用退出登录 API（可选）
    fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(console.error);

    // 退出登录后跳转到首页
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  // 刷新用户信息
  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
