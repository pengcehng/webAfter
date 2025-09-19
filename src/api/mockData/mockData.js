// const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

// 简单的日期格式化函数，替代 moment
function formatDate(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function formatDateOnly(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return null;
  }
  return date.toISOString().slice(0, 10);
}

function subtractDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - days);
  return newDate;
}

function addDays(date, days) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

function subtractHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() - hours);
  return newDate;
}

function addMinutes(date, minutes) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() + minutes);
  return newDate;
}

function subtractMinutes(date, minutes) {
  const newDate = new Date(date);
  newDate.setMinutes(newDate.getMinutes() - minutes);
  return newDate;
}

function addHours(date, hours) {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

// 用户数据
const users = [
  {
    id: uuidv4(),
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    username: '系统管理员',
    phone: '13800138000',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: '超级管理员',
    permissions: ['设备管理', '用户管理', '监控查看', '数据统计'],
    createdAt: formatDate(subtractDays(new Date(), 30)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    email: 'user@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    username: '普通用户',
    phone: '13800138001',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: '操作员',
    permissions: ['设备管理', '监控查看'],
    createdAt: formatDate(subtractDays(new Date(), 20)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    email: 'test@test.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    username: '测试用户',
    phone: '13800138002',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: '测试员',
    permissions: ['监控查看'],
    createdAt: formatDate(subtractDays(new Date(), 10)),
    updatedAt: formatDate(new Date())
  }
];

// 设备数据
const equipment = [
  {
    id: uuidv4(),
    deviceId: 'CLEAN001',
    deviceName: '智能摄像头清洁机器人-Alpha',
    installationLocation: '大门入口摄像头',
    deviceStatus: '正常运行',
    deviceType: '智能机器人',
    cleaningMode: '自动清洁',
    batteryLevel: '85%',
    lastCleaningTime: formatDate(subtractDays(new Date(), 2)),
    nextScheduledCleaning: formatDate(addDays(new Date(), 1)),
    totalCleaningCount: 156,
    maintenanceStatus: '良好',
    createdAt: formatDate(subtractDays(new Date(), 60)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    deviceId: 'CLEAN002',
    deviceName: '高压水枪清洁设备-Beta',
    installationLocation: '停车场摄像头群',
    deviceStatus: '正常运行',
    deviceType: '高压水枪清洁器',
    cleaningMode: '定时清洁',
    waterPressure: '2.5MPa',
    lastCleaningTime: formatDate(subtractDays(new Date(), 3)),
    nextScheduledCleaning: formatDate(addDays(new Date(), 2)),
    totalCleaningCount: 89,
    maintenanceStatus: '需要检查',
    createdAt: formatDate(subtractDays(new Date(), 45)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    deviceId: 'CLEAN003',
    deviceName: '无人机清洁系统-Gamma',
    installationLocation: '办公楼高层摄像头',
    deviceStatus: '维护中',
    deviceType: '无人机系统',
    cleaningMode: '手动清洁',
    batteryLevel: '0%',
    lastCleaningTime: formatDate(subtractDays(new Date(), 4)),
    nextScheduledCleaning: formatDate(addDays(new Date(), 4)),
    totalCleaningCount: 67,
    maintenanceStatus: '电池更换中',
    createdAt: formatDate(subtractDays(new Date(), 30)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    deviceId: 'CLEAN004',
    deviceName: '超声波清洁器-Delta',
    installationLocation: '仓库区域摄像头',
    deviceStatus: '正常运行',
    deviceType: '超声波清洁器',
    cleaningMode: '自动清洁',
    cleaningFrequency: '2.4MHz',
    lastCleaningTime: formatDate(subtractDays(new Date(), 1)),
    nextScheduledCleaning: formatDate(addDays(new Date(), 1)),
    totalCleaningCount: 234,
    maintenanceStatus: '良好',
    createdAt: formatDate(subtractDays(new Date(), 50)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    deviceId: 'CLEAN005',
    deviceName: '智能清洁臂-Epsilon',
    installationLocation: '会议室摄像头',
    deviceStatus: '故障',
    deviceType: '机械臂清洁器',
    cleaningMode: '手动清洁',
    reachRadius: '1.5米',
    lastCleaningTime: formatDate(subtractDays(new Date(), 5)),
    nextScheduledCleaning: '待修复后安排',
    totalCleaningCount: 78,
    maintenanceStatus: '需要维修',
    createdAt: formatDate(subtractDays(new Date(), 40)),
    updatedAt: formatDate(new Date())
  }
];

// 清洁任务数据
const cleaningTasks = [
  {
    id: uuidv4(),
    taskId: 'TASK001',
    taskName: '大门入口摄像头定期清洁',
    deviceId: 'CLEAN001',
    deviceName: '智能摄像头清洁机器人-Alpha',
    taskType: '定期清洁',
    taskStatus: '已完成',
    priority: '中',
    status: '已完成',
    scheduledTime: formatDate(subtractDays(new Date(), 1)),
    actualStartTime: formatDate(addMinutes(subtractDays(new Date(), 1), 5)),
    actualEndTime: formatDate(addMinutes(subtractDays(new Date(), 1), 25)),
    duration: '20分钟',
    cleaningQuality: '优秀',
    assignedUser: '张三',
    operator: '张三',
    description: '定期清洁大门入口摄像头镜头',
    remarks: '清洁效果良好，镜头清晰度提升明显',
    createdAt: formatDate(subtractDays(new Date(), 2)),
    updatedAt: formatDate(subtractDays(new Date(), 1))
  },
  {
    id: uuidv4(),
    taskId: 'TASK002',
    taskName: '停车场摄像头群清洁',
    deviceId: 'CLEAN002',
    deviceName: '高压水枪清洁设备-Beta',
    taskType: '紧急清洁',
    taskStatus: '进行中',
    priority: '高',
    status: '进行中',
    scheduledTime: formatDate(new Date()),
    actualStartTime: formatDate(subtractMinutes(new Date(), 10)),
    actualEndTime: null,
    duration: '进行中',
    cleaningQuality: '待评估',
    assignedUser: '李四',
    operator: '李四',
    description: '停车场摄像头因沙尘暴需要紧急清洁',
    remarks: '沙尘暴导致镜头严重污染，需要深度清洁',
    createdAt: formatDate(subtractHours(new Date(), 1)),
    updatedAt: formatDate(subtractMinutes(new Date(), 10))
  },
  {
    id: uuidv4(),
    taskId: 'TASK003',
    taskName: '办公楼高层摄像头维护清洁',
    deviceId: 'CLEAN003',
    deviceName: '无人机清洁系统-Gamma',
    taskType: '维护清洁',
    taskStatus: '待执行',
    priority: '中',
    status: '待执行',
    scheduledTime: formatDate(addDays(new Date(), 2)),
    actualStartTime: null,
    actualEndTime: null,
    duration: '待执行',
    cleaningQuality: '待评估',
    assignedUser: '王五',
    operator: '王五',
    description: '办公楼高层摄像头月度维护清洁',
    remarks: '月度例行维护，检查设备运行状态',
    createdAt: formatDate(subtractDays(new Date(), 1)),
    updatedAt: formatDate(subtractDays(new Date(), 1))
  },
  {
    id: uuidv4(),
    taskId: 'TASK004',
    taskName: '仓库区域摄像头深度清洁',
    deviceId: 'CLEAN004',
    deviceName: '超声波清洁器-Delta',
    taskType: '深度清洁',
    taskStatus: '已完成',
    priority: '中',
    status: '已完成',
    scheduledTime: formatDate(subtractDays(new Date(), 3)),
    actualStartTime: formatDate(addMinutes(subtractDays(new Date(), 3), 2)),
    actualEndTime: formatDate(addMinutes(subtractDays(new Date(), 3), 35)),
    duration: '33分钟',
    cleaningQuality: '良好',
    assignedUser: '赵六',
    operator: '赵六',
    description: '仓库区域摄像头季度深度清洁',
    remarks: '使用超声波技术，清洁效果显著',
    createdAt: formatDate(subtractDays(new Date(), 4)),
    updatedAt: formatDate(subtractDays(new Date(), 3))
  },
  {
    id: uuidv4(),
    taskId: 'TASK005',
    taskName: '会议室摄像头紧急维修清洁',
    deviceId: 'CLEAN005',
    deviceName: '智能清洁臂-Epsilon',
    taskType: '紧急清洁',
    taskStatus: '待执行',
    priority: '高',
    status: '待执行',
    scheduledTime: formatDate(addHours(new Date(), 2)),
    actualStartTime: null,
    actualEndTime: null,
    duration: '待执行',
    cleaningQuality: '待评估',
    assignedUser: '孙七',
    operator: '孙七',
    description: '会议室摄像头故障后的清洁维护',
    remarks: '设备维修完成后需要进行清洁',
    createdAt: formatDate(subtractHours(new Date(), 3)),
    updatedAt: formatDate(subtractHours(new Date(), 3))
  }
];

// 维护保养记录数据
const maintenanceRecords = [
  {
    id: uuidv4(),
    recordId: 'MAINT001',
    maintenanceId: 'MAINT001',
    deviceId: 'CLEAN001',
    deviceName: '智能摄像头清洁机器人-Alpha',
    maintenanceType: '定期保养',
    maintenanceStatus: '已完成',
    status: '已完成',
    scheduledDate: formatDateOnly(subtractDays(new Date(), 7)),
    actualDate: formatDateOnly(subtractDays(new Date(), 7)),
    technician: '赵六',
    description: '更换清洁刷头，检查电池状态',
    cost: 150.00,
    parts: ['清洁刷头', '润滑油'],
    maintenanceItems: ['更换清洁刷头', '检查电池状态', '润滑机械部件'],
    nextMaintenanceDate: formatDateOnly(addDays(new Date(), 23)),
    remarks: '设备运行正常，清洁效果良好',
    createdAt: formatDate(subtractDays(new Date(), 8)),
    updatedAt: formatDate(subtractDays(new Date(), 7))
  },
  {
    id: uuidv4(),
    recordId: 'MAINT002',
    maintenanceId: 'MAINT002',
    deviceId: 'CLEAN003',
    deviceName: '无人机清洁系统-Gamma',
    maintenanceType: '故障维修',
    maintenanceStatus: '进行中',
    status: '进行中',
    scheduledDate: formatDateOnly(new Date()),
    actualDate: formatDateOnly(new Date()),
    technician: '孙八',
    description: '更换损坏的电池模块',
    cost: 800.00,
    parts: ['锂电池组', '充电器'],
    maintenanceItems: ['更换电池模块', '检查充电系统', '测试飞行性能'],
    nextMaintenanceDate: formatDateOnly(addDays(new Date(), 30)),
    remarks: '电池模块老化严重，需要更换',
    createdAt: formatDate(subtractDays(new Date(), 1)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    recordId: 'MAINT003',
    maintenanceId: 'MAINT003',
    deviceId: 'CLEAN002',
    deviceName: '高压水枪清洁设备-Beta',
    maintenanceType: '定期保养',
    maintenanceStatus: '计划中',
    status: '计划中',
    scheduledDate: formatDateOnly(addDays(new Date(), 3)),
    actualDate: null,
    technician: '李四',
    description: '高压泵维护和水路清洁',
    cost: 300.00,
    parts: ['高压泵密封件', '过滤器'],
    maintenanceItems: ['检查高压泵', '更换密封件', '清洁水路系统'],
    nextMaintenanceDate: formatDateOnly(addDays(new Date(), 93)),
    remarks: '设备运行时间较长，需要定期维护',
    createdAt: formatDate(subtractDays(new Date(), 2)),
    updatedAt: formatDate(subtractDays(new Date(), 2))
  },
  {
    id: uuidv4(),
    recordId: 'MAINT004',
    maintenanceId: 'MAINT004',
    deviceId: 'CLEAN004',
    deviceName: '超声波清洁器-Delta',
    maintenanceType: '电池更换',
    maintenanceStatus: '已完成',
    status: '已完成',
    scheduledDate: formatDateOnly(subtractDays(new Date(), 5)),
    actualDate: formatDateOnly(subtractDays(new Date(), 5)),
    technician: '王五',
    description: '更换超声波发生器电池',
    cost: 450.00,
    parts: ['超声波发生器电池', '电池连接线'],
    maintenanceItems: ['更换电池', '检查电路连接', '测试超声波功率'],
    nextMaintenanceDate: formatDateOnly(addDays(new Date(), 175)),
    remarks: '电池更换顺利，设备性能恢复正常',
    createdAt: formatDate(subtractDays(new Date(), 6)),
    updatedAt: formatDate(subtractDays(new Date(), 5))
  },
  {
    id: uuidv4(),
    recordId: 'MAINT005',
    maintenanceId: 'MAINT005',
    deviceId: 'CLEAN005',
    deviceName: '智能清洁臂-Epsilon',
    maintenanceType: '大修',
    maintenanceStatus: '待开始',
    status: '待开始',
    scheduledDate: formatDateOnly(addDays(new Date(), 7)),
    actualDate: null,
    technician: '张三',
    description: '机械臂大修和控制系统升级',
    cost: 1200.00,
    parts: ['伺服电机', '控制板', '传感器'],
    maintenanceItems: ['更换伺服电机', '升级控制系统', '校准传感器', '测试运动精度'],
    nextMaintenanceDate: formatDateOnly(addDays(new Date(), 187)),
    remarks: '设备故障较多，需要进行大修',
    createdAt: formatDate(subtractDays(new Date(), 3)),
    updatedAt: formatDate(subtractDays(new Date(), 3))
  }
];

// 报警数据
const alarms = [
  {
    id: uuidv4(),
    alarmId: 'ALARM001',
    deviceId: 'CLEAN005',
    deviceName: '智能清洁臂-Epsilon',
    alarmType: '设备故障',
    severity: '高',
    status: '未处理',
    message: '机械臂运动异常，疑似电机故障',
    timestamp: formatDate(subtractHours(new Date(), 2)),
    acknowledgedBy: null,
    acknowledgedAt: null,
    resolvedBy: null,
    resolvedAt: null,
    createdAt: formatDate(subtractHours(new Date(), 2)),
    updatedAt: formatDate(subtractHours(new Date(), 2))
  },
  {
    id: uuidv4(),
    alarmId: 'ALARM002',
    deviceId: 'CLEAN002',
    deviceName: '高压水枪清洁设备-Beta',
    alarmType: '维护提醒',
    severity: '中',
    status: '已确认',
    message: '设备运行时间超过500小时，建议进行维护检查',
    timestamp: formatDate(subtractDays(new Date(), 1)),
    acknowledgedBy: '李四',
    acknowledgedAt: formatDate(addHours(subtractDays(new Date(), 1), 1)),
    resolvedBy: null,
    resolvedAt: null,
    createdAt: formatDate(subtractDays(new Date(), 1)),
    updatedAt: formatDate(addHours(subtractDays(new Date(), 1), 1))
  },
  {
    id: uuidv4(),
    alarmId: 'ALARM003',
    deviceId: 'CLEAN001',
    deviceName: '智能摄像头清洁机器人-Alpha',
    alarmType: '电量不足',
    severity: '低',
    status: '已解决',
    message: '设备电量低于20%，已自动返回充电',
    timestamp: formatDate(subtractDays(new Date(), 3)),
    acknowledgedBy: '张三',
    acknowledgedAt: formatDate(addMinutes(subtractDays(new Date(), 3), 30)),
    resolvedBy: '张三',
    resolvedAt: formatDate(addHours(subtractDays(new Date(), 3), 2)),
    createdAt: formatDate(subtractDays(new Date(), 3)),
    updatedAt: formatDate(addHours(subtractDays(new Date(), 3), 2))
  }
];

// 监控数据
const monitoringData = [
  {
    id: uuidv4(),
    cameraId: 'CAM001',
    cameraName: '大门入口监控',
    location: '大门入口',
    status: '在线',
    cleaningDeviceId: 'CLEAN001',
    lastCleaningTime: formatDate(subtractDays(new Date(), 2)),
    imageQuality: '优秀',
    cleanlinessScore: 95,
    streamUrl: 'rtmp://localhost:1935/live/cam001',
    createdAt: formatDate(subtractDays(new Date(), 60)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    cameraId: 'CAM002',
    cameraName: '停车场监控群',
    location: '停车场',
    status: '在线',
    cleaningDeviceId: 'CLEAN002',
    lastCleaningTime: formatDate(subtractDays(new Date(), 3)),
    imageQuality: '良好',
    cleanlinessScore: 78,
    streamUrl: 'rtmp://localhost:1935/live/cam002',
    createdAt: formatDate(subtractDays(new Date(), 45)),
    updatedAt: formatDate(new Date())
  },
  {
    id: uuidv4(),
    cameraId: 'CAM003',
    cameraName: '办公楼高层监控',
    location: '办公楼高层',
    status: '离线',
    cleaningDeviceId: 'CLEAN003',
    lastCleaningTime: formatDate(subtractDays(new Date(), 4)),
    imageQuality: '较差',
    cleanlinessScore: 45,
    streamUrl: 'rtmp://localhost:1935/live/cam003',
    createdAt: formatDate(subtractDays(new Date(), 30)),
    updatedAt: formatDate(new Date())
  }
];

// 统计数据
const statistics = {
  overview: {
    totalDevices: equipment.length,
    onlineDevices: equipment.filter(e => e.deviceStatus === '正常运行').length,
    offlineDevices: equipment.filter(e => e.deviceStatus === '故障' || e.deviceStatus === '维护中').length,
    totalCleaningTasks: cleaningTasks.length,
    completedTasks: cleaningTasks.filter(t => t.status === '已完成').length,
    inProgressTasks: cleaningTasks.filter(t => t.status === '进行中').length,
    totalMaintenanceRecords: maintenanceRecords.length
  },
  deviceStatus: {
    normal: equipment.filter(e => e.deviceStatus === '正常运行').length,
    maintenance: equipment.filter(e => e.deviceStatus === '维护中').length,
    fault: equipment.filter(e => e.deviceStatus === '故障').length
  },
  cleaningEfficiency: {
    dailyTasks: 15,
    weeklyTasks: 89,
    monthlyTasks: 356,
    averageTaskDuration: 22, // 分钟
    successRate: 96.5 // 百分比
  },
  maintenanceCosts: {
    thisMonth: 2450.00,
    lastMonth: 1890.00,
    thisYear: 18750.00,
    averagePerDevice: 375.00
  },
  // 为数据统计页面添加详细数据
  statisticsData: {
    deviceStats: {
      total: equipment.length,
      online: equipment.filter(e => e.deviceStatus === '正常运行').length,
      offline: equipment.filter(e => e.deviceStatus === '故障' || e.deviceStatus === '维护中').length
    },
    cleaningStats: {
      totalCleanings: 1247,
      thisMonth: 156,
      avgPerDevice: Math.round(1247 / equipment.length)
    },
    storageStats: {
      usageRate: '68%',
      usedCapacity: '2.1TB',
      totalCapacity: '3.0TB',
      freeCapacity: '0.9TB'
    },
    runtimeStats: {
      uptimeRate: '96.8%',
      totalRuntime: '8760小时',
      avgDailyRuntime: '23.2小时',
      longestRuntime: '720小时'
    },
    monthlyTrends: [
      { month: '1月', devices: 5, cleanings: 89, runtime: 720 },
      { month: '2月', devices: 5, cleanings: 95, runtime: 672 },
      { month: '3月', devices: 5, cleanings: 102, runtime: 744 },
      { month: '4月', devices: 5, cleanings: 98, runtime: 720 },
      { month: '5月', devices: 5, cleanings: 115, runtime: 744 },
      { month: '6月', devices: 5, cleanings: 108, runtime: 720 },
      { month: '7月', devices: 5, cleanings: 125, runtime: 744 },
      { month: '8月', devices: 5, cleanings: 132, runtime: 744 },
      { month: '9月', devices: 5, cleanings: 118, runtime: 720 },
      { month: '10月', devices: 5, cleanings: 142, runtime: 744 },
      { month: '11月', devices: 5, cleanings: 135, runtime: 720 },
      { month: '12月', devices: 5, cleanings: 128, runtime: 744 }
    ],
    cleaningRecords: [
      { deviceId: 'CLEAN001', location: '大门入口', cleanings: 156, lastCleaning: '2024-01-15' },
      { deviceId: 'CLEAN002', location: '停车场', cleanings: 89, lastCleaning: '2024-01-14' },
      { deviceId: 'CLEAN003', location: '办公楼高层', cleanings: 67, lastCleaning: '2024-01-12' },
      { deviceId: 'CLEAN004', location: '仓库区域', cleanings: 234, lastCleaning: '2024-01-16' },
      { deviceId: 'CLEAN005', location: '会议室', cleanings: 78, lastCleaning: '2024-01-11' }
    ],
    performanceMetrics: [
      { metric: 'CPU使用率', value: '45%', status: 'normal' },
      { metric: '内存使用率', value: '62%', status: 'normal' },
      { metric: '网络延迟', value: '12ms', status: 'good' },
      { metric: '磁盘I/O', value: '78%', status: 'warning' },
      { metric: '温度', value: '42°C', status: 'normal' }
    ],
    alarmStats: [
      { type: '设备故障', count: 3, severity: 'high' },
      { type: '维护提醒', count: 8, severity: 'medium' },
      { type: '电量不足', count: 12, severity: 'low' },
      { type: '网络异常', count: 2, severity: 'high' },
      { type: '温度异常', count: 1, severity: 'medium' }
    ]
  }
};

module.exports = {
  users,
  equipment,
  cleaningTasks,
  maintenanceRecords,
  alarms,
  monitoringData,
  statistics,
  // 为了兼容现有代码结构，添加以下数据结构
  cleaningTaskData: {
    taskList: cleaningTasks
  },
  equipmentData: {
    equipmentList: equipment
  },
  maintenanceData: {
    recordList: maintenanceRecords,
    maintenanceList: maintenanceRecords
  },
  // 添加统计数据的直接引用
  statisticsData: statistics.statisticsData
};