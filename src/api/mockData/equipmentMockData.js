// 设备管理模拟数据
export const mockEquipmentData = {
  // 设备列表数据
  equipmentList: [
    {
      deviceId: 'CAM001',
      deviceName: '高清摄像头-01',
      installationLocation: '主入口大厅',
      deviceStatus: '运行中',
      cleaningMode: '自动清洁',
      deviceType: '高压水枪清洁器',
      lastCleaningTime: '2024-01-15 14:30:00',
      maintenanceStatus: '正常',
      createTime: '2024-01-01 09:00:00',
      updateTime: '2024-01-15 14:30:00'
    },
    {
      deviceId: 'CAM002',
      deviceName: '监控摄像头-02',
      installationLocation: '停车场入口',
      deviceStatus: '运行中',
      cleaningMode: '定时清洁',
      deviceType: '超声波清洁器',
      lastCleaningTime: '2024-01-14 10:15:00',
      maintenanceStatus: '正常',
      createTime: '2024-01-02 10:00:00',
      updateTime: '2024-01-14 10:15:00'
    },
    {
      deviceId: 'CAM003',
      deviceName: '安防摄像头-03',
      installationLocation: '办公区走廊',
      deviceStatus: '维护中',
      cleaningMode: '手动清洁',
      deviceType: '气压清洁器',
      lastCleaningTime: '2024-01-13 16:45:00',
      maintenanceStatus: '维护中',
      createTime: '2024-01-03 11:00:00',
      updateTime: '2024-01-13 16:45:00'
    },
    {
      deviceId: 'CAM004',
      deviceName: '全景摄像头-04',
      installationLocation: '会议室A',
      deviceStatus: '离线',
      cleaningMode: '自动清洁',
      deviceType: '刷式清洁器',
      lastCleaningTime: '2024-01-12 09:20:00',
      maintenanceStatus: '需要维护',
      createTime: '2024-01-04 12:00:00',
      updateTime: '2024-01-12 09:20:00'
    },
    {
      deviceId: 'CAM005',
      deviceName: '红外摄像头-05',
      installationLocation: '仓库区域',
      deviceStatus: '故障',
      cleaningMode: '手动清洁',
      deviceType: '高压水枪清洁器',
      lastCleaningTime: '2024-01-11 13:10:00',
      maintenanceStatus: '需要维护',
      createTime: '2024-01-05 13:00:00',
      updateTime: '2024-01-11 13:10:00'
    },
    {
      deviceId: 'CAM006',
      deviceName: '智能摄像头-06',
      installationLocation: '生产车间',
      deviceStatus: '运行中',
      cleaningMode: '定时清洁',
      deviceType: '超声波清洁器',
      lastCleaningTime: '2024-01-16 08:30:00',
      maintenanceStatus: '正常',
      createTime: '2024-01-06 14:00:00',
      updateTime: '2024-01-16 08:30:00'
    },
    {
      deviceId: 'CAM007',
      deviceName: '球型摄像头-07',
      installationLocation: '电梯间',
      deviceStatus: '运行中',
      cleaningMode: '自动清洁',
      deviceType: '气压清洁器',
      lastCleaningTime: '2024-01-15 11:45:00',
      maintenanceStatus: '正常',
      createTime: '2024-01-07 15:00:00',
      updateTime: '2024-01-15 11:45:00'
    },
    {
      deviceId: 'CAM008',
      deviceName: '夜视摄像头-08',
      installationLocation: '室外广场',
      deviceStatus: '运行中',
      cleaningMode: '手动清洁',
      deviceType: '刷式清洁器',
      lastCleaningTime: '2024-01-14 15:20:00',
      maintenanceStatus: '正常',
      createTime: '2024-01-08 16:00:00',
      updateTime: '2024-01-14 15:20:00'
    }
  ],

  // 视频数据
  videoData: [
    {
      id: 'video_001',
      deviceId: 'CAM001',
      videoName: '主入口监控-20240115',
      videoUrl: '/videos/main_entrance_20240115.mp4',
      duration: '02:15:30',
      fileSize: '1.2GB',
      recordTime: '2024-01-15 14:30:00',
      quality: '1080P',
      status: '正常'
    },
    {
      id: 'video_002',
      deviceId: 'CAM002',
      videoName: '停车场监控-20240114',
      videoUrl: '/videos/parking_20240114.mp4',
      duration: '01:45:20',
      fileSize: '980MB',
      recordTime: '2024-01-14 10:15:00',
      quality: '720P',
      status: '正常'
    },
    {
      id: 'video_003',
      deviceId: 'CAM003',
      videoName: '办公区监控-20240113',
      videoUrl: '/videos/office_20240113.mp4',
      duration: '03:20:15',
      fileSize: '1.8GB',
      recordTime: '2024-01-13 16:45:00',
      quality: '1080P',
      status: '正常'
    },
    {
      id: 'video_004',
      deviceId: 'CAM006',
      videoName: '生产车间监控-20240116',
      videoUrl: '/videos/workshop_20240116.mp4',
      duration: '04:10:45',
      fileSize: '2.3GB',
      recordTime: '2024-01-16 08:30:00',
      quality: '1080P',
      status: '正常'
    },
    {
      id: 'video_005',
      deviceId: 'CAM007',
      videoName: '电梯间监控-20240115',
      videoUrl: '/videos/elevator_20240115.mp4',
      duration: '01:30:10',
      fileSize: '750MB',
      recordTime: '2024-01-15 11:45:00',
      quality: '720P',
      status: '正常'
    }
  ],

  // 分页信息
  pagination: {
    total: 8,
    page: 1,
    pageSize: 5,
    totalPages: 2
  }
}

// 模拟API响应格式
export const createMockResponse = (data, success = true, message = '操作成功') => {
  return {
    data: {
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    }
  }
}

// 设备状态选项
export const deviceStatusOptions = [
  { label: '运行中', value: '运行中' },
  { label: '离线', value: '离线' },
  { label: '维护中', value: '维护中' },
  { label: '故障', value: '故障' }
]

// 清洁模式选项
export const cleaningModeOptions = [
  { label: '自动清洁', value: '自动清洁' },
  { label: '手动清洁', value: '手动清洁' },
  { label: '定时清洁', value: '定时清洁' }
]

// 设备类型选项
export const deviceTypeOptions = [
  { label: '高压水枪清洁器', value: '高压水枪清洁器' },
  { label: '超声波清洁器', value: '超声波清洁器' },
  { label: '气压清洁器', value: '气压清洁器' },
  { label: '刷式清洁器', value: '刷式清洁器' }
]

// 维护状态选项
export const maintenanceStatusOptions = [
  { label: '正常', value: '正常' },
  { label: '需要维护', value: '需要维护' },
  { label: '维护中', value: '维护中' }
]