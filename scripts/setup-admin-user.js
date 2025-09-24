/**
 * 设置管理员用户脚本
 * 为现有用户设置密码和管理员权限
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function setupAdminUser() {
  try {
    console.log('🔧 设置管理员用户...');

    // 查找现有用户
    const existingUser = await prisma.user.findFirst({
      where: {
        email: 'demo@knolib.com'
      }
    });

    if (existingUser) {
      // 更新现有用户
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
          name: 'Admin User'
        }
      });

      console.log('✅ 现有用户已更新为管理员');
      console.log('📧 邮箱: demo@knolib.com');
      console.log('🔑 密码: admin123');
      console.log('👤 角色: ADMIN');
    } else {
      // 创建新的管理员用户
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'admin@knolib.com',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
          isActive: true
        }
      });

      console.log('✅ 新管理员用户已创建');
      console.log('📧 邮箱: admin@knolib.com');
      console.log('🔑 密码: admin123');
      console.log('👤 角色: ADMIN');
      console.log('🆔 用户ID:', newUser.id);
    }

    // 创建一个普通用户用于测试
    const testUserExists = await prisma.user.findFirst({
      where: { email: 'user@knolib.com' }
    });

    if (!testUserExists) {
      const hashedPassword = await bcrypt.hash('user123', 12);
      
      const testUser = await prisma.user.create({
        data: {
          email: 'user@knolib.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'AUTHOR',
          isActive: true
        }
      });

      console.log('✅ 测试用户已创建');
      console.log('📧 邮箱: user@knolib.com');
      console.log('🔑 密码: user123');
      console.log('👤 角色: AUTHOR');
    }

    console.log('\n🎉 用户设置完成！');
    console.log('\n📝 测试步骤:');
    console.log('1. 访问 http://localhost:3000/auth/login');
    console.log('2. 使用管理员账户登录: admin@knolib.com / admin123');
    console.log('3. 访问 http://localhost:3000/admin 查看管理面板');
    console.log('4. 使用普通用户测试权限限制: user@knolib.com / user123');

  } catch (error) {
    console.error('❌ 设置用户失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupAdminUser();
