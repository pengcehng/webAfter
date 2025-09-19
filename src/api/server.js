const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

// 导入路由
const authRoutes = require('./routes/auth');
const equipmentRoutes = require('./routes/equipment');
const monitoringRoutes = require('./routes/monitoring');
const cleaningTaskRoutes = require('./routes/cleaningTask');
const maintenanceRoutes = require('./routes/maintenance');
const alarmRoutes = require('./routes/alarm');
const statisticsRoutes = require('./routes/statistics');
const userRoutes = require('./routes/users');
const stateRoutes = require('./routes/state');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// JWT密钥
const JWT_SECRET = 'camera_cleaning_system_secret_key_2024';

// JWT验证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '令牌无效' });
    }
    req.user = user;
    next();
  });
};

// 全局变量，用于存储JWT密钥
app.locals.JWT_SECRET = JWT_SECRET;

// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/equipment', authenticateToken, equipmentRoutes);
app.use('/api/monitoring', authenticateToken, monitoringRoutes);
app.use('/api/cleaning-tasks', authenticateToken, cleaningTaskRoutes);
app.use('/api/maintenance', authenticateToken, maintenanceRoutes);
app.use('/api/alarms', authenticateToken, alarmRoutes);
app.use('/api/statistics', authenticateToken, statisticsRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/state', authenticateToken, stateRoutes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '摄像头清洁设备管理系统API服务正常运行',
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    version: '1.0.0'
  });
});

// 根路径
app.get('/', (req, res) => {
  res.json({
    message: '欢迎使用摄像头清洁设备管理系统API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      equipment: '/api/equipment',
      monitoring: '/api/monitoring',
      cleaningTasks: '/api/cleaning-tasks',
      maintenance: '/api/maintenance',
      alarms: '/api/alarms',
      statistics: '/api/statistics',
      users: '/api/users',
      state: '/api/state',
      health: '/api/health'
    }
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : '请联系系统管理员'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    message: '请求的资源不存在',
    path: req.originalUrl
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 摄像头清洁设备管理系统API服务器启动成功!`);
  console.log(`📍 服务器地址: http://localhost:${PORT}`);
  console.log(`📖 API文档: http://localhost:${PORT}/api`);
  console.log(`💚 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`⏰ 启动时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}\n`);
});

module.exports = app;