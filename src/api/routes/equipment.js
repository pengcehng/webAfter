const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { equipment } = require('../data/mockData');

const router = express.Router();

// 获取设备列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      deviceId,
      deviceName,
      installationLocation,
      deviceStatus,
      deviceType,
      startDate,
      endDate
    } = req.query;

    let filteredEquipment = [...equipment];

    // 按设备ID筛选
    if (deviceId) {
      filteredEquipment = filteredEquipment.filter(item =>
        item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
      );
    }

    // 按设备名称筛选
    if (deviceName) {
      filteredEquipment = filteredEquipment.filter(item =>
        item.deviceName.toLowerCase().includes(deviceName.toLowerCase())
      );
    }

    // 按安装位置筛选
    if (installationLocation) {
      filteredEquipment = filteredEquipment.filter(item =>
        item.installationLocation.toLowerCase().includes(installationLocation.toLowerCase())
      );
    }

    // 按设备状态筛选
    if (deviceStatus) {
      filteredEquipment = filteredEquipment.filter(item =>
        item.deviceStatus === deviceStatus
      );
    }

    // 按设备类型筛选
    if (deviceType) {
      filteredEquipment = filteredEquipment.filter(item =>
        item.deviceType === deviceType
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      filteredEquipment = filteredEquipment.filter(item => {
        const lastCleaningDate = moment(item.lastCleaningTime).format('YYYY-MM-DD');
        return lastCleaningDate >= startDate && lastCleaningDate <= endDate;
      });
    }

    // 分页
    const total = filteredEquipment.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredEquipment.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取设备列表成功',
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
    console.error('获取设备列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个设备详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const device = equipment.find(item => item.id === id || item.deviceId === id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      });
    }

    res.json({
      success: true,
      message: '获取设备详情成功',
      data: device
    });

  } catch (error) {
    console.error('获取设备详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新设备
router.post('/', (req, res) => {
  try {
    const {
      deviceId,
      deviceName,
      installationLocation,
      deviceStatus,
      deviceType,
      cleaningMode,
      maintenanceStatus
    } = req.body;

    // 验证必填字段
    if (!deviceId || !deviceName || !installationLocation || !deviceStatus || !deviceType) {
      return res.status(400).json({
        success: false,
        message: '设备ID、设备名称、安装位置、设备状态和设备类型为必填字段'
      });
    }

    // 检查设备ID是否已存在
    const existingDevice = equipment.find(item => item.deviceId === deviceId);
    if (existingDevice) {
      return res.status(409).json({
        success: false,
        message: '设备ID已存在'
      });
    }

    // 创建新设备
    const newDevice = {
      id: uuidv4(),
      deviceId,
      deviceName,
      installationLocation,
      deviceStatus,
      deviceType,
      cleaningMode: cleaningMode || '自动清洁',
      batteryLevel: '100%',
      lastCleaningTime: null,
      nextScheduledCleaning: moment().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
      totalCleaningCount: 0,
      maintenanceStatus: maintenanceStatus || '良好',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到设备列表
    equipment.push(newDevice);

    res.status(201).json({
      success: true,
      message: '设备创建成功',
      data: newDevice
    });

  } catch (error) {
    console.error('创建设备错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新设备信息
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const deviceIndex = equipment.findIndex(item => item.id === id || item.deviceId === id);
    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      });
    }

    // 如果更新设备ID，检查是否与其他设备冲突
    if (updateData.deviceId && updateData.deviceId !== equipment[deviceIndex].deviceId) {
      const existingDevice = equipment.find(item => item.deviceId === updateData.deviceId);
      if (existingDevice) {
        return res.status(409).json({
          success: false,
          message: '设备ID已存在'
        });
      }
    }

    // 更新设备信息
    equipment[deviceIndex] = {
      ...equipment[deviceIndex],
      ...updateData,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    res.json({
      success: true,
      message: '设备更新成功',
      data: equipment[deviceIndex]
    });

  } catch (error) {
    console.error('更新设备错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除设备
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deviceIndex = equipment.findIndex(item => item.id === id || item.deviceId === id);

    if (deviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      });
    }

    // 删除设备
    const deletedDevice = equipment.splice(deviceIndex, 1)[0];

    res.json({
      success: true,
      message: '设备删除成功',
      data: deletedDevice
    });

  } catch (error) {
    console.error('删除设备错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 批量删除设备
router.delete('/', (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: '请提供要删除的设备ID列表'
      });
    }

    const deletedDevices = [];
    const notFoundIds = [];

    ids.forEach(id => {
      const deviceIndex = equipment.findIndex(item => item.id === id || item.deviceId === id);
      if (deviceIndex !== -1) {
        deletedDevices.push(equipment.splice(deviceIndex, 1)[0]);
      } else {
        notFoundIds.push(id);
      }
    });

    res.json({
      success: true,
      message: `成功删除 ${deletedDevices.length} 个设备`,
      data: {
        deletedDevices,
        notFoundIds,
        deletedCount: deletedDevices.length,
        notFoundCount: notFoundIds.length
      }
    });

  } catch (error) {
    console.error('批量删除设备错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取设备状态统计
router.get('/statistics/status', (req, res) => {
  try {
    const statusStats = {
      total: equipment.length,
      normal: equipment.filter(e => e.deviceStatus === '正常运行').length,
      maintenance: equipment.filter(e => e.deviceStatus === '维护中').length,
      fault: equipment.filter(e => e.deviceStatus === '故障').length,
      offline: equipment.filter(e => e.deviceStatus === '离线').length
    };

    res.json({
      success: true,
      message: '获取设备状态统计成功',
      data: statusStats
    });

  } catch (error) {
    console.error('获取设备状态统计错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取设备类型列表
router.get('/options/types', (req, res) => {
  try {
    const deviceTypes = [...new Set(equipment.map(e => e.deviceType))];
    
    res.json({
      success: true,
      message: '获取设备类型列表成功',
      data: deviceTypes
    });

  } catch (error) {
    console.error('获取设备类型列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;