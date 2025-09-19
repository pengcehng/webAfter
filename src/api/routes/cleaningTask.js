const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { cleaningTasks } = require('../data/mockData');

const router = express.Router();

// 获取清洁任务列表
router.get('/', (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      taskId,
      deviceId,
      taskType,
      priority,
      status,
      assignedUser,
      startDate,
      endDate
    } = req.query;

    let filteredTasks = [...cleaningTasks];

    // 按任务ID筛选
    if (taskId) {
      filteredTasks = filteredTasks.filter(item =>
        item.taskId.toLowerCase().includes(taskId.toLowerCase())
      );
    }

    // 按设备ID筛选
    if (deviceId) {
      filteredTasks = filteredTasks.filter(item =>
        item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
      );
    }

    // 按任务类型筛选
    if (taskType) {
      filteredTasks = filteredTasks.filter(item => item.taskType === taskType);
    }

    // 按优先级筛选
    if (priority) {
      filteredTasks = filteredTasks.filter(item => item.priority === priority);
    }

    // 按状态筛选
    if (status) {
      filteredTasks = filteredTasks.filter(item => item.status === status);
    }

    // 按分配用户筛选
    if (assignedUser) {
      filteredTasks = filteredTasks.filter(item =>
        item.assignedUser.toLowerCase().includes(assignedUser.toLowerCase())
      );
    }

    // 按日期范围筛选
    if (startDate && endDate) {
      filteredTasks = filteredTasks.filter(item => {
        const scheduledDate = moment(item.scheduledTime).format('YYYY-MM-DD');
        return scheduledDate >= startDate && scheduledDate <= endDate;
      });
    }

    // 分页
    const total = filteredTasks.length;
    const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
    const endIndex = startIndex + parseInt(pageSize);
    const paginatedData = filteredTasks.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: '获取清洁任务列表成功',
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
    console.error('获取清洁任务列表错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取单个清洁任务详情
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const task = cleaningTasks.find(item => item.id === id || item.taskId === id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    res.json({
      success: true,
      message: '获取清洁任务详情成功',
      data: task
    });

  } catch (error) {
    console.error('获取清洁任务详情错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 创建新清洁任务
router.post('/', (req, res) => {
  try {
    const {
      taskName,
      deviceId,
      deviceName,
      taskType,
      priority,
      scheduledTime,
      assignedUser,
      description
    } = req.body;

    // 验证必填字段
    if (!taskName || !deviceId || !taskType || !priority || !scheduledTime || !assignedUser) {
      return res.status(400).json({
        success: false,
        message: '任务名称、设备ID、任务类型、优先级、计划时间和分配用户为必填字段'
      });
    }

    // 生成任务ID
    const taskId = `TASK${String(cleaningTasks.length + 1).padStart(3, '0')}`;

    // 创建新任务
    const newTask = {
      id: uuidv4(),
      taskId,
      taskName,
      deviceId,
      deviceName: deviceName || '',
      taskType,
      priority,
      status: '待执行',
      scheduledTime,
      actualStartTime: null,
      actualEndTime: null,
      duration: null,
      assignedUser,
      description: description || '',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    // 添加到任务列表
    cleaningTasks.push(newTask);

    res.status(201).json({
      success: true,
      message: '清洁任务创建成功',
      data: newTask
    });

  } catch (error) {
    console.error('创建清洁任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 更新清洁任务
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const taskIndex = cleaningTasks.findIndex(item => item.id === id || item.taskId === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    // 更新任务信息
    cleaningTasks[taskIndex] = {
      ...cleaningTasks[taskIndex],
      ...updateData,
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };

    res.json({
      success: true,
      message: '清洁任务更新成功',
      data: cleaningTasks[taskIndex]
    });

  } catch (error) {
    console.error('更新清洁任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 开始执行任务
router.post('/:id/start', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = cleaningTasks.findIndex(item => item.id === id || item.taskId === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    const task = cleaningTasks[taskIndex];
    if (task.status !== '待执行') {
      return res.status(400).json({
        success: false,
        message: '只有待执行的任务才能开始'
      });
    }

    // 更新任务状态
    cleaningTasks[taskIndex].status = '进行中';
    cleaningTasks[taskIndex].actualStartTime = moment().format('YYYY-MM-DD HH:mm:ss');
    cleaningTasks[taskIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '任务开始执行',
      data: cleaningTasks[taskIndex]
    });

  } catch (error) {
    console.error('开始执行任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 完成任务
router.post('/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = cleaningTasks.findIndex(item => item.id === id || item.taskId === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    const task = cleaningTasks[taskIndex];
    if (task.status !== '进行中') {
      return res.status(400).json({
        success: false,
        message: '只有进行中的任务才能完成'
      });
    }

    const endTime = moment();
    const startTime = moment(task.actualStartTime);
    const duration = endTime.diff(startTime, 'minutes');

    // 更新任务状态
    cleaningTasks[taskIndex].status = '已完成';
    cleaningTasks[taskIndex].actualEndTime = endTime.format('YYYY-MM-DD HH:mm:ss');
    cleaningTasks[taskIndex].duration = duration;
    cleaningTasks[taskIndex].updatedAt = endTime.format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '任务完成',
      data: cleaningTasks[taskIndex]
    });

  } catch (error) {
    console.error('完成任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 取消任务
router.post('/:id/cancel', (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const taskIndex = cleaningTasks.findIndex(item => item.id === id || item.taskId === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    const task = cleaningTasks[taskIndex];
    if (task.status === '已完成' || task.status === '已取消') {
      return res.status(400).json({
        success: false,
        message: '已完成或已取消的任务不能再次取消'
      });
    }

    // 更新任务状态
    cleaningTasks[taskIndex].status = '已取消';
    cleaningTasks[taskIndex].cancelReason = reason || '用户取消';
    cleaningTasks[taskIndex].updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

    res.json({
      success: true,
      message: '任务已取消',
      data: cleaningTasks[taskIndex]
    });

  } catch (error) {
    console.error('取消任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 删除任务
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = cleaningTasks.findIndex(item => item.id === id || item.taskId === id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '清洁任务不存在'
      });
    }

    // 删除任务
    const deletedTask = cleaningTasks.splice(taskIndex, 1)[0];

    res.json({
      success: true,
      message: '清洁任务删除成功',
      data: deletedTask
    });

  } catch (error) {
    console.error('删除清洁任务错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 获取任务统计信息
router.get('/statistics/overview', (req, res) => {
  try {
    const stats = {
      total: cleaningTasks.length,
      pending: cleaningTasks.filter(t => t.status === '待执行').length,
      inProgress: cleaningTasks.filter(t => t.status === '进行中').length,
      completed: cleaningTasks.filter(t => t.status === '已完成').length,
      cancelled: cleaningTasks.filter(t => t.status === '已取消').length,
      priorityDistribution: {
        high: cleaningTasks.filter(t => t.priority === '高').length,
        medium: cleaningTasks.filter(t => t.priority === '中').length,
        low: cleaningTasks.filter(t => t.priority === '低').length
      },
      typeDistribution: {
        regular: cleaningTasks.filter(t => t.taskType === '定期清洁').length,
        emergency: cleaningTasks.filter(t => t.taskType === '紧急清洁').length,
        maintenance: cleaningTasks.filter(t => t.taskType === '维护清洁').length
      }
    };

    res.json({
      success: true,
      message: '获取任务统计信息成功',
      data: stats
    });

  } catch (error) {
    console.error('获取任务统计信息错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

module.exports = router;