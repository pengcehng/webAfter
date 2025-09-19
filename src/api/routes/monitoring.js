const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { monitoringData } = require('../data/mockData');

const router = express.Router();

// 获取监控列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      cameraId,
      location,
      status,
      cleaningDeviceId
    } = req.query;

    let filteredData = [...monitoringData];

    // 按摄像头ID筛选
    if (cameraId) {
      filteredData = filteredData.filter(item =>
        item.cameraId.toLowerCase().includes(cameraId.toLowerCase())
      );
    }

    // 按位置筛选
    if (location) {
      filteredData = filteredData.filter(item =>
        item.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // 按状态筛选
    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }

    // 按清洁设备ID筛选
    if (cleaningDeviceId) {
      filteredData = filteredData.filter(item => item.cleaningDeviceId === cleaningDeviceId);
    }

    // 分页
    const total = filteredData.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取监控列表成功',
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
    console.error('获取监控列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个监控详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const camera = monitoringData.find(item => item.id === id || item.cameraId === id);

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: '监控设备不存在'
      });
    }

    res.json({
      success: true,
      message: '获取监控详情成功',
      data: camera
    });

  } catch (error) {
    console.error('获取监控详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新监控状态
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const cameraIndex = monitoringData.findIndex(item => item.id === id || item.cameraId === id);
    if (cameraIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '监控设备不存在'
      });
    }

    // 验证状态值
    const validStatuses = ['在线', '离线', '维护中'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的状态值'
      });
    }

    // 更新状态
    monitoringData[cameraIndex].status = status;
    monitoringData[cameraIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '监控状态更新成功',
      data: monitoringData[cameraIndex]
    });

  } catch (error) {
    console.error('更新监控状态错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新清洁度评分
router.put('/:id/cleanliness', (req, res) => {
  try {
    const { id } = req.params;
    const { cleanlinessScore, imageQuality } = req.body;

    const cameraIndex = monitoringData.findIndex(item => item.id === id || item.cameraId === id);
    if (cameraIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '监控设备不存在'
      });
    }

    // 验证清洁度评分
    if (cleanlinessScore < 0 || cleanlinessScore > 100) {
      return res.status(400).json({
        success: false,
        message: '清洁度评分必须在0-100之间'
      });
    }

    // 更新清洁度信息
    if (cleanlinessScore !== undefined) {
      monitoringData[cameraIndex].cleanlinessScore = cleanlinessScore;
    }
    if (imageQuality) {
      monitoringData[cameraIndex].imageQuality = imageQuality;
    }
    monitoringData[cameraIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '清洁度信息更新成功',
      data: monitoringData[cameraIndex]
    });

  } catch (error) {
    console.error('更新清洁度信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取监控统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const stats = {
      total: monitoringData.length,
      online: monitoringData.filter(c => c.status === '在线').length,
      offline: monitoringData.filter(c => c.status === '离线').length,
      maintenance: monitoringData.filter(c => c.status === '维护中').length,
      averageCleanlinessScore: Math.round(
        monitoringData.reduce((sum, c) => sum + c.cleanlinessScore, 0) / monitoringData.length
      ),
      imageQualityDistribution: {
        excellent: monitoringData.filter(c => c.imageQuality === '优秀').length,
        good: monitoringData.filter(c => c.imageQuality === '良好').length,
        poor: monitoringData.filter(c => c.imageQuality === '较差').length
      }
    };

    res.json({
      success: true,
      message: '获取监控统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取监控统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;