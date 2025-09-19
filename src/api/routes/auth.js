const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { users } = require('../data/mockData');

const router = express.Router();

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 支持用户名或邮箱登录
    const loginField = username || email;

    // 验证输入
    if (!loginField || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名/邮箱和密码不能为空'
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = users.find(u => u.email === loginField || u.username === loginField);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在或密码错误'
      });
    }

    // 检查是否为测试账号（免验证登录）
    const isTestAccount = user.username === '测试用户' && password === 'test123';
    
    // 验证密码（测试账号跳过密码验证）
    if (!isTestAccount) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: '用户不存在或密码错误'
        });
      }
    }

    // 生成JWT令牌
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      req.app.locals.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 返回用户信息和令牌
    const { password: _, ...userInfo } = user;
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: userInfo,
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, verificationCode } = req.body;

    // 验证输入
    if (!username || !email || !password || !phone || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: '所有字段都是必填的'
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

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度不能少于6位'
      });
    }

    // 检查用户是否已存在
    const existingUser = users.find(u => u.email === email || u.phone === phone);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户已存在'
      });
    }

    // 验证验证码（这里简单验证为6位数字）
    if (!/^\d{6}$/.test(verificationCode)) {
      return res.status(400).json({
        success: false,
        message: '验证码格式不正确'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      username,
      phone,
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      role: '普通用户',
      permissions: ['监控查看'],
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到用户列表
    users.push(newUser);

    // 返回成功信息（不返回密码）
    const { password: _, ...userInfo } = newUser;
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: userInfo
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 发送验证码
router.post('/send-verification', (req, res) => {
  try {
    const { phone } = req.body;

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号格式不正确'
      });
    }

    // 生成6位随机验证码
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 这里应该调用短信服务发送验证码
    // 为了演示，我们只是返回成功信息
    console.log(`发送验证码 ${verificationCode} 到手机号 ${phone}`);

    res.json({
      success: true,
      message: '验证码发送成功',
      data: {
        // 在实际生产环境中，不应该返回验证码
        // 这里仅用于演示
        verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      }
    });

  } catch (error) {
    console.error('发送验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证令牌
router.get('/verify-token', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    jwt.verify(token, req.app.locals.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: '令牌无效或已过期'
        });
      }

      // 查找用户
      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '用户不存在'
        });
      }

      const { password: _, ...userInfo } = user;
      res.json({
        success: true,
        message: '令牌有效',
        data: {
          user: userInfo
        }
      });
    });

  } catch (error) {
    console.error('验证令牌错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证验证码
router.post('/verify-code', (req, res) => {
  try {
    const { phone, code } = req.body;

    // 验证输入
    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        message: '手机号和验证码不能为空'
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

    // 验证验证码格式
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: '验证码格式不正确'
      });
    }

    // 这里应该验证验证码是否正确
    // 为了演示，我们简单验证
    if (code === '123456') {
      res.json({
        success: true,
        message: '验证码验证成功'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '验证码错误'
      });
    }

  } catch (error) {
    console.error('验证验证码错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 用户登出
router.post('/logout', (req, res) => {
  // 在实际应用中，可能需要将令牌加入黑名单
  // 这里简单返回成功信息
  res.json({
    success: true,
    message: '登出成功'
  });
});

module.exports = router;