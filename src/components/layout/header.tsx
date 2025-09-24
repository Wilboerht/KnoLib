"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, User, LogOut, Settings, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KnoLibIcon } from "@/components/ui/all-docs-icon";
import { useAuth } from "@/lib/auth/context";
import { usePermission } from "@/lib/auth/hooks";
import { AuthModals } from "@/components/auth/auth-modals";



const navigation = [
  { name: "Home", href: "/" },
  { name: "Knowledge Base", href: "/knowledge" },
  { name: "Tech Solutions", href: "/tech-solutions" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { isEditor } = usePermission();
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // 点击外部关闭用户菜单
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  // 模态框控制函数
  const handleLoginOpen = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleRegisterOpen = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleLoginClose = () => setIsLoginModalOpen(false);
  const handleRegisterClose = () => setIsRegisterModalOpen(false);

  const handleSwitchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };



  return (
    <header className="fixed top-2 sm:top-4 z-50 w-full px-2 sm:px-4">
      {/* Liquid Glass Navigation */}
      <div className="relative max-w-7xl mx-auto">
        {/* Glass morphism background - responsive width */}
        <div className="absolute inset-0 bg-white/25 dark:bg-slate-900/25 backdrop-blur-xl border border-white/15 dark:border-slate-700/20 rounded-xl sm:rounded-2xl" />

        {/* Subtle gradient overlay for depth - responsive width */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent dark:from-slate-800/10 rounded-xl sm:rounded-2xl" />

        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
                <div className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0">
                  <KnoLibIcon className="h-7 w-7 sm:h-8 sm:w-8 text-slate-900 dark:text-white" />
                </div>
                <span
                  className="font-semibold text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors duration-300 truncate"
                  suppressHydrationWarning
                >
                  KnoLib
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 xl:px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 group whitespace-nowrap"
                >
                  <span className="relative z-10" suppressHydrationWarning>{item.name}</span>
                  {/* Subtle hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                </Link>
              ))}
              {/* Admin link for editors */}
              {isEditor() && (
                <Link
                  href="/admin"
                  className="relative px-3 xl:px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 group whitespace-nowrap"
                >
                  <span className="relative z-10" suppressHydrationWarning>Admin</span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                </Link>
              )}
            </nav>

            {/* Medium Screen Navigation - Simplified */}
            <nav className="hidden md:flex lg:hidden items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 group"
                >
                  <span className="relative z-10" suppressHydrationWarning>
                    {item.name === "Knowledge Base" ? "KB" :
                     item.name === "Tech Solutions" ? "Tech" :
                     item.name}
                  </span>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-3">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name || user?.email}</span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-[60]"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name || '未设置姓名'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {user?.role}
                        </p>
                      </div>
                      {isEditor() && (
                        <div
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('管理面板链接被点击');
                            setUserMenuOpen(false);
                            setTimeout(() => {
                              window.location.href = '/admin';
                            }, 100);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          管理面板
                        </div>
                      )}
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('退出登录按钮被点击');
                          setUserMenuOpen(false);
                          setTimeout(() => {
                            logout();
                          }, 100);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        退出登录
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoginOpen}
                  className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
                  aria-label="登录"
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Medium Screen CTA - Compact */}
            <div className="hidden md:flex lg:hidden items-center">
              {isAuthenticated ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 px-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user?.name || user?.email}</span>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-[60]"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user?.name || '未设置姓名'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      {isEditor() && (
                        <div
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('管理面板链接被点击 (中等屏幕)');
                            setUserMenuOpen(false);
                            setTimeout(() => {
                              window.location.href = '/admin';
                            }, 100);
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          管理
                        </div>
                      )}
                      <div
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('退出登录按钮被点击 (中等屏幕)');
                          setUserMenuOpen(false);
                          setTimeout(() => {
                            logout();
                          }, 100);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        退出
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLoginOpen}
                  className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all duration-300 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50"
                  aria-label="登录"
                  suppressHydrationWarning
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                className="text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-800/50 border-0 h-9 w-9"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4 text-slate-900 dark:text-white" />
                ) : (
                  <Menu className="h-4 w-4 text-slate-900 dark:text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          {/* Glass morphism mobile menu */}
          <div className="absolute top-full left-2 right-2 sm:left-4 sm:right-4 z-50">
            <div className="mt-2 rounded-xl sm:rounded-2xl bg-white/30 dark:bg-slate-900/30 backdrop-blur-xl border border-white/15 dark:border-slate-700/20 shadow-2xl max-w-7xl mx-auto">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/10 to-transparent dark:from-slate-800/10 pointer-events-none" />

              <div className="relative p-4 sm:p-6 space-y-1">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg sm:rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative">
                      <span className="relative z-10" suppressHydrationWarning>{item.name}</span>
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                    </div>
                  </Link>
                ))}

                {/* Admin link for editors */}
                {isEditor() && (
                  <Link
                    href="/admin"
                    className="block px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg sm:rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-300 group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <span className="relative z-10" suppressHydrationWarning>Admin</span>
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
                    </div>
                  </Link>
                )}

                {/* Mobile CTA Buttons */}
                <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/20 dark:border-slate-700/30">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="px-3 py-2 bg-white/20 dark:bg-slate-800/20 rounded-lg">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user?.name || '未设置姓名'}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {user?.email} ({user?.role})
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        退出登录
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLoginOpen();
                        }}
                      >
                        登录
                      </Button>

                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* 认证模态框 */}
      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isRegisterOpen={isRegisterModalOpen}
        onLoginClose={handleLoginClose}
        onRegisterClose={handleRegisterClose}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
}
