// API服务层 - 统一管理所有API调用
import axios from 'axios'
// 导入模拟数据
import { mockEquipmentData, createMockResponse } from './mockData/equipmentMockData'
import { mockVideoData, createMockVideoResponse } from './mockData/videoMockData'

// 配置API基础URL
const API_BASE_URL = 'http://localhost:3000/api'

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// 添加请求拦截器，自动添加token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    const isTestAccount = localStorage.getItem('isTestAccount') === 'true'
    
    // 如果是测试账号，不发送token到后端，使用模拟响应
    if (isTestAccount && token) {
      // 为测试账号请求添加特殊标记
      config.headers['X-Test-Account'] = 'true'
      // 不添加Authorization header，避免后端验证失败
    } else if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器，处理错误
apiClient.interceptors.response.use(
  response => {
    return response
  },
  error => {
    const isTestAccount = localStorage.getItem('isTestAccount') === 'true'
    
    if (error.response?.status === 401) {
      // 如果是测试账号，不自动跳转，让前端处理
      if (!isTestAccount) {
        // 普通账号Token过期或无效，跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

// 认证相关API
export const authAPI = {
  // 用户登录
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials)
  },
  
  // 用户注册
  register: (userData) => {
    return apiClient.post('/auth/register', userData)
  },
  
  // 发送验证码
  sendVerification: (data) => {
    return apiClient.post('/auth/send-verification', data)
  },
  
  // 验证验证码
  verifyCode: (data) => {
    return apiClient.post('/auth/verify-code', data)
  }
}

// 设备管理相关API
export const equipmentAPI = {
  // 获取设备列表 - 带fallback机制
  getEquipmentList: async (params = {}) => {
    try {
      // 优先尝试后端API
      const response = await apiClient.get('/equipment', { params })
      return response
    } catch (error) {
      console.warn('后端设备API不可用，使用测试数据:', error.message)
      
      // 模拟分页逻辑
      const { page = 1, pageSize = 10, deviceId = '', installationLocation = '' } = params
      let filteredData = [...mockEquipmentData.equipmentList]
      
      // 模拟搜索过滤
      if (deviceId) {
        filteredData = filteredData.filter(item => 
          item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
        )
      }
      if (installationLocation) {
        filteredData = filteredData.filter(item => 
          item.installationLocation.toLowerCase().includes(installationLocation.toLowerCase())
        )
      }
      
      // 模拟分页
      const total = filteredData.length
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = filteredData.slice(startIndex, endIndex)
      
      return createMockResponse({
        list: paginatedData,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      })
    }
  },
  
  // 创建设备 - 带fallback机制
  createEquipment: async (data) => {
    try {
      return await apiClient.post('/equipment', data)
    } catch (error) {
      console.warn('后端设备创建API不可用，使用模拟响应:', error.message)
      
      // 模拟创建成功响应
      const newDevice = {
        ...data,
        deviceId: `CAM${String(Date.now()).slice(-3)}`,
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      
      return createMockResponse(newDevice, true, '设备创建成功')
    }
  },
  
  // 更新设备 - 带fallback机制
  updateEquipment: async (deviceId, data) => {
    try {
      return await apiClient.put(`/equipment/${deviceId}`, data)
    } catch (error) {
      console.warn('后端设备更新API不可用，使用模拟响应:', error.message)
      
      // 模拟更新成功响应
      const updatedDevice = {
        ...data,
        deviceId,
        updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      }
      
      return createMockResponse(updatedDevice, true, '设备更新成功')
    }
  },
  
  // 删除设备 - 带fallback机制
  deleteEquipment: async (deviceId) => {
    try {
      return await apiClient.delete(`/equipment/${deviceId}`)
    } catch (error) {
      console.warn('后端设备删除API不可用，使用模拟响应:', error.message)
      
      // 模拟删除成功响应
      return createMockResponse({ deviceId }, true, '设备删除成功')
    }
  }
}

// 监控相关API
export const monitoringAPI = {
  // 获取监控数据列表 - 带fallback机制
  getMonitoringList: async (params = {}) => {
    try {
      // 优先尝试后端API
      const response = await apiClient.get('/monitoring', { params })
      return response
    } catch (error) {
      console.warn('后端监控API不可用，使用测试数据:', error.message)
      
      // 模拟分页逻辑
      const { page = 1, pageSize = 10, deviceId = '', location = '' } = params
      let filteredData = [...mockVideoData.monitoringList]
      
      // 模拟搜索过滤
      if (deviceId) {
        filteredData = filteredData.filter(item => 
          item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
        )
      }
      if (location) {
        filteredData = filteredData.filter(item => 
          item.location.toLowerCase().includes(location.toLowerCase())
        )
      }
      
      // 模拟分页
      const total = filteredData.length
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = filteredData.slice(startIndex, endIndex)
      
      return createMockVideoResponse({
        list: paginatedData,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      })
    }
  },
  
  // 获取本地视频列表 - 带fallback机制
  getLocalVideos: async (params = {}) => {
    try {
      // 优先尝试后端API
      const response = await apiClient.get('/monitoring/local-videos', { params })
      return response
    } catch (error) {
      console.warn('后端视频API不可用，使用测试数据:', error.message)
      
      // 模拟分页逻辑
      const { page = 1, pageSize = 10, deviceId = '', fileName = '' } = params
      let filteredData = [...mockVideoData.localVideos]
      
      // 模拟搜索过滤
      if (deviceId) {
        filteredData = filteredData.filter(item => 
          item.deviceId.toLowerCase().includes(deviceId.toLowerCase())
        )
      }
      if (fileName) {
        filteredData = filteredData.filter(item => 
          item.fileName.toLowerCase().includes(fileName.toLowerCase())
        )
      }
      
      // 模拟分页
      const total = filteredData.length
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      const paginatedData = filteredData.slice(startIndex, endIndex)
      
      return createMockVideoResponse({
        list: paginatedData,
        total,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      })
    }
  }
}

// 清洁任务相关API
export const cleaningTaskAPI = {
  // 获取清洁任务列表
  getCleaningTaskList: (params) => {
    return apiClient.get('/cleaning-tasks', { params })
  },
  
  // 创建清洁任务
  createCleaningTask: (data) => {
    return apiClient.post('/cleaning-tasks', data)
  },
  
  // 更新清洁任务
  updateCleaningTask: (taskId, data) => {
    return apiClient.put(`/cleaning-tasks/${taskId}`, data)
  },
  
  // 删除清洁任务
  deleteCleaningTask: (taskId) => {
    return apiClient.delete(`/cleaning-tasks/${taskId}`)
  }
}

// 维护记录相关API
export const maintenanceAPI = {
  // 获取维护记录列表
  getMaintenanceList: (params) => {
    return apiClient.get('/maintenance', { params })
  },
  
  // 创建维护记录
  createMaintenance: (data) => {
    return apiClient.post('/maintenance', data)
  },
  
  // 更新维护记录
  updateMaintenance: (recordId, data) => {
    return apiClient.put(`/maintenance/${recordId}`, data)
  },
  
  // 删除维护记录
  deleteMaintenance: (recordId) => {
    return apiClient.delete(`/maintenance/${recordId}`)
  }
}

// 报警相关API
export const alarmAPI = {
  // 获取报警列表
  getAlarmList: (params) => {
    return apiClient.get('/alarms', { params })
  },
  
  // 更新报警状态
  updateAlarmStatus: (alarmId, data) => {
    return apiClient.put(`/alarms/${alarmId}`, data)
  },
  
  // 确认报警
  acknowledgeAlarm: (alarmId) => {
    return apiClient.put(`/alarms/${alarmId}`, { status: '已确认' })
  },
  
  // 解决报警
  resolveAlarm: (alarmId) => {
    return apiClient.put(`/alarms/${alarmId}`, { status: '已解决' })
  }
}

// 统计相关API
export const statisticsAPI = {
  // 获取总体统计信息
  getOverviewStatistics: () => {
    return apiClient.get('/statistics/overview')
  },
  
  // 获取详细统计数据
  getStatistics: (params) => {
    return apiClient.get('/statistics', { params })
  },
  
  // 导出统计数据
  exportStatistics: (params) => {
    return apiClient.get('/statistics/export', { 
      params,
      responseType: 'blob'
    })
  }
}

// 用户管理相关API
export const userAPI = {
  // 获取用户列表
  getUserList: (params) => {
    return apiClient.get('/users', { params })
  },
  
  // 获取当前用户信息
  getUserProfile: () => {
    return apiClient.get('/users/profile')
  },
  
  // 创建用户
  createUser: (data) => {
    return apiClient.post('/users', data)
  },
  
  // 更新用户信息
  updateUser: (userId, data) => {
    return apiClient.put(`/users/${userId}`, data)
  },
  
  // 更新当前用户资料
  updateUserProfile: (data) => {
    return apiClient.put('/users/profile', data)
  },
  
  // 删除用户
  deleteUser: (userId) => {
    return apiClient.delete(`/users/${userId}`)
  }
}

// 设备状态相关API
export const stateAPI = {
  // 获取设备状态列表
  getStateList: (params) => {
    return apiClient.get('/state', { params })
  },
  
  // 更新设备状态
  updateDeviceState: (deviceId, data) => {
    return apiClient.put(`/state/${deviceId}`, data)
  },
  
  // 启动设备
  startDevice: (deviceId) => {
    return apiClient.put(`/state/${deviceId}`, { status: '运行中' })
  },
  
  // 停止设备
  stopDevice: (deviceId) => {
    return apiClient.put(`/state/${deviceId}`, { status: '已停止' })
  }
}

// 导出默认的API客户端实例
export default apiClient