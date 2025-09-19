const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { alarms } = require('../data/mockData');

const router = express.Router();

// 获取报警列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      deviceId,
      alarmType,
      severity,
      status,
      startDate,
      endDate
    } = req.query;

    let filteredAlarms = [...alarms];

    // 按设备ID筛选
    if (deviceId) {
      filteredAlarms = filteredAlarms.filter(item =>
        item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
      );
    }

    // 按报警类型筛选
    if (alarmType) {
      filteredAlarms = filteredAlarms.filter(item => item.alarmType === alarmType);
    }

    // 按严重程度筛选
    if (severity) {
      filteredAlarms = filteredAlarms.filter(item => item.severity === severity);
    }

    // 按状态筛选
    if (status) {
      filteredAlarms = filteredAlarms.filter(item => item.status === status);
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      filteredAlarms = filteredAlarms.filter(item => {
        const alarmDate = moment(item.timestamp).format('YYYY-MM-DD');
        return alarmDate >= startDate && alarmDate <= endDate;
      });
    }

    // 按时间倒序排列
    filteredAlarms.sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());

    // 分页
    const total = filteredAlarms.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredAlarms.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取报警列表成功',
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
    console.error('获取报警列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个报警详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const alarm = alarms.find(item => item.id === id || item.alarmId === id);

    if (!alarm) {
      return res.status(404).json({
        success: false,
        message: '报警记录不存在'
      });
    }

    res.json({
      success: true,
      message: '获取报警详情成功',
      data: alarm
    });

  } catch (error) {
    console.error('获取报警详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新报警
router.post('/', (req, res) => {
  try {
    const {
      deviceId,
      deviceName,
      alarmType,
      severity,
      message
    } = req.body;

    // 验证必填字段
    if (!deviceId || !alarmType || !severity || !message) {
      return res.status(400).json({
        success: false,
        message: '设备ID、报警类型、严重程度和报警信息为必填字段'
      });
    }

    // 验证严重程度
    const validSeverities = ['低', '中', '高', '紧急'];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        success: false,
        message: '无效的严重程度'
      });
    }

    // 生成报警ID
    const alarmId = `ALARM${String(alarms.length + 1).padStart(3, '0')}`;

    // 创建新报警
    const newAlarm = {
      id: uuidv4(),
      alarmId,
      deviceId,
      deviceName: deviceName || '',
      alarmType,
      severity,
      status: '未处理',
      message,
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedBy: null,
      resolvedAt: null,
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到报警列表
    alarms.push(newAlarm);

    res.status(201).json({
      success: true,
      message: '报警创建成功',
      data: newAlarm
    });

  } catch (error) {
    console.error('创建报警错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 确认报警
router.post('/:id/acknowledge', (req, res) => {
  try {
    const { id } = req.params;
    const { acknowledgedBy } = req.body;
    const alarmIndex = alarms.findIndex(item => item.id === id || item.alarmId === id);

    if (alarmIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '报警记录不存在'
      });
    }

    const alarm = alarms[alarmIndex];
    if (alarm.status !== '未处理') {
      return res.status(400).json({
        success: false,
        message: '只有未处理的报警才能确认'
      });
    }

    if (!acknowledgedBy) {
      return res.status(400).json({
        success: false,
        message: '确认人员信息不能为空'
      });
    }

    // 更新报警状态
    alarms[alarmIndex].status = '已确认';
    alarms[alarmIndex].acknowledgedBy = acknowledgedBy;
    alarms[alarmIndex].acknowledgedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    alarms[alarmIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '报警确认成功',
      data: alarms[alarmIndex]
    });

  } catch (error) {
    console.error('确认报警错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 解决报警
router.post('/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    const { resolvedBy, resolution } = req.body;
    const alarmIndex = alarms.findIndex(item => item.id === id || item.alarmId === id);

    if (alarmIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '报警记录不存在'
      });
    }

    const alarm = alarms[alarmIndex];
    if (alarm.status === '已解决') {
      return res.status(400).json({
        success: false,
        message: '报警已经解决'
      });
    }

    if (!resolvedBy) {
      return res.status(400).json({
        success: false,
        message: '解决人员信息不能为空'
      });
    }

    // 更新报警状态
    alarms[alarmIndex].status = '已解决';
    alarms[alarmIndex].resolvedBy = resolvedBy;
    alarms[alarmIndex].resolvedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    alarms[alarmIndex].resolution = resolution || '';
    alarms[alarmIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    // 如果还没有确认，自动设置确认信息
    if (!alarms[alarmIndex].acknowledgedBy) {
      alarms[alarmIndex].acknowledgedBy = resolvedBy;
      alarms[alarmIndex].acknowledgedAt = alarms[alarmIndex].resolvedAt;
    }

    res.json({
      success: true,
      message: '报警解决成功',
      data: alarms[alarmIndex]
    });

  } catch (error) {
    console.error('解决报警错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 批量确认报警
router.post('/batch/acknowledge', (req, res) => {
  try {
    const { ids, acknowledgedBy } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要确认的报警ID列表'
      });
    }

    if (!acknowledgedBy) {
      return res.status(400).json({
        success: false,
        message: '确认人员信息不能为空'
      });
    }

    const acknowledgedAlarms = [];
    const notFoundIds = [];
    const alreadyProcessedIds = [];

    ids.forEach(id => {
      const alarmIndex = alarms.findIndex(item => item.id === id || item.alarmId === id);
      if (alarmIndex === -1) {
        notFoundIds.push(id);
      } else if (alarms[alarmIndex].status !== '未处理') {
        alreadyProcessedIds.push(id);
      } else {
        alarms[alarmIndex].status = '已确认';
        alarms[alarmIndex].acknowledgedBy = acknowledgedBy;
        alarms[alarmIndex].acknowledgedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        alarms[alarmIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        acknowledgedAlarms.push(alarms[alarmIndex]);
      }
    });

    res.json({
      success: true,
      message: `成功确认 ${acknowledgedAlarms.length} 个报警`,
      data: {
        acknowledgedAlarms,
        notFoundIds,
        alreadyProcessedIds,
        acknowledgedCount: acknowledgedAlarms.length
      }
    });

  } catch (error) {
    console.error('批量确认报警错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除报警
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const alarmIndex = alarms.findIndex(item => item.id === id || item.alarmId === id);

    if (alarmIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '报警记录不存在'
      });
    }

    // 删除报警
    const deletedAlarm = alarms.splice(alarmIndex, 1)[0];

    res.json({
      success: true,
      message: '报警删除成功',
      data: deletedAlarm
    });

  } catch (error) {
    console.error('删除报警错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取报警统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const thisWeek = now.startOf('week').format('YYYY-MM-DD');
    const thisMonth = now.startOf('month').format('YYYY-MM-DD');

    const stats = {
      total: alarms.length,
      unprocessed: alarms.filter(a => a.status === '未处理').length,
      acknowledged: alarms.filter(a => a.status === '已确认').length,
      resolved: alarms.filter(a => a.status === '已解决').length,
      severityDistribution: {
        emergency: alarms.filter(a => a.severity === '紧急').length,
        high: alarms.filter(a => a.severity === '高').length,
        medium: alarms.filter(a => a.severity === '中').length,
        low: alarms.filter(a => a.severity === '低').length
      },
      typeDistribution: {
        fault: alarms.filter(a => a.alarmType === '设备故障').length,
        maintenance: alarms.filter(a => a.alarmType === '维护提醒').length,
        battery: alarms.filter(a => a.alarmType === '电量不足').length,
        communication: alarms.filter(a => a.alarmType === '通信异常').length,
        other: alarms.filter(a => !['设备故障', '维护提醒', '电量不足', '通信异常'].includes(a.alarmType)).length
      },
      timeDistribution: {
        today: alarms.filter(a => moment(a.timestamp).format('YYYY-MM-DD') === today).length,
        thisWeek: alarms.filter(a => moment(a.timestamp).format('YYYY-MM-DD') >= thisWeek).length,
        thisMonth: alarms.filter(a => moment(a.timestamp).format('YYYY-MM-DD') >= thisMonth).length
      }
    };

    res.json({
      success: true,
      message: '获取报警统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取报警统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;