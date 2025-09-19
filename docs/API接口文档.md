# API接口文档

## 概述

本文档描述了视频监控管理系统的所有API接口，包括前端API服务层和后端REST API接口。系统采用数据回退机制，优先使用后端数据，后端不可用时自动切换到本地测试数据。

## API服务架构

```
前端组件 → apiService.js → 后端API服务
                ↓
            数据回退机制
                ↓
            本地测试数据
```

## 前端API服务层

### 文件位置
`src/components/API/apiService.js`

### 核心功能
- 统一管理所有API调用
- 实现数据回退机制
- 处理请求和响应
- 错误处理和日志记录

### API服务方法

#### 设备管理API

##### `equipmentAPI.getEquipmentList(params)`
获取设备列表

**参数：**
```javascript
{
  page: 1,           // 页码
  pageSize: 10,      // 每页数量
  deviceId: '',      // 设备ID（可选）
  deviceName: '',    // 设备名称（可选）
  location: '',      // 位置（可选）
  status: ''         // 状态（可选）
}
```

**返回值：**
```javascript
{
  success: true,
  data: {
    list: [           // 设备列表
      {
        id: 1,
        deviceId: 'DEV001',
        deviceName: '前门摄像头',
        location: '主入口',
        status: 'online',
        lastOnline: '2024-01-15 10:30:00',
        quality: 95
      }
    ],
    total: 100,       // 总数量
    page: 1,          // 当前页码
    pageSize: 10      // 每页数量
  }
}
```

##### `equipmentAPI.addEquipment(data)`
添加设备

**参数：**
```javascript
{
  deviceId: 'DEV001',
  deviceName: '前门摄像头',
  location: '主入口',
  ip: '192.168.1.100',
  port: 8080
}
```

##### `equipmentAPI.updateEquipment(id, data)`
更新设备信息

##### `equipmentAPI.deleteEquipment(id)`
删除设备

#### 监控管理API

##### `monitoringAPI.getMonitoringList(params)`
获取监控列表

**参数：**
```javascript
{
  page: 1,
  pageSize: 10,
  deviceId: '',
  status: ''
}
```

**返回值：**
```javascript
{
  success: true,
  data: {
    list: [
      {
        id: 1,
        deviceId: 'MON001',
        deviceName: '前门监控',
        location: '主入口',
        status: 'recording',
        streamUrl: 'rtmp://example.com/live/stream1',
        quality: 'HD',
        lastUpdate: '2024-01-15 10:30:00'
      }
    ],
    total: 50
  }
}
```

##### `monitoringAPI.getLocalVideos(params)`
获取本地视频列表

**参数：**
```javascript
{
  page: 1,
  pageSize: 10,
  deviceId: '',
  fileName: '',
  startDate: '',
  endDate: ''
}
```

**返回值：**
```javascript
{
  success: true,
  data: {
    list: [
      {
        id: 1,
        fileName: 'video_20240115_103000.mp4',
        deviceId: 'DEV001',
        deviceName: '前门摄像头',
        location: '主入口',
        duration: '00:15:30',
        fileSize: '256MB',
        quality: 'HD',
        recordTime: '2024-01-15 10:30:00',
        status: 'completed',
        filePath: '/videos/video_20240115_103000.mp4'
      }
    ],
    total: 200
  }
}
```

#### 用户认证API

##### `authAPI.login(credentials)`
用户登录

**参数：**
```javascript
{
  username: 'admin',
  password: 'password'
}
```

**返回值：**
```javascript
{
  success: true,
  data: {
    token: 'jwt_token_here',
    user: {
      id: 1,
      username: 'admin',
      role: 'admin',
      permissions: ['read', 'write', 'delete']
    }
  }
}
```

##### `authAPI.logout()`
用户登出

##### `authAPI.getCurrentUser()`
获取当前用户信息

#### 统计数据API

##### `statisticsAPI.getOverviewData()`
获取概览数据

**返回值：**
```javascript
{
  success: true,
  data: {
    totalDevices: 25,
    onlineDevices: 23,
    totalVideos: 1500,
    todayRecordings: 45,
    storageUsed: '2.5TB',
    storageTotal: '10TB'
  }
}
```

##### `statisticsAPI.getChartData(type, period)`
获取图表数据

**参数：**
- `type`: 数据类型（'device', 'video', 'storage'）
- `period`: 时间周期（'day', 'week', 'month'）

#### 报警管理API

##### `alarmAPI.getAlarmList(params)`
获取报警列表

##### `alarmAPI.acknowledgeAlarm(id)`
确认报警

##### `alarmAPI.getAlarmStatistics()`
获取报警统计

## 后端REST API接口

### 基础信息
- **基础URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token
- **请求格式**: JSON
- **响应格式**: JSON

### 通用响应格式

#### 成功响应
```javascript
{
  "success": true,
  "data": {}, // 具体数据
  "message": "操作成功"
}
```

#### 错误响应
```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述"
  }
}
```

### 设备管理接口

#### GET `/api/equipment`
获取设备列表

**查询参数：**
- `page`: 页码（默认1）
- `pageSize`: 每页数量（默认10）
- `deviceId`: 设备ID筛选
- `deviceName`: 设备名称筛选
- `location`: 位置筛选
- `status`: 状态筛选

#### POST `/api/equipment`
添加设备

**请求体：**
```javascript
{
  "deviceId": "DEV001",
  "deviceName": "前门摄像头",
  "location": "主入口",
  "ip": "192.168.1.100",
  "port": 8080
}
```

#### PUT `/api/equipment/:id`
更新设备信息

#### DELETE `/api/equipment/:id`
删除设备

### 监控管理接口

#### GET `/api/monitoring`
获取监控列表

#### GET `/api/monitoring/videos`
获取本地视频列表

#### POST `/api/monitoring/start/:deviceId`
开始录制

#### POST `/api/monitoring/stop/:deviceId`
停止录制

### 用户认证接口

#### POST `/api/auth/login`
用户登录

**请求体：**
```javascript
{
  "username": "admin",
  "password": "password"
}
```

#### POST `/api/auth/logout`
用户登出

#### GET `/api/auth/me`
获取当前用户信息

**请求头：**
```
Authorization: Bearer <jwt_token>
```

### 统计数据接口

#### GET `/api/statistics/overview`
获取概览统计

#### GET `/api/statistics/charts`
获取图表数据

**查询参数：**
- `type`: 数据类型
- `period`: 时间周期

### 报警管理接口

#### GET `/api/alarms`
获取报警列表

#### PUT `/api/alarms/:id/acknowledge`
确认报警

#### GET `/api/alarms/statistics`
获取报警统计

## 后端响应数据格式规范

### 通用响应结构

所有后端API接口必须遵循统一的响应格式，确保前端能够正确解析和处理数据。

#### 标准成功响应
```javascript
{
  "success": true,
  "data": {
    // 具体业务数据
  },
  "message": "操作成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 标准错误响应
```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "详细错误描述",
    "details": {
      // 错误详细信息（可选）
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 分页数据响应格式

对于需要分页的接口，响应数据必须包含分页信息：

```javascript
{
  "success": true,
  "data": {
    "list": [
      // 数据列表
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "获取成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 设备管理接口响应格式

#### 设备列表响应
```javascript
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "deviceId": "DEV001",
        "deviceName": "前门摄像头",
        "installationLocation": "主入口",
        "deviceStatus": "online",
        "cleaningMode": "auto",
        "deviceType": "camera",
        "lastCleaningTime": "2024-01-15 09:30:00",
        "maintenanceStatus": "normal",
        "createTime": "2024-01-01 10:00:00",
        "updateTime": "2024-01-15 10:30:00",
        "ip": "192.168.1.100",
        "port": 8080,
        "manufacturer": "海康威视",
        "model": "DS-2CD2T47G1-L",
        "firmwareVersion": "V5.6.3",
        "resolution": "1920x1080",
        "frameRate": 25,
        "bitRate": 4096
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "获取设备列表成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 单个设备响应
```javascript
{
  "success": true,
  "data": {
    "id": 1,
    "deviceId": "DEV001",
    "deviceName": "前门摄像头",
    "installationLocation": "主入口",
    "deviceStatus": "online",
    "cleaningMode": "auto",
    "deviceType": "camera",
    "lastCleaningTime": "2024-01-15 09:30:00",
    "maintenanceStatus": "normal",
    "createTime": "2024-01-01 10:00:00",
    "updateTime": "2024-01-15 10:30:00",
    "ip": "192.168.1.100",
    "port": 8080,
    "manufacturer": "海康威视",
    "model": "DS-2CD2T47G1-L",
    "firmwareVersion": "V5.6.3",
    "resolution": "1920x1080",
    "frameRate": 25,
    "bitRate": 4096,
    "streamUrls": {
      "main": "rtmp://192.168.1.100:1935/live/main",
      "sub": "rtmp://192.168.1.100:1935/live/sub"
    },
    "capabilities": [
      "ptz",
      "nightVision",
      "motionDetection",
      "audioRecording"
    ]
  },
  "message": "获取设备信息成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 监控管理接口响应格式

#### 监控列表响应
```javascript
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "deviceId": "MON001",
        "deviceName": "前门监控",
        "location": "主入口",
        "status": "recording",
        "streamUrl": "rtmp://example.com/live/stream1",
        "quality": "HD",
        "resolution": "1920x1080",
        "frameRate": 25,
        "bitRate": 4096,
        "recordingStatus": "active",
        "storageUsed": "2.5GB",
        "lastUpdate": "2024-01-15 10:30:00",
        "uptime": "72:15:30",
        "networkStatus": "stable",
        "signalStrength": 95
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 50,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "获取监控列表成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 本地视频列表响应
```javascript
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "fileName": "video_20240115_103000.mp4",
        "deviceId": "DEV001",
        "deviceName": "前门摄像头",
        "location": "主入口",
        "duration": "00:15:30",
        "fileSize": 268435456,
        "fileSizeFormatted": "256MB",
        "quality": "HD",
        "resolution": "1920x1080",
        "frameRate": 25,
        "bitRate": 4096,
        "recordTime": "2024-01-15 10:30:00",
        "endTime": "2024-01-15 10:45:30",
        "status": "completed",
        "filePath": "/videos/2024/01/15/video_20240115_103000.mp4",
        "thumbnailPath": "/thumbnails/2024/01/15/video_20240115_103000.jpg",
        "downloadUrl": "/api/videos/download/1",
        "streamUrl": "/api/videos/stream/1",
        "checksum": "md5:a1b2c3d4e5f6g7h8i9j0",
        "tags": ["motion", "entrance"],
        "metadata": {
          "codec": "H.264",
          "audioCodec": "AAC",
          "container": "MP4",
          "hasAudio": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 200,
      "totalPages": 20,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "totalSize": 53687091200,
      "totalSizeFormatted": "50GB",
      "totalDuration": "120:45:30",
      "oldestRecord": "2024-01-01 00:00:00",
      "newestRecord": "2024-01-15 10:45:30"
    }
  },
  "message": "获取视频列表成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 用户认证接口响应格式

#### 登录响应
```javascript
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": [
        "equipment:read",
        "equipment:write",
        "equipment:delete",
        "monitoring:read",
        "monitoring:write",
        "users:read",
        "users:write",
        "statistics:read"
      ],
      "profile": {
        "firstName": "管理员",
        "lastName": "系统",
        "avatar": "/avatars/admin.jpg",
        "department": "技术部",
        "phone": "13800138000"
      },
      "lastLoginTime": "2024-01-15 10:30:00",
      "createTime": "2024-01-01 10:00:00",
      "status": "active"
    }
  },
  "message": "登录成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 统计数据接口响应格式

#### 概览数据响应
```javascript
{
  "success": true,
  "data": {
    "overview": {
      "totalDevices": 25,
      "onlineDevices": 23,
      "offlineDevices": 2,
      "totalVideos": 1500,
      "todayRecordings": 45,
      "storageUsed": 2748779069440,
      "storageUsedFormatted": "2.5TB",
      "storageTotal": 10995116277760,
      "storageTotal Formatted": "10TB",
      "storageUsagePercent": 25.0,
      "activeAlarms": 3,
      "resolvedAlarmsToday": 12
    },
    "deviceStatus": {
      "online": 23,
      "offline": 2,
      "maintenance": 0,
      "error": 0
    },
    "recordingStatus": {
      "recording": 20,
      "stopped": 3,
      "scheduled": 2
    },
    "recentActivity": [
      {
        "type": "device_online",
        "deviceId": "DEV001",
        "deviceName": "前门摄像头",
        "timestamp": "2024-01-15 10:25:00",
        "message": "设备重新上线"
      },
      {
        "type": "recording_started",
        "deviceId": "DEV002",
        "deviceName": "后门摄像头",
        "timestamp": "2024-01-15 10:20:00",
        "message": "开始录制"
      }
    ]
  },
  "message": "获取概览数据成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 图表数据响应
```javascript
{
  "success": true,
  "data": {
    "chartType": "device_status_trend",
    "period": "week",
    "labels": [
      "2024-01-09",
      "2024-01-10",
      "2024-01-11",
      "2024-01-12",
      "2024-01-13",
      "2024-01-14",
      "2024-01-15"
    ],
    "datasets": [
      {
        "label": "在线设备",
        "data": [22, 23, 21, 24, 23, 22, 23],
        "backgroundColor": "#4CAF50",
        "borderColor": "#4CAF50"
      },
      {
        "label": "离线设备",
        "data": [3, 2, 4, 1, 2, 3, 2],
        "backgroundColor": "#F44336",
        "borderColor": "#F44336"
      }
    ],
    "summary": {
      "averageOnline": 22.6,
      "maxOnline": 24,
      "minOnline": 21,
      "trend": "stable"
    }
  },
  "message": "获取图表数据成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 报警管理接口响应格式

#### 报警列表响应
```javascript
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "alarmId": "ALM001",
        "deviceId": "DEV001",
        "deviceName": "前门摄像头",
        "alarmType": "motion_detection",
        "alarmLevel": "medium",
        "status": "active",
        "title": "运动检测报警",
        "description": "检测到异常运动",
        "location": "主入口",
        "triggerTime": "2024-01-15 10:25:00",
        "acknowledgeTime": null,
        "resolveTime": null,
        "acknowledgedBy": null,
        "resolvedBy": null,
        "priority": 2,
        "metadata": {
          "confidence": 0.85,
          "objectType": "person",
          "boundingBox": {
            "x": 100,
            "y": 150,
            "width": 200,
            "height": 300
          },
          "snapshotUrl": "/api/alarms/1/snapshot",
          "videoClipUrl": "/api/alarms/1/video"
        },
        "tags": ["entrance", "after_hours"]
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 15,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    },
    "summary": {
      "activeAlarms": 3,
      "acknowledgedAlarms": 8,
      "resolvedAlarms": 4,
      "highPriorityAlarms": 1,
      "mediumPriorityAlarms": 2,
      "lowPriorityAlarms": 0
    }
  },
  "message": "获取报警列表成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

### 字段类型说明

#### 通用字段类型
- `id`: 整数，主键ID
- `timestamp`: 字符串，ISO 8601格式时间戳
- `success`: 布尔值，操作是否成功
- `message`: 字符串，操作结果描述
- `requestId`: 字符串，请求唯一标识符

#### 设备相关字段
- `deviceId`: 字符串，设备唯一标识
- `deviceName`: 字符串，设备名称
- `deviceStatus`: 枚举，设备状态（online, offline, maintenance, error）
- `deviceType`: 枚举，设备类型（camera, sensor, controller）
- `cleaningMode`: 枚举，清洁模式（auto, manual, scheduled, off）
- `maintenanceStatus`: 枚举，维护状态（normal, warning, critical, maintenance）

#### 时间字段格式
所有时间字段统一使用以下格式：
- 数据库存储：`YYYY-MM-DD HH:mm:ss`
- API响应：`YYYY-MM-DD HH:mm:ss`
- ISO时间戳：`YYYY-MM-DDTHH:mm:ss.sssZ`

#### 文件大小字段
- 原始字节数：整数类型
- 格式化大小：字符串类型（如 "256MB", "2.5GB"）

### 错误响应详细格式

#### 验证错误
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": {
      "fields": [
        {
          "field": "deviceName",
          "message": "设备名称不能为空",
          "value": ""
        },
        {
          "field": "ip",
          "message": "IP地址格式不正确",
          "value": "192.168.1"
        }
      ]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 权限错误
```javascript
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "权限不足，无法执行此操作",
    "details": {
      "requiredPermission": "equipment:delete",
      "userPermissions": ["equipment:read", "equipment:write"]
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 资源不存在错误
```javascript
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "请求的资源不存在",
    "details": {
      "resourceType": "equipment",
      "resourceId": "DEV999"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

## 数据回退机制

### 工作原理
1. **优先后端**: 首先尝试调用后端API
2. **自动回退**: 后端不可用时自动使用本地测试数据
3. **透明切换**: 对前端组件透明，保持相同的数据格式
4. **状态提示**: 控制台输出当前使用的数据源

### 测试数据

#### 设备测试数据
位置：`src/components/API/mockData/equipmentMockData.js`

包含8个模拟设备，涵盖不同状态和位置。

#### 视频测试数据
位置：`src/components/API/mockData/videoMockData.js`

包含6个本地视频文件和6个监控设备数据。

### 配置选项

```javascript
// 在apiService.js中配置
const API_CONFIG = {
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  fallbackEnabled: true,  // 启用数据回退
  logLevel: 'info'        // 日志级别
};
```

## 错误处理

### 错误类型
- **网络错误**: 连接超时、网络不可达
- **认证错误**: Token过期、权限不足
- **业务错误**: 参数错误、数据不存在
- **服务器错误**: 内部服务器错误

### 错误码定义
- `AUTH_001`: 认证失败
- `AUTH_002`: Token过期
- `PERM_001`: 权限不足
- `DATA_001`: 数据不存在
- `PARAM_001`: 参数错误
- `SERVER_001`: 服务器内部错误

## 安全考虑

### 认证机制
- 使用JWT Token进行身份认证
- Token有效期为24小时
- 支持Token刷新机制

### 权限控制
- 基于角色的访问控制（RBAC）
- 接口级权限验证
- 前端路由权限控制

### 数据安全
- 敏感数据加密传输
- SQL注入防护
- XSS攻击防护
- CSRF攻击防护

## 性能优化

### 缓存策略
- 设备列表缓存5分钟
- 用户信息缓存30分钟
- 静态数据长期缓存

### 分页处理
- 默认每页10条记录
- 最大每页100条记录
- 支持无限滚动加载

### 请求优化
- 请求去重
- 自动重试机制
- 请求超时控制

## 开发指南

### 添加新API
1. 在`apiService.js`中添加API方法
2. 实现数据回退逻辑
3. 添加对应的测试数据
4. 更新API文档

### 测试API
```javascript
// 测试设备API
equipmentAPI.getEquipmentList({ page: 1, pageSize: 10 })
  .then(response => {
    console.log('设备列表:', response.data);
  })
  .catch(error => {
    console.error('获取失败:', error);
  });
```

### 调试技巧
- 使用浏览器开发者工具查看网络请求
- 检查控制台日志了解数据源
- 使用Postman测试后端API
- 临时禁用数据回退测试后端连接

## 版本历史

### v1.0.0
- 初始版本
- 基础API接口
- 数据回退机制

### v1.1.0
- 添加视频管理API
- 优化错误处理
- 增强安全性

### v1.2.0
- 添加统计数据API
- 性能优化
- 文档完善

## 联系方式

如有API相关问题，请联系开发团队或查看项目README文件。