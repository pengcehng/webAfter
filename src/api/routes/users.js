const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { users } = require('../data/mockData');

const router = express.Router();

// 获取用户列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      username,
      email,
      phone,
      role,
      status
    } = req.query;

    let filteredUsers = [...users];

    // 按用户名筛选
    if (username) {
      filteredUsers = filteredUsers.filter(user =>
        user.username.toLowerCase().includes(username.toLowerCase())
      );
    }

    // 按邮箱筛选
    if (email) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(email.toLowerCase())
      );
    }

    // 按手机号筛选
    if (phone) {
      filteredUsers = filteredUsers.filter(user =>
        user.phone.includes(phone)
      );
    }

    // 按角色筛选
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // 按状态筛选
    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 按创建时间倒序排列
    filteredUsers.sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());

    // 移除密码字段
    filteredUsers = filteredUsers.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // 分页
    const total = filteredUsers.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredUsers.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取用户列表成功',
      data: {
        list: paginatedData,
        pagination: {
          current: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / parseInt(pageSize))
        }
      }
    });

  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个用户详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === id || u.userId === id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 移除密码字段
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: '获取用户详情成功',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('获取用户详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新用户
router.post('/', async (req, res) => {
  try {
    const {
      username,
      email,
      phone,
      password,
      role = '操作员',
      department,
      position
    } = req.body;

    // 验证必填字段
    if (!username || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱、手机号和密码为必填字段'
      });
    }

    // 验证用户名唯一性
    const existingUserByUsername = users.find(u => u.username === username);
    if (existingUserByUsername) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 验证邮箱唯一性
    const existingUserByEmail = users.find(u => u.email === email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: '邮箱已存在'
      });
    }

    // 验证手机号唯一性
    const existingUserByPhone = users.find(u => u.phone === phone);
    if (existingUserByPhone) {
      return res.status(400).json({
        success: false,
        message: '手机号已存在'
      });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      });
    }

    // 验证角色
    const validRoles = ['管理员', '操作员', '维护员', '观察员'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: '无效的用户角色'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 生成用户ID
    const userId = `USER${String(users.length + 1).padStart(3, '0')}`;

    // 创建新用户
    const newUser = {
      id: uuidv4(),
      userId,
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      department: department || '',
      position: position || '',
      status: '激活',
      avatar: '',
      lastLoginTime: null,
      loginCount: 0,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到用户列表
    users.push(newUser);

    // 移除密码字段
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      phone,
      role,
      department,
      position,
      status,
      avatar
    } = req.body;

    const userIndex = users.findIndex(u => u.id === id || u.userId === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[userIndex];

    // 验证用户名唯一性（如果要更新用户名）
    if (username && username !== user.username) {
      const existingUser = users.find(u => u.username === username && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
    }

    // 验证邮箱唯一性（如果要更新邮箱）
    if (email && email !== user.email) {
      const existingUser = users.find(u => u.email === email && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }
    }

    // 验证手机号唯一性（如果要更新手机号）
    if (phone && phone !== user.phone) {
      const existingUser = users.find(u => u.phone === phone && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '手机号已存在'
        });
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: '手机号格式不正确'
        });
      }
    }

    // 验证角色
    if (role) {
      const validRoles = ['管理员', '操作员', '维护员', '观察员'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: '无效的用户角色'
        });
      }
    }

    // 验证状态
    if (status) {
      const validStatuses = ['激活', '禁用', '锁定'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: '无效的用户状态'
        });
      }
    }

    // 更新用户信息
    const updatedFields = {};
    if (username !== undefined) updatedFields.username = username;
    if (email !== undefined) updatedFields.email = email;
    if (phone !== undefined) updatedFields.phone = phone;
    if (role !== undefined) updatedFields.role = role;
    if (department !== undefined) updatedFields.department = department;
    if (position !== undefined) updatedFields.position = position;
    if (status !== undefined) updatedFields.status = status;
    if (avatar !== undefined) updatedFields.avatar = avatar;

    // 更新时间戳
    updatedFields.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    // 应用更新
    Object.assign(users[userIndex], updatedFields);

    // 移除密码字段
    const { password, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 修改用户密码
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '旧密码和新密码为必填字段'
      });
    }

    const userIndex = users.findIndex(u => u.id === id || u.userId === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[userIndex];

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '旧密码不正确'
      });
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度至少6位'
      });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 重置用户密码（管理员功能）
router.put('/:id/reset-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword = '123456' } = req.body;

    const userIndex = users.findIndex(u => u.id === id || u.userId === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 验证新密码强度
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度至少6位'
      });
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '密码重置成功',
      data: {
        newPassword: newPassword
      }
    });

  } catch (error) {
    console.error('重置密码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除用户
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === id || u.userId === id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 删除用户
    const deletedUser = users.splice(userIndex, 1)[0];

    // 移除密码字段
    const { password, ...userWithoutPassword } = deletedUser;

    res.json({
      success: true,
      message: '用户删除成功',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 批量删除用户
router.delete('/batch/delete', (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的用户ID列表'
      });
    }

    const deletedUsers = [];
    const notFoundIds = [];

    // 从后往前删除，避免索引变化问题
    for (let i = users.length - 1; i >= 0; i--) {
      const user = users[i];
      if (ids.includes(user.id) || ids.includes(user.userId)) {
        const deletedUser = users.splice(i, 1)[0];
        const { password, ...userWithoutPassword } = deletedUser;
        deletedUsers.push(userWithoutPassword);
      }
    }

    // 检查未找到的ID
    ids.forEach(id => {
      const found = deletedUsers.some(user => user.id === id || user.userId === id);
      if (!found) {
        notFoundIds.push(id);
      }
    });

    res.json({
      success: true,
      message: `成功删除 ${deletedUsers.length} 个用户`,
      data: {
        deletedUsers,
        notFoundIds,
        deletedCount: deletedUsers.length
      }
    });

  } catch (error) {
    console.error('批量删除用户错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取用户统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const thisWeek = now.startOf('week').format('YYYY-MM-DD');
    const thisMonth = now.startOf('month').format('YYYY-MM-DD');

    const stats = {
      total: users.length,
      active: users.filter(u => u.status === '激活').length,
      disabled: users.filter(u => u.status === '禁用').length,
      locked: users.filter(u => u.status === '锁定').length,
      roleDistribution: {
        admin: users.filter(u => u.role === '管理员').length,
        operator: users.filter(u => u.role === '操作员').length,
        maintainer: users.filter(u => u.role === '维护员').length,
        observer: users.filter(u => u.role === '观察员').length
      },
      registrationTrend: {
        today: users.filter(u => moment(u.createdAt).format('YYYY-MM-DD') === today).length,
        thisWeek: users.filter(u => moment(u.createdAt).format('YYYY-MM-DD') >= thisWeek).length,
        thisMonth: users.filter(u => moment(u.createdAt).format('YYYY-MM-DD') >= thisMonth).length
      },
      loginStats: {
        totalLogins: users.reduce((sum, u) => sum + (u.loginCount || 0), 0),
        averageLogins: Math.round(
          users.reduce((sum, u) => sum + (u.loginCount || 0), 0) / users.length
        ),
        recentlyActive: users.filter(u => 
          u.lastLoginTime && moment(u.lastLoginTime).isAfter(moment().subtract(7, 'days'))
        ).length
      }
    };

    res.json({
      success: true,
      message: '获取用户统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取用户统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新用户资料（当前登录用户）
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id; // 从JWT token中获取用户ID
    const {
      username,
      email,
      phone,
      avatar
    } = req.body;

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[userIndex];

    // 验证用户名唯一性（如果要更新用户名）
    if (username && username !== user.username) {
      const existingUser = users.find(u => u.username === username && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名已存在'
        });
      }
    }

    // 验证邮箱唯一性（如果要更新邮箱）
    if (email && email !== user.email) {
      const existingUser = users.find(u => u.email === email && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '邮箱已存在'
        });
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }
    }

    // 验证手机号唯一性（如果要更新手机号）
    if (phone && phone !== user.phone) {
      const existingUser = users.find(u => u.phone === phone && u.id !== user.id);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '手机号已存在'
        });
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: '手机号格式不正确'
        });
      }
    }

    // 更新用户信息
    const updatedFields = {};
    if (username !== undefined) updatedFields.username = username;
    if (email !== undefined) updatedFields.email = email;
    if (phone !== undefined) updatedFields.phone = phone;
    if (avatar !== undefined) updatedFields.avatar = avatar;

    // 更新时间戳
    updatedFields.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    // 应用更新
    Object.assign(users[userIndex], updatedFields);

    // 移除密码字段
    const { password, ...userWithoutPassword } = users[userIndex];

    res.json({
      success: true,
      message: '用户资料更新成功',
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('更新用户资料错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取角色列表
router.get('/roles/list', (req, res) => {
  try {
    const roles = ['管理员', '操作员', '维护员', '观察员'];
    
    res.json({
      success: true,
      message: '获取角色列表成功',
      data: roles
    });

  } catch (error) {
    console.error('获取角色列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;