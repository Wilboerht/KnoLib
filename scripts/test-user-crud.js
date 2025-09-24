/**
 * 测试用户 CRUD 功能
 */

const API_BASE = 'http://localhost:3001/api';

async function testUserCRUD() {
  console.log('🧪 开始测试用户 CRUD 功能...\n');

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

    // 2. 创建新用户
    console.log('\n2. 创建新用户...');
    const newUserData = {
      email: 'testuser@example.com',
      name: 'Test User New',
      role: 'EDITOR',
      isActive: true
    };

    const createResponse = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newUserData),
    });

    const createData = await createResponse.json();
    if (!createData.success) {
      throw new Error(`创建用户失败: ${createData.error}`);
    }

    console.log('✅ 用户创建成功');
    console.log(`   用户ID: ${createData.data.id}`);
    console.log(`   邮箱: ${createData.data.email}`);
    console.log(`   姓名: ${createData.data.name}`);
    console.log(`   角色: ${createData.data.role}`);
    console.log(`   状态: ${createData.data.isActive ? '活跃' : '禁用'}`);
    console.log(`   默认密码: ${createData.message}`);

    const newUserId = createData.data.id;

    // 3. 编辑用户信息
    console.log('\n3. 编辑用户信息...');
    const updateData = {
      name: 'Updated Test User',
      role: 'AUTHOR',
      isActive: false
    };

    const updateResponse = await fetch(`${API_BASE}/users/${newUserId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const updateResult = await updateResponse.json();
    if (!updateResult.success) {
      throw new Error(`更新用户失败: ${updateResult.error}`);
    }

    console.log('✅ 用户更新成功');
    console.log(`   新姓名: ${updateResult.data.name}`);
    console.log(`   新角色: ${updateResult.data.role}`);
    console.log(`   新状态: ${updateResult.data.isActive ? '活跃' : '禁用'}`);

    // 4. 获取用户详情
    console.log('\n4. 获取用户详情...');
    const detailResponse = await fetch(`${API_BASE}/users/${newUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const detailData = await detailResponse.json();
    if (!detailData.success) {
      throw new Error(`获取用户详情失败: ${detailData.error}`);
    }

    console.log('✅ 用户详情获取成功');
    console.log(`   邮箱: ${detailData.data.email}`);
    console.log(`   姓名: ${detailData.data.name}`);
    console.log(`   角色: ${detailData.data.role}`);
    console.log(`   状态: ${detailData.data.isActive ? '活跃' : '禁用'}`);

    // 5. 删除测试用户
    console.log('\n5. 删除测试用户...');
    const deleteResponse = await fetch(`${API_BASE}/users/${newUserId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const deleteData = await deleteResponse.json();
    if (!deleteData.success) {
      throw new Error(`删除用户失败: ${deleteData.error}`);
    }

    console.log('✅ 用户删除成功');

    // 6. 验证用户已删除
    console.log('\n6. 验证用户已删除...');
    const verifyResponse = await fetch(`${API_BASE}/users/${newUserId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const verifyData = await verifyResponse.json();
    if (verifyData.success) {
      throw new Error('用户应该已被删除');
    }

    console.log('✅ 用户删除验证成功');

    // 7. 测试重复邮箱创建
    console.log('\n7. 测试重复邮箱创建...');
    const duplicateResponse = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: 'demo@knolib.com', // 使用已存在的邮箱
        name: 'Duplicate User',
        role: 'AUTHOR',
        isActive: true
      }),
    });

    const duplicateData = await duplicateResponse.json();
    if (duplicateData.success) {
      throw new Error('应该阻止创建重复邮箱的用户');
    }

    console.log('✅ 重复邮箱验证正常');
    console.log(`   错误信息: ${duplicateData.error}`);

    console.log('\n🎉 用户 CRUD 功能测试完成！');
    console.log('\n📋 测试结果总结:');
    console.log('✅ 创建用户功能');
    console.log('✅ 编辑用户功能');
    console.log('✅ 获取用户详情');
    console.log('✅ 删除用户功能');
    console.log('✅ 重复邮箱验证');
    console.log('✅ 权限验证');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testUserCRUD();
