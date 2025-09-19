const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { maintenanceRecords } = require('../data/mockData');

const router = express.Router();

// 获取维护记录列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      deviceId,
      maintenanceType,
      status,
      technician,
      startDate,
      endDate
    } = req.query;

    let filteredRecords = [...maintenanceRecords];

    // 按设备ID筛选
    if (deviceId) {
      filteredRecords = filteredRecords.filter(item =>
        item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
      );
    }

    // 按维护类型筛选
    if (maintenanceType) {
      filteredRecords = filteredRecords.filter(item => item.maintenanceType === maintenanceType);
    }

    // 按状态筛选
    if (status) {
      filteredRecords = filteredRecords.filter(item => item.status === status);
    }

    // 按技术员筛选
    if (technician) {
      filteredRecords = filteredRecords.filter(item =>
        item.technician.toLowerCase().includes(technician.toLowerCase())
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      filteredRecords = filteredRecords.filter(item => {
        const recordDate = moment(item.scheduledDate).format('YYYY-MM-DD');
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    // 分页
    const total = filteredRecords.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredRecords.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取维护记录列表成功',
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
    console.error('获取维护记录列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个维护记录详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const record = maintenanceRecords.find(item => item.id === id || item.recordId === id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: '维护记录不存在'
      });
    }

    res.json({
      success: true,
      message: '获取维护记录详情成功',
      data: record
    });

  } catch (error) {
    console.error('获取维护记录详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新维护记录
router.post('/', (req, res) => {
  try {
    const {
      deviceId,
      deviceName,
      maintenanceType,
      scheduledDate,
      technician,
      description,
      cost,
      parts
    } = req.body;

    // 验证必填字段
    if (!deviceId || !maintenanceType || !scheduledDate || !technician) {
      return res.status(400).json({
        success: false,
        message: '设备ID、维护类型、计划日期和技术员为必填字段'
      });
    }

    // 生成记录ID
    const recordId = `MAINT${String(maintenanceRecords.length + 1).padStart(3, '0')}`;

    // 创建新维护记录
    const newRecord = {
      id: uuidv4(),
      recordId,
      deviceId,
      deviceName: deviceName || '',
      maintenanceType,
      status: '计划中',
      scheduledDate,
      actualDate: null,
      technician,
      description: description || '',
      cost: cost || 0,
      parts: parts || [],
      nextMaintenanceDate: moment(scheduledDate).add(30, 'days').format('YYYY-MM-DD'),
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到维护记录列表
    maintenanceRecords.push(newRecord);

    res.status(201).json({
      success: true,
      message: '维护记录创建成功',
      data: newRecord
    });

  } catch (error) {
    console.error('创建维护记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新维护记录
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const recordIndex = maintenanceRecords.findIndex(item => item.id === id || item.recordId === id);
    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '维护记录不存在'
      });
    }

    // 更新维护记录
    maintenanceRecords[recordIndex] = {
      ...maintenanceRecords[recordIndex],
      ...updateData,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    res.json({
      success: true,
      message: '维护记录更新成功',
      data: maintenanceRecords[recordIndex]
    });

  } catch (error) {
    console.error('更新维护记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 开始维护
router.post('/:id/start', (req, res) => {
  try {
    const { id } = req.params;
    const recordIndex = maintenanceRecords.findIndex(item => item.id === id || item.recordId === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '维护记录不存在'
      });
    }

    const record = maintenanceRecords[recordIndex];
    if (record.status !== '计划中') {
      return res.status(400).json({
        success: false,
        message: '只有计划中的维护才能开始'
      });
    }

    // 更新维护状态
    maintenanceRecords[recordIndex].status = '进行中';
    maintenanceRecords[recordIndex].actualDate = moment().format('YYYY-MM-DD');
    maintenanceRecords[recordIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '维护开始',
      data: maintenanceRecords[recordIndex]
    });

  } catch (error) {
    console.error('开始维护错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 完成维护
router.post('/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const { actualCost, usedParts, notes } = req.body;
    const recordIndex = maintenanceRecords.findIndex(item => item.id === id || item.recordId === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '维护记录不存在'
      });
    }

    const record = maintenanceRecords[recordIndex];
    if (record.status !== '进行中') {
      return res.status(400).json({
        success: false,
        message: '只有进行中的维护才能完成'
      });
    }

    // 更新维护状态
    maintenanceRecords[recordIndex].status = '已完成';
    if (actualCost !== undefined) {
      maintenanceRecords[recordIndex].cost = actualCost;
    }
    if (usedParts) {
      maintenanceRecords[recordIndex].parts = usedParts;
    }
    if (notes) {
      maintenanceRecords[recordIndex].notes = notes;
    }
    maintenanceRecords[recordIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '维护完成',
      data: maintenanceRecords[recordIndex]
    });

  } catch (error) {
    console.error('完成维护错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除维护记录
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const recordIndex = maintenanceRecords.findIndex(item => item.id === id || item.recordId === id);

    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '维护记录不存在'
      });
    }

    // 删除维护记录
    const deletedRecord = maintenanceRecords.splice(recordIndex, 1)[0];

    res.json({
      success: true,
      message: '维护记录删除成功',
      data: deletedRecord
    });

  } catch (error) {
    console.error('删除维护记录错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取维护统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const stats = {
      total: maintenanceRecords.length,
      planned: maintenanceRecords.filter(r => r.status === '计划中').length,
      inProgress: maintenanceRecords.filter(r => r.status === '进行中').length,
      completed: maintenanceRecords.filter(r => r.status === '已完成').length,
      totalCost: maintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
      averageCost: maintenanceRecords.length > 0 ? 
        maintenanceRecords.reduce((sum, r) => sum + (r.cost || 0), 0) / maintenanceRecords.length : 0,
      typeDistribution: {
        regular: maintenanceRecords.filter(r => r.maintenanceType === '定期保养').length,
        repair: maintenanceRecords.filter(r => r.maintenanceType === '故障维修').length,
        upgrade: maintenanceRecords.filter(r => r.maintenanceType === '设备升级').length,
        inspection: maintenanceRecords.filter(r => r.maintenanceType === '安全检查').length
      }
    };

    res.json({
      success: true,
      message: '获取维护统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取维护统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;