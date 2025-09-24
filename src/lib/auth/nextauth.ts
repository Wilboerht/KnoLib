/**
 * NextAuth.js 配置
 */

import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import { generateToken } from './jwt';

// 动态获取启用的 OAuth 提供商配置
async function getEnabledProviders() {
  try {
    const providers = await prisma.oAuthProvider.findMany({
      where: { enabled: true },
    });

    console.log('数据库中启用的 OAuth 提供商:', providers);

    const authProviders = [];

    for (const provider of providers) {
      if (!provider.clientId || !provider.clientSecret) {
        console.log(`跳过未配置的提供商: ${provider.name}`);
        continue; // 跳过未配置的提供商
      }

      switch (provider.name) {
        case 'google':
          console.log('配置 Google OAuth 提供商:', {
            clientId: provider.clientId?.substring(0, 10) + '...',
            hasSecret: !!provider.clientSecret
          });
          const googleProvider = GoogleProvider({
            clientId: provider.clientId,
            clientSecret: provider.clientSecret,
          });
          console.log('Google 提供商 ID:', googleProvider.id);
          authProviders.push(googleProvider);
          break;

        case 'github':
          authProviders.push(
            GitHubProvider({
              clientId: provider.clientId,
              clientSecret: provider.clientSecret,
            })
          );
          break;

        case 'microsoft':
          // Microsoft Azure AD 配置
          authProviders.push({
            id: 'azure-ad',
            name: 'Microsoft',
            type: 'oauth',
            authorization: {
              url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
              params: {
                scope: 'openid profile email',
                response_type: 'code',
              },
            },
            token: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
            userinfo: 'https://graph.microsoft.com/v1.0/me',
            clientId: provider.clientId,
            clientSecret: provider.clientSecret,
            profile(profile: any) {
              return {
                id: profile.id,
                name: profile.displayName,
                email: profile.mail || profile.userPrincipalName,
                image: null,
              };
            },
          });
          break;

        // 微信和支付宝需要特殊处理，这里先预留
        case 'wechat':
          // 微信登录配置
          authProviders.push({
            id: 'wechat',
            name: 'WeChat',
            type: 'oauth',
            authorization: {
              url: 'https://open.weixin.qq.com/connect/qrconnect',
              params: {
                scope: 'snsapi_login',
                response_type: 'code',
              },
            },
            token: 'https://api.weixin.qq.com/sns/oauth2/access_token',
            userinfo: 'https://api.weixin.qq.com/sns/userinfo',
            clientId: provider.clientId,
            clientSecret: provider.clientSecret,
            profile(profile: any) {
              return {
                id: profile.openid,
                name: profile.nickname,
                email: null, // 微信不提供邮箱
                image: profile.headimgurl,
              };
            },
          });
          break;

        case 'alipay':
          // 支付宝登录配置
          authProviders.push({
            id: 'alipay',
            name: 'Alipay',
            type: 'oauth',
            authorization: {
              url: 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm',
              params: {
                scope: 'auth_user',
                response_type: 'code',
              },
            },
            token: 'https://openapi.alipay.com/gateway.do',
            userinfo: 'https://openapi.alipay.com/gateway.do',
            clientId: provider.clientId,
            clientSecret: provider.clientSecret,
            profile(profile: any) {
              return {
                id: profile.user_id,
                name: profile.nick_name,
                email: null, // 支付宝不提供邮箱
                image: profile.avatar,
              };
            },
          });
          break;
      }
    }

    console.log('最终配置的 OAuth 提供商数量:', authProviders.length);
    return authProviders;
  } catch (error) {
    console.error('获取 OAuth 提供商配置失败:', error);
    return [];
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [], // 将在运行时动态设置
  pages: {
    signIn: '/',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // 首次登录时，将用户信息添加到 token
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role || 'AUTHOR';
      }
      return token;
    },
    async session({ session, token }) {
      // 将用户信息添加到 session
      if (token) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // 处理第三方登录的用户信息
      if (account?.provider !== 'credentials') {
        try {
          if (!user.email) {
            console.error('第三方登录用户没有邮箱信息');
            return false;
          }

          // 检查用户是否已存在
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // 检查用户是否被禁用
            if (!existingUser.isActive) {
              console.error('用户账户已被禁用:', user.email);
              return false;
            }

            // 更新最后登录时间
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { lastLogin: new Date() },
            });
          } else {
            // 创建新用户
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                avatar: user.image,
                role: 'AUTHOR',
                isActive: true,
                lastLogin: new Date(),
              },
            });
          }
        } catch (error) {
          console.error('处理第三方登录用户失败:', error);
          return false;
        }
      }
      return true;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`用户登录: ${user.email} via ${account?.provider}`);

      // 记录登录事件（可以扩展为审计日志）
      if (account?.provider) {
        try {
          // 这里可以添加登录日志记录
          console.log(`OAuth 登录成功: ${user.email} 通过 ${account.provider}`);
        } catch (error) {
          console.error('记录登录事件失败:', error);
        }
      }
    },
    async signInError({ error }) {
      console.error('登录错误:', error);
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// 动态设置提供商
export async function getAuthOptions(): Promise<NextAuthOptions> {
  const providers = await getEnabledProviders();
  return {
    ...authOptions,
    providers,
  };
}
