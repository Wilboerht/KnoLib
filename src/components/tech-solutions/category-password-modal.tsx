'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface CategoryPasswordModalProps {
  categoryName: string;
  categorySlug: string;
  onSuccess: () => void;
  onCancel?: () => void;
}

export function CategoryPasswordModal({
  categoryName,
  categorySlug,
  onSuccess,
  onCancel
}: CategoryPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Please enter the password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tech-categories/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: categorySlug, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store verification in session storage for this category
        sessionStorage.setItem(`tech-category-${categorySlug}-verified`, 'true');

        // Also set a cookie for server-side verification (expires in 1 hour)
        const expirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        document.cookie = `tech-category-${categorySlug}-verified=true; expires=${expirationTime.toUTCString()}; path=/; SameSite=Strict`;

        onSuccess();
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (error) {
      console.error('Password verification error:', error);
      setError('Failed to verify password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Protected Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The category <strong>"{categoryName}"</strong> is password protected. 
            Please enter the password to access its content.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter category password"
                className="pr-10"
                disabled={loading}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading || !password.trim()}
              className="flex-1"
            >
              {loading ? 'Verifying...' : 'Access Category'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Contact the administrator if you don't have the password.
          </p>
        </div>
      </div>
    </div>
  );
}
