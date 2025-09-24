/**
 * 初始化 OAuth 提供商配置脚本
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const defaultProviders = [
  {
    name: 'google',
    displayName: 'Google',
    enabled: false,
    order: 1,
    icon: '🔍',
    color: '#db4437',
  },
  {
    name: 'github',
    displayName: 'GitHub',
    enabled: false,
    order: 2,
    icon: '🐙',
    color: '#333',
  },
  {
    name: 'microsoft',
    displayName: 'Microsoft',
    enabled: false,
    order: 3,
    icon: '🪟',
    color: '#0078d4',
  },
  {
    name: 'wechat',
    displayName: '微信',
    enabled: false,
    order: 4,
    icon: '💬',
    color: '#07c160',
  },
  {
    name: 'alipay',
    displayName: '支付宝',
    enabled: false,
    order: 5,
    icon: '💰',
    color: '#1677ff',
  },
];

async function setupOAuthProviders() {
  console.log('🔧 开始初始化 OAuth 提供商配置...\n');

  try {
    for (const provider of defaultProviders) {
      // 检查是否已存在
      const existingProvider = await prisma.oAuthProvider.findUnique({
        where: { name: provider.name },
      });

      if (existingProvider) {
        console.log(`✅ ${provider.displayName} 配置已存在，跳过`);
        continue;
      }

      // 创建新的提供商配置
      await prisma.oAuthProvider.create({
        data: provider,
      });

      console.log(`✅ 创建 ${provider.displayName} 配置成功`);
    }

    console.log('\n🎉 OAuth 提供商配置初始化完成！');
    console.log('\n📝 接下来的步骤：');
    console.log('1. 访问 /admin/oauth-settings 配置各个提供商的 Client ID 和 Client Secret');
    console.log('2. 启用需要的登录方式');
    console.log('3. 用户就可以使用第三方账户登录了');

    console.log('\n🔗 各提供商的配置地址：');
    console.log('- Google: https://console.developers.google.com/');
    console.log('- GitHub: https://github.com/settings/applications/new');
    console.log('- Microsoft: https://portal.azure.com/');
    console.log('- 微信: https://open.weixin.qq.com/');
    console.log('- 支付宝: https://open.alipay.com/');

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// 运行脚本
setupOAuthProviders();
