'use client';

import { X, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick?: () => void; // 保持兼容性，但不使用
}

export function UserActionModal({
  isOpen,
  onClose,
  onLoginClick,
}: UserActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm relative">
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              欢迎来到 KnoLib
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              请登录您的账户
            </p>
          </div>

          {/* 登录按钮 */}
          <div className="mb-6">
            <Button
              onClick={() => {
                onClose();
                onLoginClick();
              }}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <LogIn className="h-5 w-5" />
              <span>登录账户</span>
            </Button>
          </div>

          {/* 说明信息 */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                需要账户？
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                请联系管理员为您创建账户
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
