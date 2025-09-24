/**
 * NextAuth.js API 路由
 */

import NextAuth from 'next-auth';
import { getAuthOptions } from '@/lib/auth/nextauth';

// 动态处理 NextAuth 请求
const authOptions = await getAuthOptions();
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
