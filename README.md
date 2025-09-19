# 🎥 视频监控管理系统

[![Vue.js](https://img.shields.io/badge/Vue.js-2.6.14-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Element UI](https://img.shields.io/badge/Element%20UI-2.15.6-409EFF?style=flat-square&logo=element)](https://element.eleme.io/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> 一个基于Vue.js的现代化视频监控管理系统，采用前后端分离架构，支持设备管理、实时监控、视频管理、数据统计等功能。系统具备完善的数据回退机制，确保在后端服务不可用时仍能正常运行。

## 📋 目录

- [核心功能](#-核心功能)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [数据回退机制](#-数据回退机制)
- [API接口文档](#-api接口文档)
- [测试账号](#-测试账号)
- [开发指南](#-开发指南)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)

## 🎯 核心功能

### 设备管理
- **设备信息管理**: 完整的设备增删改查功能
- **设备状态监控**: 实时监控设备在线状态
- **设备位置管理**: 支持设备位置信息管理
- **设备类型分类**: 支持多种设备类型（摄像头、传感器等）
- **维护状态跟踪**: 设备维护状态和清洁模式管理

### 视频监控
- **实时视频流**: 支持RTMP/HTTP视频流播放
- **本地视频管理**: 本地视频文件的管理和播放
- **视频录制**: 支持手动和自动录制功能
- **视频下载**: 支持视频文件下载和导出
- **视频质量监控**: 实时监控视频质量和网络状态

### 数据统计
- **设备运行统计**: 设备在线率、故障率统计
- **视频存储统计**: 存储空间使用情况分析
- **系统性能监控**: CPU、内存、网络使用情况
- **可视化图表**: 基于Chart.js的数据可视化展示

### 报警管理
- **实时报警监控**: 支持运动检测、设备故障等报警
- **报警确认处理**: 报警确认和处理流程
- **报警统计分析**: 报警趋势和统计分析
- **报警级别管理**: 支持高、中、低优先级报警

### 用户管理
- **用户认证**: JWT Token认证机制
- **权限管理**: 基于角色的权限控制
- **用户信息管理**: 用户资料和偏好设置

## 🛡️ 数据回退机制

### 工作原理
系统实现了完整的数据回退（fallback）机制，确保在后端服务不可用时前端仍能正常运行：

1. **优先后端**: 首先尝试调用后端API获取真实数据
2. **自动回退**: 后端不可用时自动切换到本地测试数据
3. **透明切换**: 对前端组件完全透明，保持相同的数据格式
4. **状态提示**: 在控制台输出当前使用的数据源信息

### 支持功能
- ✅ **设备管理**: 设备列表、创建、更新、删除
- ✅ **视频监控**: 监控数据、本地视频列表
- ✅ **数据统计**: 概览数据、图表数据
- ✅ **报警管理**: 报警列表、统计数据
- ✅ **用户认证**: 测试账号登录验证

### 测试数据
- **设备数据**: 8个模拟设备，涵盖不同状态和位置
- **视频数据**: 6个本地视频文件和6个监控设备数据
- **统计数据**: 完整的系统运行统计信息
- **报警数据**: 多种类型和级别的报警信息

## 🚀 技术栈

### 前端技术
- **Vue.js 2.6.14**: 渐进式JavaScript框架
- **Vue Router 3.5.1**: 官方路由管理器
- **Element UI 2.15.6**: 基于Vue的桌面端组件库
- **Axios 1.6.0**: Promise based HTTP客户端
- **Babel**: JavaScript编译器，支持ES6+语法

### 后端技术
- **Node.js**: JavaScript运行环境
- **Express.js**: 快速、开放、极简的Web框架
- **CORS**: 跨域资源共享中间件
- **JWT**: JSON Web Token认证

### 开发工具
- **Vue CLI 5.0**: Vue.js开发工具链
- **ESLint**: JavaScript代码检查工具
- **Babel**: JavaScript转译器

## 🚀 快速开始

### 环境要求
- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0
- **浏览器**: Chrome 70+, Firefox 65+, Safari 12+

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd webAfter

# 安装前端依赖
npm install

# 如果有后端服务，安装后端依赖
cd backend
npm install
cd ..
```

### 开发模式运行

```bash
# 启动前端开发服务器
npm run serve

# 如果需要后端服务（新终端窗口）
cd backend
node server.js
```

### 生产环境部署

```bash
# 构建前端
npm run build

# 部署dist目录到Web服务器
# 启动后端服务（如果需要）
cd backend
node server.js
```

### 访问地址
- **前端地址**: http://localhost:8080
- **后端地址**: http://localhost:3000 (如果启用)

## 🧪 测试账号

### 主要测试账号
为了方便测试和演示，系统提供了免验证的测试账号：

- **邮箱**: `test@test.com`
- **用户名**: `测试用户`
- **密码**: `test123`
- **角色**: `测试员`
- **权限**: `monitoring:view`（监控查看）

### 使用方法

#### 方法一：一键登录
1. 在登录页面点击 "🧪 测试账号登录" 按钮
2. 系统自动使用测试账号信息登录

#### 方法二：手动输入
1. 在登录表单的邮箱字段输入：`test@test.com` 或 `测试用户`
2. 在密码字段输入：`test123`
3. 点击登录按钮

### 其他预设账号
- **管理员账号**: `admin@example.com` / `password`
- **普通用户**: `user@example.com` / `password`

### 技术实现
- 登录时检查输入的邮箱/用户名和密码是否匹配测试账号
- 如果匹配，跳过后端API调用，直接在前端生成测试token
- 生成的token包含用户信息和权限数据
- 测试账号的API请求会添加 `X-Test-Account: true` 头部

## 📁 项目结构

```
webAfter/
├── 📁 public/                     # 静态资源目录
│   ├── favicon.ico                # 网站图标
│   └── index.html                 # HTML模板
├── 📁 src/                        # 源代码目录
│   ├── App.vue                    # 根组件
│   ├── main.js                    # 应用入口文件
│   ├── 📁 api/                    # 后端服务目录
│   │   ├── server.js              # 后端服务入口文件
│   │   ├── 📁 routes/             # 路由目录
│   │   └── 📁 mockData/           # 模拟数据目录
│   ├── 📁 assets/                 # 静态资源
│   │   ├── 📁 css/                # 样式文件
│   │   ├── 📁 images/             # 图片资源
│   │   └── 📁 styles/             # 全局样式
│   ├── 📁 components/             # 组件目录
│   │   ├── 📁 API/                # API服务层
│   │   │   ├── apiService.js      # API服务，包含fallback逻辑
│   │   │   └── 📁 mockData/       # 测试数据
│   │   │       ├── equipmentMockData.js  # 设备管理测试数据
│   │   │       └── videoMockData.js      # 视频监控测试数据
│   │   ├── 📁 js/                 # JavaScript逻辑文件
│   │   │   ├── EquipmentPage.js   # 设备管理页面逻辑
│   │   │   ├── MonitoringPage.js  # 监控页面逻辑
│   │   │   ├── VideoPage.js       # 视频管理页面逻辑
│   │   │   └── LoginPage.js       # 登录页面逻辑
│   │   └── 📁 CSS/                # 样式文件
│   │       ├── EquipmentPage.css  # 设备管理页面样式
│   │       ├── MonitoringPage.css # 监控页面样式
│   │       └── VideoPage.css      # 视频管理页面样式
│   ├── 📁 router/                 # 路由配置
│   │   └── index.js               # 路由定义文件
│   └── 📁 views/                  # 页面组件
│       ├── 📁 AlarmPage/          # 报警管理页面
│       ├── 📁 CleaningTaskPage/   # 清洁任务页面
│       ├── 📁 DataStatisticesPage/ # 数据统计页面
│       ├── 📁 EquipmentPage/      # 设备管理页面
│       ├── 📁 LoginPage/          # 登录页面
│       ├── 📁 MainPage/           # 主页面
│       ├── 📁 MaintenancePage/    # 维护页面
│       ├── 📁 MonitoringPage/     # 监控页面
│       ├── 📁 StatePage/          # 状态页面
│       ├── 📁 UserPage/           # 用户页面
│       └── 📁 VideoPage/          # 视频页面
├── 📁 docs/                       # 项目文档
│   ├── API接口文档.md             # API接口规范
│   ├── 数据回退机制.md            # 数据回退机制说明
│   ├── 前端测试账户.md            # 测试账号信息
│   ├── 项目结构.md                # 项目结构说明
│   └── 项目说明.md                # 项目功能说明
├── .editorconfig                  # 编辑器配置
├── .gitignore                     # Git忽略文件
├── babel.config.js                # Babel配置文件
├── jsconfig.json                  # JavaScript配置文件
├── package.json                   # 项目依赖和脚本
└── README.md                      # 项目说明文档
```

### 关键目录说明

#### `src/components/API/`
- **apiService.js**: 统一的API服务层，包含数据回退逻辑
- **mockData/**: 本地测试数据，支持离线模式运行

#### `src/views/`
页面级组件，每个目录对应一个功能模块：
- **LoginPage**: 用户登录和认证
- **MainPage**: 主页面和导航
- **EquipmentPage**: 设备管理功能
- **MonitoringPage**: 实时监控功能
- **VideoPage**: 视频文件管理
- **DataStatisticesPage**: 数据统计和图表
- **AlarmPage**: 报警管理

#### `src/components/js/`
页面逻辑文件，包含各页面的业务逻辑和数据处理

## 📡 API接口文档

### API服务架构

```
前端组件 → apiService.js → 后端API服务
                ↓
            数据回退机制
                ↓
            本地测试数据
```

### 核心API服务

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

#### 监控管理API

##### `monitoringAPI.getMonitoringList(params)`
获取监控列表

##### `monitoringAPI.getLocalVideos(params)`
获取本地视频列表

#### 用户认证API

##### `authAPI.login(credentials)`
用户登录

##### `authAPI.getCurrentUser()`
获取当前用户信息

#### 统计数据API

##### `statisticsAPI.getOverviewData()`
获取概览数据

##### `statisticsAPI.getChartData(type, period)`
获取图表数据

### 后端REST API接口

#### 基础信息
- **基础URL**: `http://localhost:3000/api`
- **认证方式**: JWT Token
- **请求格式**: JSON
- **响应格式**: JSON

#### 通用响应格式

**成功响应：**
```javascript
{
  "success": true,
  "data": {}, // 具体数据
  "message": "操作成功",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

**错误响应：**
```javascript
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {}
  },
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "req_123456789"
}
```

#### 主要接口

##### 设备管理
- `GET /api/equipment` - 获取设备列表
- `POST /api/equipment` - 添加设备
- `PUT /api/equipment/:id` - 更新设备
- `DELETE /api/equipment/:id` - 删除设备

##### 监控管理
- `GET /api/monitoring` - 获取监控列表
- `GET /api/monitoring/videos` - 获取本地视频列表
- `POST /api/monitoring/start/:deviceId` - 开始录制
- `POST /api/monitoring/stop/:deviceId` - 停止录制

##### 用户认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

##### 统计数据
- `GET /api/statistics/overview` - 获取概览统计
- `GET /api/statistics/charts` - 获取图表数据

##### 报警管理
- `GET /api/alarms` - 获取报警列表
- `PUT /api/alarms/:id/acknowledge` - 确认报警
- `GET /api/alarms/statistics` - 获取报警统计

## 🛠️ 开发指南

### 开发环境设置

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd webAfter
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run serve
   ```

4. **代码检查**
   ```bash
   npm run lint
   ```

### 添加新功能

#### 1. 添加新页面
1. 在 `src/views/` 下创建新的页面目录
2. 创建 `.vue` 文件和相关样式
3. 在 `src/components/js/` 下创建对应的逻辑文件
4. 在路由配置中添加新路由

#### 2. 添加新API
1. 在 `src/components/API/apiService.js` 中添加API方法
2. 在 `src/components/API/mockData/` 中添加测试数据
3. 实现数据回退逻辑

#### 3. 添加新组件
1. 在 `src/components/` 下创建组件文件
2. 在需要的页面中引入和使用

### 调试指南

#### 1. 数据回退机制调试
- 关闭后端服务或修改API_BASE_URL
- 检查浏览器控制台的警告信息
- 验证页面功能是否正常

#### 2. 测试账号调试
- 检查登录逻辑中的测试账号验证
- 查看localStorage中的token和用户信息
- 验证API请求头中的测试标识

#### 3. 常见问题
- **页面空白**: 检查路由配置和组件引入
- **API调用失败**: 检查网络连接和API地址
- **样式问题**: 检查CSS文件引入和Element UI版本

### 代码规范

#### JavaScript
- 使用ES6+语法
- 遵循ESLint配置规则
- 使用驼峰命名法
- 添加必要的注释

#### Vue组件
- 使用单文件组件格式
- 合理使用生命周期钩子
- 数据和方法分离
- 使用props验证

#### CSS
- 使用BEM命名规范
- 避免全局样式污染
- 使用CSS变量定义主题色彩
- 响应式设计优先

## 🤝 贡献指南

我们欢迎所有形式的贡献，包括但不限于：

### 贡献类型
- 🐛 **Bug修复**: 修复现有功能的问题
- ✨ **新功能**: 添加新的功能特性
- 📚 **文档改进**: 完善项目文档
- 🎨 **UI/UX改进**: 改善用户界面和体验
- ⚡ **性能优化**: 提升系统性能
- 🧪 **测试**: 添加或改进测试用例

### 贡献流程

1. **Fork项目**
   ```bash
   # 点击GitHub页面的Fork按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/your-username/webAfter.git
   cd webAfter
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **进行开发**
   - 编写代码
   - 添加测试
   - 更新文档

5. **提交更改**
   ```bash
   git add .
   git commit -m "✨ Add amazing feature"
   ```

6. **推送分支**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **创建Pull Request**
   - 在GitHub上创建PR
   - 填写详细的描述
   - 等待代码审查

### 提交信息规范

使用以下格式的提交信息：

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型（type）：**
- `✨ feat`: 新功能
- `🐛 fix`: Bug修复
- `📚 docs`: 文档更新
- `🎨 style`: 代码格式调整
- `♻️ refactor`: 代码重构
- `⚡ perf`: 性能优化
- `🧪 test`: 测试相关
- `🔧 chore`: 构建过程或辅助工具的变动

**示例：**
```
✨ feat(equipment): add device batch import functionality

- Add CSV file upload support
- Implement data validation
- Add progress indicator
- Update API documentation

Closes #123
```

### 代码审查标准

- **功能性**: 代码是否实现了预期功能
- **可读性**: 代码是否清晰易懂
- **性能**: 是否存在性能问题
- **安全性**: 是否存在安全隐患
- **测试**: 是否包含适当的测试
- **文档**: 是否更新了相关文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

```
MIT License

Copyright (c) 2024 视频监控管理系统

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 📧 **邮件**: [your-email@example.com](mailto:your-email@example.com)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/your-username/webAfter/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/your-username/webAfter/discussions)
- 📖 **文档**: [项目Wiki](https://github.com/your-username/webAfter/wiki)

## 🙏 致谢

感谢以下开源项目和贡献者：

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element UI](https://element.eleme.io/) - Vue.js桌面端组件库
- [Axios](https://axios-http.com/) - Promise based HTTP客户端
- [Node.js](https://nodejs.org/) - JavaScript运行环境
- [Express.js](https://expressjs.com/) - Web应用框架

---

<div align="center">

**🎉 感谢使用视频监控管理系统！**

如果这个项目对您有帮助，请给我们一个 ⭐️

[⬆️ 回到顶部](#-视频监控管理系统)

</div>