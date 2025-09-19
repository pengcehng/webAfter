const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { deviceStates } = require('../data/mockData');

const router = express.Router();

// 获取设备状态列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      deviceId,
      deviceType,
      status,
      location
    } = req.query;

    let filteredStates = [...deviceStates];

    // 按设备ID筛选
    if (deviceId) {
      filteredStates = filteredStates.filter(item =>
        item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
      );
    }

    // 按设备类型筛选
    if (deviceType) {
      filteredStates = filteredStates.filter(item => item.deviceType === deviceType);
    }

    // 按状态筛选
    if (status) {
      filteredStates = filteredStates.filter(item => item.status === status);
    }

    // 按位置筛选
    if (location) {
      filteredStates = filteredStates.filter(item =>
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 按更新时间倒序排列
    filteredStates.sort((a, b) => moment(b.lastUpdated).valueOf() - moment(a.lastUpdated).valueOf());

    // 分页
    const total = filteredStates.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredStates.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取设备状态列表成功',
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
    console.error('获取设备状态列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个设备状态详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deviceState = deviceStates.find(item => item.id === id || item.deviceId === id);

    if (!deviceState) {
      return res.status(404).json({
        success: false,
        message: '设备状态记录不存在'
      });
    }

    res.json({
      success: true,
      message: '获取设备状态详情成功',
      data: deviceState
    });

  } catch (error) {
    console.error('获取设备状态详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新设备状态
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      batteryLevel,
      temperature,
      humidity,
      signalStrength,
      workingHours,
      errorCode,
      notes
    } = req.body;

    const deviceIndex = deviceStates.findIndex(item => item.id === id || item.deviceId === id);

    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '设备状态记录不存在'
      });
    }

    // 验证状态值
    if (status && !['在线', '离线', '故障', '维护中'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的设备状态'
      });
    }

    // 验证电池电量
    if (batteryLevel !== undefined && (batteryLevel < 0 || batteryLevel > 100)) {
      return res.status(400).json({
        success: false,
        message: '电池电量必须在0-100之间'
      });
    }

    // 验证信号强度
    if (signalStrength !== undefined && (signalStrength < 0 || signalStrength > 100)) {
      return res.status(400).json({
        success: false,
        message: '信号强度必须在0-100之间'
      });
    }

    // 更新设备状态
    const updatedFields = {};
    if (status !== undefined) updatedFields.status = status;
    if (batteryLevel !== undefined) updatedFields.batteryLevel = batteryLevel;
    if (temperature !== undefined) updatedFields.temperature = temperature;
    if (humidity !== undefined) updatedFields.humidity = humidity;
    if (signalStrength !== undefined) updatedFields.signalStrength = signalStrength;
    if (workingHours !== undefined) updatedFields.workingHours = workingHours;
    if (errorCode !== undefined) updatedFields.errorCode = errorCode;
    if (notes !== undefined) updatedFields.notes = notes;

    // 更新时间戳
    updatedFields.lastUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

    // 应用更新
    Object.assign(deviceStates[deviceIndex], updatedFields);

    res.json({
      success: true,
      message: '设备状态更新成功',
      data: deviceStates[deviceIndex]
    });

  } catch (error) {
    console.error('更新设备状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 批量更新设备状态
router.put('/batch/update', (req, res) => {
  try {
    const { updates } = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要更新的设备状态列表'
      });
    }

    const updatedDevices = [];
    const notFoundIds = [];
    const errors = [];

    updates.forEach(update => {
      const { id, ...updateData } = update;
      const deviceIndex = deviceStates.findIndex(item => item.id === id || item.deviceId === id);

      if (deviceIndex === -1) {
        notFoundIds.push(id);
        return;
      }

      try {
        // 验证状态值
        if (updateData.status && !['在线', '离线', '故障', '维护中'].includes(updateData.status)) {
          errors.push({ id, error: '无效的设备状态' });
          return;
        }

        // 验证电池电量
        if (updateData.batteryLevel !== undefined && (updateData.batteryLevel < 0 || updateData.batteryLevel > 100)) {
          errors.push({ id, error: '电池电量必须在0-100之间' });
          return;
        }

        // 验证信号强度
        if (updateData.signalStrength !== undefined && (updateData.signalStrength < 0 || updateData.signalStrength > 100)) {
          errors.push({ id, error: '信号强度必须在0-100之间' });
          return;
        }

        // 更新时间戳
        updateData.lastUpdated = moment().format('YYYY-MM-DD HH:mm:ss');

        // 应用更新
        Object.assign(deviceStates[deviceIndex], updateData);
        updatedDevices.push(deviceStates[deviceIndex]);

      } catch (error) {
        errors.push({ id, error: error.message });
      }
    });

    res.json({
      success: true,
      message: `成功更新 ${updatedDevices.length} 个设备状态`,
      data: {
        updatedDevices,
        notFoundIds,
        errors,
        updatedCount: updatedDevices.length
      }
    });

  } catch (error) {
    console.error('批量更新设备状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取设备状态统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const stats = {
      total: deviceStates.length,
      online: deviceStates.filter(d => d.status === '在线').length,
      offline: deviceStates.filter(d => d.status === '离线').length,
      fault: deviceStates.filter(d => d.status === '故障').length,
      maintenance: deviceStates.filter(d => d.status === '维护中').length,
      typeDistribution: {},
      batteryStats: {
        average: 0,
        low: deviceStates.filter(d => d.batteryLevel < 20).length,
        medium: deviceStates.filter(d => d.batteryLevel >= 20 && d.batteryLevel < 50).length,
        high: deviceStates.filter(d => d.batteryLevel >= 50).length
      },
      signalStats: {
        average: 0,
        weak: deviceStates.filter(d => d.signalStrength < 30).length,
        medium: deviceStates.filter(d => d.signalStrength >= 30 && d.signalStrength < 70).length,
        strong: deviceStates.filter(d => d.signalStrength >= 70).length
      }
    };

    // 计算设备类型分布
    deviceStates.forEach(device => {
      const type = device.deviceType;
      stats.typeDistribution[type] = (stats.typeDistribution[type] || 0) + 1;
    });

    // 计算平均电池电量
    const totalBattery = deviceStates.reduce((sum, device) => sum + device.batteryLevel, 0);
    stats.batteryStats.average = Math.round(totalBattery / deviceStates.length);

    // 计算平均信号强度
    const totalSignal = deviceStates.reduce((sum, device) => sum + device.signalStrength, 0);
    stats.signalStats.average = Math.round(totalSignal / deviceStates.length);

    res.json({
      success: true,
      message: '获取设备状态统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取设备状态统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取设备类型列表
router.get('/types/list', (req, res) => {
  try {
    const types = [...new Set(deviceStates.map(device => device.deviceType))];
    
    res.json({
      success: true,
      message: '获取设备类型列表成功',
      data: types
    });

  } catch (error) {
    console.error('获取设备类型列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取位置列表
router.get('/locations/list', (req, res) => {
  try {
    const locations = [...new Set(deviceStates.map(device => device.location))];
    
    res.json({
      success: true,
      message: '获取位置列表成功',
      data: locations
    });

  } catch (error) {
    console.error('获取位置列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;