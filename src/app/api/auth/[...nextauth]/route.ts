/**
 * NextAuth.js API 路由
 */

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth/nextauth';

// 动态处理 NextAuth 请求
async function handler(req: Request, context: { params: { nextauth: string[] } }) {
  const authOptions = await getAuthOptions();
  const params = await context.params;
  console.log('NextAuth 处理请求:', params.nextauth);
  console.log('配置的提供商数量:', authOptions.providers.length);
  console.log('提供商列表:', authOptions.providers.map(p => p.id || p.name));
  return NextAuth(req, context, authOptions);
}

export { handler as GET, handler as POST };
