/**
 * 测试用户管理功能
 */

const API_BASE = 'http://localhost:3001/api';

async function testUserManagement() {
  console.log('🧪 开始测试用户管理功能...\n');

  try {
    // 1. 登录获取管理员 token
    console.log('1. 管理员登录...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'demo@knolib.com',
        password: 'admin123',
      }),
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error(`登录失败: ${loginData.error}`);
    }

    const token = loginData.data.token;
    console.log('✅ 管理员登录成功');

    // 2. 获取用户列表
    console.log('\n2. 获取用户列表...');
    const usersResponse = await fetch(`${API_BASE}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const usersData = await usersResponse.json();
    if (!usersData.success) {
      throw new Error(`获取用户列表失败: ${usersData.error}`);
    }

    console.log('✅ 用户列表获取成功');
    console.log(`📊 用户总数: ${usersData.data.length}`);
    
    usersData.data.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name || '未设置姓名'} (${user.email}) - ${user.role} - ${user.isActive ? '活跃' : '禁用'}`);
    });

    // 3. 测试用户状态切换（如果有多个用户）
    if (usersData.data.length > 1) {
      const testUser = usersData.data.find(u => u.email !== 'demo@knolib.com');
      if (testUser) {
        console.log(`\n3. 测试用户状态切换 (${testUser.email})...`);
        
        const originalStatus = testUser.isActive;
        console.log(`   原状态: ${originalStatus ? '活跃' : '禁用'}`);
        
        // 切换状态
        const toggleResponse = await fetch(`${API_BASE}/users/${testUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: !originalStatus,
          }),
        });

        const toggleData = await toggleResponse.json();
        if (!toggleData.success) {
          throw new Error(`状态切换失败: ${toggleData.error}`);
        }

        console.log(`✅ 状态切换成功: ${!originalStatus ? '活跃' : '禁用'}`);

        // 恢复原状态
        const restoreResponse = await fetch(`${API_BASE}/users/${testUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: originalStatus,
          }),
        });

        const restoreData = await restoreResponse.json();
        if (!restoreData.success) {
          throw new Error(`状态恢复失败: ${restoreData.error}`);
        }

        console.log(`✅ 状态恢复成功: ${originalStatus ? '活跃' : '禁用'}`);
      }
    }

    // 4. 测试获取单个用户详情
    const firstUser = usersData.data[0];
    console.log(`\n4. 获取用户详情 (${firstUser.email})...`);
    
    const userDetailResponse = await fetch(`${API_BASE}/users/${firstUser.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const userDetailData = await userDetailResponse.json();
    if (!userDetailData.success) {
      throw new Error(`获取用户详情失败: ${userDetailData.error}`);
    }

    console.log('✅ 用户详情获取成功');
    console.log(`   ID: ${userDetailData.data.id}`);
    console.log(`   邮箱: ${userDetailData.data.email}`);
    console.log(`   姓名: ${userDetailData.data.name || '未设置'}`);
    console.log(`   角色: ${userDetailData.data.role}`);
    console.log(`   状态: ${userDetailData.data.isActive ? '活跃' : '禁用'}`);
    console.log(`   创建时间: ${new Date(userDetailData.data.createdAt).toLocaleString('zh-CN')}`);

    // 5. 测试权限验证（尝试删除自己）
    console.log('\n5. 测试权限验证（尝试删除自己）...');
    
    const adminUser = usersData.data.find(u => u.email === 'demo@knolib.com');
    if (adminUser) {
      const deleteResponse = await fetch(`${API_BASE}/users/${adminUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const deleteData = await deleteResponse.json();
      if (deleteData.success) {
        throw new Error('应该阻止删除自己的账户');
      }

      console.log('✅ 权限验证正常：阻止删除自己的账户');
      console.log(`   错误信息: ${deleteData.error}`);
    }

    console.log('\n🎉 用户管理功能测试完成！');
    console.log('\n📋 测试结果总结:');
    console.log('✅ 用户列表获取');
    console.log('✅ 用户状态切换');
    console.log('✅ 用户详情获取');
    console.log('✅ 权限验证');
    console.log('✅ API 认证');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testUserManagement();
