const express = require('express');
const moment = require('moment');
const { statistics, equipmentData, cleaningTasks, maintenanceRecords, alarms, monitoringData, deviceStates } = require('../data/mockData');

const router = express.Router();

// 获取总体统计信息
router.get('/overview', (req, res) => {
  try {
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const thisWeek = now.startOf('week').format('YYYY-MM-DD');
    const thisMonth = now.startOf('month').format('YYYY-MM-DD');

    const overview = {
      equipment: {
        total: equipmentData.length,
        online: equipmentData.filter(e => e.deviceStatus === '正常').length,
        offline: equipmentData.filter(e => e.deviceStatus === '离线').length,
        fault: equipmentData.filter(e => e.deviceStatus === '故障').length,
        maintenance: equipmentData.filter(e => e.deviceStatus === '维护中').length
      },
      cleaning: {
        total: cleaningTasks.length,
        pending: cleaningTasks.filter(t => t.status === '待执行').length,
        inProgress: cleaningTasks.filter(t => t.status === '执行中').length,
        completed: cleaningTasks.filter(t => t.status === '已完成').length,
        cancelled: cleaningTasks.filter(t => t.status === '已取消').length,
        todayCompleted: cleaningTasks.filter(t => 
          t.status === '已完成' && moment(t.completedAt).format('YYYY-MM-DD') === today
        ).length
      },
      maintenance: {
        total: maintenanceRecords.length,
        planned: maintenanceRecords.filter(m => m.status === '计划中').length,
        inProgress: maintenanceRecords.filter(m => m.status === '进行中').length,
        completed: maintenanceRecords.filter(m => m.status === '已完成').length,
        totalCost: maintenanceRecords
          .filter(m => m.status === '已完成')
          .reduce((sum, m) => sum + (m.cost || 0), 0)
      },
      alarms: {
        total: alarms.length,
        unprocessed: alarms.filter(a => a.status === '未处理').length,
        acknowledged: alarms.filter(a => a.status === '已确认').length,
        resolved: alarms.filter(a => a.status === '已解决').length,
        todayAlarms: alarms.filter(a => 
          moment(a.timestamp).format('YYYY-MM-DD') === today
        ).length
      },
      monitoring: {
        total: monitoringData.length,
        online: monitoringData.filter(m => m.status === '在线').length,
        offline: monitoringData.filter(m => m.status === '离线').length,
        averageCleanliness: Math.round(
          monitoringData.reduce((sum, m) => sum + m.cleanlinessScore, 0) / monitoringData.length
        )
      }
    };

    res.json({
      success: true,
      message: '获取总体统计信息成功',
      data: overview
    });

  } catch (error) {
    console.error('获取总体统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取设备统计信息
router.get('/equipment', (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    let startDate;
    const endDate = moment();
    
    switch (timeRange) {
      case '1d':
        startDate = moment().subtract(1, 'day');
        break;
      case '7d':
        startDate = moment().subtract(7, 'days');
        break;
      case '30d':
        startDate = moment().subtract(30, 'days');
        break;
      case '90d':
        startDate = moment().subtract(90, 'days');
        break;
      default:
        startDate = moment().subtract(7, 'days');
    }

    const equipmentStats = {
      statusDistribution: {
        normal: equipmentData.filter(e => e.deviceStatus === '正常').length,
        offline: equipmentData.filter(e => e.deviceStatus === '离线').length,
        fault: equipmentData.filter(e => e.deviceStatus === '故障').length,
        maintenance: equipmentData.filter(e => e.deviceStatus === '维护中').length
      },
      typeDistribution: {},
      locationDistribution: {},
      maintenanceStatusDistribution: {
        normal: equipmentData.filter(e => e.maintenanceStatus === '正常').length,
        warning: equipmentData.filter(e => e.maintenanceStatus === '预警').length,
        urgent: equipmentData.filter(e => e.maintenanceStatus === '紧急').length
      },
      cleaningFrequency: {
        high: equipmentData.filter(e => e.cleaningFrequency === '高频').length,
        medium: equipmentData.filter(e => e.cleaningFrequency === '中频').length,
        low: equipmentData.filter(e => e.cleaningFrequency === '低频').length
      },
      totalCleaningCount: equipmentData.reduce((sum, e) => sum + (e.totalCleaningCount || 0), 0),
      averageCleaningCount: Math.round(
        equipmentData.reduce((sum, e) => sum + (e.totalCleaningCount || 0), 0) / equipmentData.length
      )
    };

    // 计算设备类型分布
    equipmentData.forEach(equipment => {
      const type = equipment.deviceName.split('清洁')[0] + '清洁设备';
      equipmentStats.typeDistribution[type] = (equipmentStats.typeDistribution[type] || 0) + 1;
    });

    // 计算位置分布
    equipmentData.forEach(equipment => {
      const location = equipment.installationLocation;
      equipmentStats.locationDistribution[location] = (equipmentStats.locationDistribution[location] || 0) + 1;
    });

    res.json({
      success: true,
      message: '获取设备统计信息成功',
      data: equipmentStats
    });

  } catch (error) {
    console.error('获取设备统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取清洁任务统计信息
router.get('/cleaning', (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    let startDate;
    const endDate = moment();
    
    switch (timeRange) {
      case '1d':
        startDate = moment().subtract(1, 'day');
        break;
      case '7d':
        startDate = moment().subtract(7, 'days');
        break;
      case '30d':
        startDate = moment().subtract(30, 'days');
        break;
      case '90d':
        startDate = moment().subtract(90, 'days');
        break;
      default:
        startDate = moment().subtract(7, 'days');
    }

    // 过滤时间范围内的任务
    const filteredTasks = cleaningTasks.filter(task => {
      const taskDate = moment(task.createdAt);
      return taskDate.isBetween(startDate, endDate, null, '[]');
    });

    const cleaningStats = {
      statusDistribution: {
        pending: filteredTasks.filter(t => t.status === '待执行').length,
        inProgress: filteredTasks.filter(t => t.status === '执行中').length,
        completed: filteredTasks.filter(t => t.status === '已完成').length,
        cancelled: filteredTasks.filter(t => t.status === '已取消').length
      },
      priorityDistribution: {
        high: filteredTasks.filter(t => t.priority === '高').length,
        medium: filteredTasks.filter(t => t.priority === '中').length,
        low: filteredTasks.filter(t => t.priority === '低').length
      },
      typeDistribution: {
        scheduled: filteredTasks.filter(t => t.taskType === '定时清洁').length,
        manual: filteredTasks.filter(t => t.taskType === '手动清洁').length,
        emergency: filteredTasks.filter(t => t.taskType === '紧急清洁').length
      },
      completionRate: filteredTasks.length > 0 ? 
        Math.round((filteredTasks.filter(t => t.status === '已完成').length / filteredTasks.length) * 100) : 0,
      averageDuration: filteredTasks
        .filter(t => t.status === '已完成' && t.startedAt && t.completedAt)
        .reduce((sum, t, _, arr) => {
          const duration = moment(t.completedAt).diff(moment(t.startedAt), 'minutes');
          return sum + duration / arr.length;
        }, 0),
      dailyTrend: []
    };

    // 生成每日趋势数据
    const days = Math.min(parseInt(timeRange), 30);
    for (let i = days - 1; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const dayTasks = filteredTasks.filter(t => 
        moment(t.createdAt).format('YYYY-MM-DD') === date
      );
      
      cleaningStats.dailyTrend.push({
        date,
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.status === '已完成').length,
        pending: dayTasks.filter(t => t.status === '待执行').length,
        inProgress: dayTasks.filter(t => t.status === '执行中').length
      });
    }

    res.json({
      success: true,
      message: '获取清洁任务统计信息成功',
      data: cleaningStats
    });

  } catch (error) {
    console.error('获取清洁任务统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取维护统计信息
router.get('/maintenance', (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    let startDate;
    const endDate = moment();
    
    switch (timeRange) {
      case '1d':
        startDate = moment().subtract(1, 'day');
        break;
      case '7d':
        startDate = moment().subtract(7, 'days');
        break;
      case '30d':
        startDate = moment().subtract(30, 'days');
        break;
      case '90d':
        startDate = moment().subtract(90, 'days');
        break;
      default:
        startDate = moment().subtract(7, 'days');
    }

    // 过滤时间范围内的维护记录
    const filteredRecords = maintenanceRecords.filter(record => {
      const recordDate = moment(record.createdAt);
      return recordDate.isBetween(startDate, endDate, null, '[]');
    });

    const maintenanceStats = {
      statusDistribution: {
        planned: filteredRecords.filter(m => m.status === '计划中').length,
        inProgress: filteredRecords.filter(m => m.status === '进行中').length,
        completed: filteredRecords.filter(m => m.status === '已完成').length
      },
      typeDistribution: {
        preventive: filteredRecords.filter(m => m.maintenanceType === '预防性维护').length,
        corrective: filteredRecords.filter(m => m.maintenanceType === '纠正性维护').length,
        emergency: filteredRecords.filter(m => m.maintenanceType === '紧急维护').length
      },
      costStats: {
        total: filteredRecords
          .filter(m => m.status === '已完成')
          .reduce((sum, m) => sum + (m.cost || 0), 0),
        average: filteredRecords
          .filter(m => m.status === '已完成' && m.cost)
          .reduce((sum, m, _, arr) => sum + (m.cost / arr.length), 0),
        byType: {}
      },
      completionRate: filteredRecords.length > 0 ? 
        Math.round((filteredRecords.filter(m => m.status === '已完成').length / filteredRecords.length) * 100) : 0,
      averageDuration: filteredRecords
        .filter(m => m.status === '已完成' && m.startedAt && m.completedAt)
        .reduce((sum, m, _, arr) => {
          const duration = moment(m.completedAt).diff(moment(m.startedAt), 'hours');
          return sum + duration / arr.length;
        }, 0),
      monthlyTrend: []
    };

    // 计算各类型维护成本
    ['预防性维护', '纠正性维护', '紧急维护'].forEach(type => {
      const typeCost = filteredRecords
        .filter(m => m.maintenanceType === type && m.status === '已完成')
        .reduce((sum, m) => sum + (m.cost || 0), 0);
      maintenanceStats.costStats.byType[type] = typeCost;
    });

    // 生成月度趋势数据
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, 'months').format('YYYY-MM');
      const monthRecords = filteredRecords.filter(m => 
        moment(m.createdAt).format('YYYY-MM') === month
      );
      
      maintenanceStats.monthlyTrend.push({
        month,
        total: monthRecords.length,
        completed: monthRecords.filter(m => m.status === '已完成').length,
        cost: monthRecords
          .filter(m => m.status === '已完成')
          .reduce((sum, m) => sum + (m.cost || 0), 0)
      });
    }

    res.json({
      success: true,
      message: '获取维护统计信息成功',
      data: maintenanceStats
    });

  } catch (error) {
    console.error('获取维护统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取报警统计信息
router.get('/alarms', (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    
    let startDate;
    const endDate = moment();
    
    switch (timeRange) {
      case '1d':
        startDate = moment().subtract(1, 'day');
        break;
      case '7d':
        startDate = moment().subtract(7, 'days');
        break;
      case '30d':
        startDate = moment().subtract(30, 'days');
        break;
      case '90d':
        startDate = moment().subtract(90, 'days');
        break;
      default:
        startDate = moment().subtract(7, 'days');
    }

    // 过滤时间范围内的报警
    const filteredAlarms = alarms.filter(alarm => {
      const alarmDate = moment(alarm.timestamp);
      return alarmDate.isBetween(startDate, endDate, null, '[]');
    });

    const alarmStats = {
      statusDistribution: {
        unprocessed: filteredAlarms.filter(a => a.status === '未处理').length,
        acknowledged: filteredAlarms.filter(a => a.status === '已确认').length,
        resolved: filteredAlarms.filter(a => a.status === '已解决').length
      },
      severityDistribution: {
        emergency: filteredAlarms.filter(a => a.severity === '紧急').length,
        high: filteredAlarms.filter(a => a.severity === '高').length,
        medium: filteredAlarms.filter(a => a.severity === '中').length,
        low: filteredAlarms.filter(a => a.severity === '低').length
      },
      typeDistribution: {
        fault: filteredAlarms.filter(a => a.alarmType === '设备故障').length,
        maintenance: filteredAlarms.filter(a => a.alarmType === '维护提醒').length,
        battery: filteredAlarms.filter(a => a.alarmType === '电量不足').length,
        communication: filteredAlarms.filter(a => a.alarmType === '通信异常').length
      },
      resolutionRate: filteredAlarms.length > 0 ? 
        Math.round((filteredAlarms.filter(a => a.status === '已解决').length / filteredAlarms.length) * 100) : 0,
      averageResolutionTime: filteredAlarms
        .filter(a => a.status === '已解决' && a.timestamp && a.resolvedAt)
        .reduce((sum, a, _, arr) => {
          const duration = moment(a.resolvedAt).diff(moment(a.timestamp), 'hours');
          return sum + duration / arr.length;
        }, 0),
      hourlyDistribution: []
    };

    // 生成24小时分布数据
    for (let hour = 0; hour < 24; hour++) {
      const hourAlarms = filteredAlarms.filter(a => 
        moment(a.timestamp).hour() === hour
      );
      
      alarmStats.hourlyDistribution.push({
        hour,
        count: hourAlarms.length
      });
    }

    res.json({
      success: true,
      message: '获取报警统计信息成功',
      data: alarmStats
    });

  } catch (error) {
    console.error('获取报警统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取监控统计信息
router.get('/monitoring', (req, res) => {
  try {
    const monitoringStats = {
      statusDistribution: {
        online: monitoringData.filter(m => m.status === '在线').length,
        offline: monitoringData.filter(m => m.status === '离线').length
      },
      cleanlinessStats: {
        excellent: monitoringData.filter(m => m.cleanlinessScore >= 90).length,
        good: monitoringData.filter(m => m.cleanlinessScore >= 70 && m.cleanlinessScore < 90).length,
        fair: monitoringData.filter(m => m.cleanlinessScore >= 50 && m.cleanlinessScore < 70).length,
        poor: monitoringData.filter(m => m.cleanlinessScore < 50).length,
        average: Math.round(
          monitoringData.reduce((sum, m) => sum + m.cleanlinessScore, 0) / monitoringData.length
        )
      },
      locationDistribution: {},
      recentTrend: []
    };

    // 计算位置分布
    monitoringData.forEach(monitor => {
      const location = monitor.location;
      monitoringStats.locationDistribution[location] = (monitoringStats.locationDistribution[location] || 0) + 1;
    });

    // 生成最近7天的清洁度趋势
    for (let i = 6; i >= 0; i--) {
      const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
      const dayData = monitoringData.filter(m => 
        moment(m.lastUpdated).format('YYYY-MM-DD') === date
      );
      
      const avgCleanliness = dayData.length > 0 ? 
        Math.round(dayData.reduce((sum, m) => sum + m.cleanlinessScore, 0) / dayData.length) : 0;
      
      monitoringStats.recentTrend.push({
        date,
        averageCleanliness: avgCleanliness,
        onlineCount: dayData.filter(m => m.status === '在线').length
      });
    }

    res.json({
      success: true,
      message: '获取监控统计信息成功',
      data: monitoringStats
    });

  } catch (error) {
    console.error('获取监控统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取自定义统计报告
router.post('/custom-report', (req, res) => {
  try {
    const {
      startDate,
      endDate,
      modules = ['equipment', 'cleaning', 'maintenance', 'alarms'],
      groupBy = 'day'
    } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: '开始日期和结束日期为必填字段'
      });
    }

    const start = moment(startDate);
    const end = moment(endDate);
    
    if (start.isAfter(end)) {
      return res.status(400).json({
        success: false,
        message: '开始日期不能晚于结束日期'
      });
    }

    const report = {
      period: {
        startDate,
        endDate,
        duration: end.diff(start, 'days') + 1
      },
      summary: {},
      trends: []
    };

    // 生成汇总数据
    if (modules.includes('equipment')) {
      report.summary.equipment = {
        total: equipmentData.length,
        statusDistribution: {
          normal: equipmentData.filter(e => e.deviceStatus === '正常').length,
          offline: equipmentData.filter(e => e.deviceStatus === '离线').length,
          fault: equipmentData.filter(e => e.deviceStatus === '故障').length,
          maintenance: equipmentData.filter(e => e.deviceStatus === '维护中').length
        }
      };
    }

    if (modules.includes('cleaning')) {
      const periodTasks = cleaningTasks.filter(t => {
        const taskDate = moment(t.createdAt);
        return taskDate.isBetween(start, end, null, '[]');
      });
      
      report.summary.cleaning = {
        total: periodTasks.length,
        completed: periodTasks.filter(t => t.status === '已完成').length,
        completionRate: periodTasks.length > 0 ? 
          Math.round((periodTasks.filter(t => t.status === '已完成').length / periodTasks.length) * 100) : 0
      };
    }

    if (modules.includes('maintenance')) {
      const periodMaintenance = maintenanceRecords.filter(m => {
        const maintenanceDate = moment(m.createdAt);
        return maintenanceDate.isBetween(start, end, null, '[]');
      });
      
      report.summary.maintenance = {
        total: periodMaintenance.length,
        completed: periodMaintenance.filter(m => m.status === '已完成').length,
        totalCost: periodMaintenance
          .filter(m => m.status === '已完成')
          .reduce((sum, m) => sum + (m.cost || 0), 0)
      };
    }

    if (modules.includes('alarms')) {
      const periodAlarms = alarms.filter(a => {
        const alarmDate = moment(a.timestamp);
        return alarmDate.isBetween(start, end, null, '[]');
      });
      
      report.summary.alarms = {
        total: periodAlarms.length,
        resolved: periodAlarms.filter(a => a.status === '已解决').length,
        resolutionRate: periodAlarms.length > 0 ? 
          Math.round((periodAlarms.filter(a => a.status === '已解决').length / periodAlarms.length) * 100) : 0
      };
    }

    res.json({
      success: true,
      message: '生成自定义统计报告成功',
      data: report
    });

  } catch (error) {
    console.error('生成自定义统计报告错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;