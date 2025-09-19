// 视频监控模拟数据
export const mockVideoData = {
  // 本地视频列表
  localVideos: [
    {
      id: 'local_001',
      fileName: 'main_entrance_20240115_143000.mp4',
      filePath: '/videos/local/main_entrance_20240115_143000.mp4',
      deviceId: 'CAM001',
      deviceName: '高清摄像头-01',
      location: '主入口大厅',
      recordTime: '2024-01-15 14:30:00',
      duration: '02:15:30',
      fileSize: '1.2GB',
      resolution: '1920x1080',
      quality: '1080P',
      frameRate: '30fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/main_entrance_20240115.jpg'
    },
    {
      id: 'local_002',
      fileName: 'parking_20240114_101500.mp4',
      filePath: '/videos/local/parking_20240114_101500.mp4',
      deviceId: 'CAM002',
      deviceName: '监控摄像头-02',
      location: '停车场入口',
      recordTime: '2024-01-14 10:15:00',
      duration: '01:45:20',
      fileSize: '980MB',
      resolution: '1280x720',
      quality: '720P',
      frameRate: '25fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/parking_20240114.jpg'
    },
    {
      id: 'local_003',
      fileName: 'office_corridor_20240113_164500.mp4',
      filePath: '/videos/local/office_corridor_20240113_164500.mp4',
      deviceId: 'CAM003',
      deviceName: '安防摄像头-03',
      location: '办公区走廊',
      recordTime: '2024-01-13 16:45:00',
      duration: '03:20:15',
      fileSize: '1.8GB',
      resolution: '1920x1080',
      quality: '1080P',
      frameRate: '30fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/office_corridor_20240113.jpg'
    },
    {
      id: 'local_004',
      fileName: 'workshop_20240116_083000.mp4',
      filePath: '/videos/local/workshop_20240116_083000.mp4',
      deviceId: 'CAM006',
      deviceName: '智能摄像头-06',
      location: '生产车间',
      recordTime: '2024-01-16 08:30:00',
      duration: '04:10:45',
      fileSize: '2.3GB',
      resolution: '1920x1080',
      quality: '1080P',
      frameRate: '30fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/workshop_20240116.jpg'
    },
    {
      id: 'local_005',
      fileName: 'elevator_20240115_114500.mp4',
      filePath: '/videos/local/elevator_20240115_114500.mp4',
      deviceId: 'CAM007',
      deviceName: '球型摄像头-07',
      location: '电梯间',
      recordTime: '2024-01-15 11:45:00',
      duration: '01:30:10',
      fileSize: '750MB',
      resolution: '1280x720',
      quality: '720P',
      frameRate: '25fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/elevator_20240115.jpg'
    },
    {
      id: 'local_006',
      fileName: 'outdoor_plaza_20240114_152000.mp4',
      filePath: '/videos/local/outdoor_plaza_20240114_152000.mp4',
      deviceId: 'CAM008',
      deviceName: '夜视摄像头-08',
      location: '室外广场',
      recordTime: '2024-01-14 15:20:00',
      duration: '02:45:30',
      fileSize: '1.5GB',
      resolution: '1920x1080',
      quality: '1080P',
      frameRate: '30fps',
      format: 'MP4',
      status: '正常',
      thumbnail: '/thumbnails/outdoor_plaza_20240114.jpg'
    }
  ],

  // 监控数据列表
  monitoringList: [
    {
      id: 'monitor_001',
      deviceId: 'CAM001',
      deviceName: '高清摄像头-01',
      location: '主入口大厅',
      status: '在线',
      lastHeartbeat: '2024-01-16 10:30:00',
      streamUrl: 'rtmp://localhost:1935/live/cam001',
      isRecording: true,
      recordingStartTime: '2024-01-16 08:00:00',
      currentFileSize: '450MB',
      diskUsage: '65%',
      networkStatus: '良好',
      signalStrength: '95%'
    },
    {
      id: 'monitor_002',
      deviceId: 'CAM002',
      deviceName: '监控摄像头-02',
      location: '停车场入口',
      status: '在线',
      lastHeartbeat: '2024-01-16 10:29:00',
      streamUrl: 'rtmp://localhost:1935/live/cam002',
      isRecording: true,
      recordingStartTime: '2024-01-16 08:00:00',
      currentFileSize: '380MB',
      diskUsage: '58%',
      networkStatus: '良好',
      signalStrength: '88%'
    },
    {
      id: 'monitor_003',
      deviceId: 'CAM003',
      deviceName: '安防摄像头-03',
      location: '办公区走廊',
      status: '维护中',
      lastHeartbeat: '2024-01-15 16:45:00',
      streamUrl: '',
      isRecording: false,
      recordingStartTime: '',
      currentFileSize: '0MB',
      diskUsage: '45%',
      networkStatus: '离线',
      signalStrength: '0%'
    },
    {
      id: 'monitor_004',
      deviceId: 'CAM006',
      deviceName: '智能摄像头-06',
      location: '生产车间',
      status: '在线',
      lastHeartbeat: '2024-01-16 10:30:00',
      streamUrl: 'rtmp://localhost:1935/live/cam006',
      isRecording: true,
      recordingStartTime: '2024-01-16 08:00:00',
      currentFileSize: '520MB',
      diskUsage: '72%',
      networkStatus: '良好',
      signalStrength: '92%'
    },
    {
      id: 'monitor_005',
      deviceId: 'CAM007',
      deviceName: '球型摄像头-07',
      location: '电梯间',
      status: '在线',
      lastHeartbeat: '2024-01-16 10:28:00',
      streamUrl: 'rtmp://localhost:1935/live/cam007',
      isRecording: true,
      recordingStartTime: '2024-01-16 08:00:00',
      currentFileSize: '320MB',
      diskUsage: '42%',
      networkStatus: '良好',
      signalStrength: '85%'
    },
    {
      id: 'monitor_006',
      deviceId: 'CAM008',
      deviceName: '夜视摄像头-08',
      location: '室外广场',
      status: '在线',
      lastHeartbeat: '2024-01-16 10:30:00',
      streamUrl: 'rtmp://localhost:1935/live/cam008',
      isRecording: true,
      recordingStartTime: '2024-01-16 08:00:00',
      currentFileSize: '480MB',
      diskUsage: '68%',
      networkStatus: '良好',
      signalStrength: '90%'
    }
  ],

  // 分页信息
  pagination: {
    total: 6,
    page: 1,
    pageSize: 10,
    totalPages: 1
  }
}

// 模拟API响应格式
export const createMockVideoResponse = (data, success = true, message = '操作成功') => {
  return {
    data: {
      success,
      message,
      data,
      timestamp: new Date().toISOString()
    }
  }
}

// 视频状态选项
export const videoStatusOptions = [
  { label: '正常', value: '正常' },
  { label: '损坏', value: '损坏' },
  { label: '处理中', value: '处理中' }
]

// 视频质量选项
export const videoQualityOptions = [
  { label: '1080P', value: '1080P' },
  { label: '720P', value: '720P' },
  { label: '480P', value: '480P' },
  { label: '4K', value: '4K' }
]

// 监控状态选项
export const monitorStatusOptions = [
  { label: '在线', value: '在线' },
  { label: '离线', value: '离线' },
  { label: '维护中', value: '维护中' },
  { label: '故障', value: '故障' }
]

// 网络状态选项
export const networkStatusOptions = [
  { label: '良好', value: '良好' },
  { label: '一般', value: '一般' },
  { label: '较差', value: '较差' },
  { label: '离线', value: '离线' }
]