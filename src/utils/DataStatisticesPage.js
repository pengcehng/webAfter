// src/components/js/DataStatisticesPage.js
import { statisticsAPI } from '../api/apiService'

export default {
  data () {
    return {
      activeIndex2: '5', // 设置默认激活的菜单项
      loading: false,
      // 日统计数据
      dailyStats: [],
      // 月度统计数据
      monthlyStats: {},
      // 设备类型统计
      deviceTypeStats: [],
      // 报警统计
      alertStats: [],
      // 用户活动统计
      userActivityStats: [],
      // 存储统计
      storageStats: {
        totalCapacity: '10TB',
        usedSpace: '2.5TB',
        freeSpace: '7.5TB',
        usagePercentage: 25,
        dailyGrowth: '150GB',
        estimatedDaysLeft: 50,
        byLocation: [
          { location: '主入口大厅', size: '500GB', percentage: 20 },
          { location: '停车场A区', size: '400GB', percentage: 16 },
          { location: '办公区走廊', size: '300GB', percentage: 12 },
          { location: '仓库区域', size: '600GB', percentage: 24 },
          { location: '会议室', size: '200GB', percentage: 8 },
          { location: '其他区域', size: '500GB', percentage: 20 }
        ]
      },
      // 性能统计
      performanceStats: {
        avgCpuUsage: 45,
        avgMemoryUsage: 68,
        avgNetworkUsage: 32,
        avgDiskUsage: 25,
        responseTime: {
          min: '50ms',
          max: '300ms',
          avg: '120ms'
        },
        throughput: '1.2GB/hour',
        errorRate: '0.02%'
      },
      // 时间范围选择
      timeRange: 'week',
      timeRangeOptions: [
        { label: '今日', value: 'today' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' }
      ],
      // 图表配置
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: '设备状态统计'
          }
        }
      }
    }
  },
  computed: {
    // 计算设备在线率
    deviceOnlineRate () {
      const total = this.monthlyStats.totalDevices
      const online = this.dailyStats[this.dailyStats.length - 1]?.onlineDevices || 0
      return total > 0 ? ((online / total) * 100).toFixed(1) : 0
    },
    // 计算存储使用率
    storageUsageRate () {
      return this.storageStats.usagePercentage
    },
    // 计算报警趋势
    alertTrend () {
      const recent = this.dailyStats.slice(-3)
      const avgRecent = recent.reduce((sum, day) => sum + day.alerts, 0) / recent.length
      const previous = this.dailyStats.slice(-6, -3)
      const avgPrevious = previous.reduce((sum, day) => sum + day.alerts, 0) / previous.length
      
      if (avgRecent > avgPrevious) return 'increasing'
      if (avgRecent < avgPrevious) return 'decreasing'
      return 'stable'
    }
  },
  methods: {
    // 获取统计数据
    async fetchStatistics () {
      this.loading = true
      try {
        const response = await statisticsAPI.getStatistics({
          timeRange: this.timeRange
        })
        const data = response.data
        this.dailyStats = data.dailyStats || []
        this.monthlyStats = data.monthlyStats || {}
        this.deviceTypeStats = data.deviceTypeStats || []
        this.alertStats = data.alertStats || []
        this.userActivityStats = data.userActivityStats || []
        
        // 更新存储统计
        if (data.storageStats) {
          this.storageStats = { ...this.storageStats, ...data.storageStats }
        }
        
        // 更新性能统计
        if (data.performanceStats) {
          this.performanceStats = { ...this.performanceStats, ...data.performanceStats }
        }
        
        this.loading = false
        this.$message.success('统计数据加载成功')
      } catch (error) {
        console.error('获取统计数据失败:', error)
        this.$message.error('获取统计数据失败')
        this.loading = false
      }
    },
    // 处理时间范围变化
    handleTimeRangeChange (range) {
      this.timeRange = range
      this.fetchStatistics()
    },
    // 导出报告
    async exportReport () {
      try {
        const response = await statisticsAPI.exportStatistics({
          timeRange: this.timeRange
        })
        
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `统计报告_${new Date().toISOString().split('T')[0]}.xlsx`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        
        this.$message.success('报告导出成功')
      } catch (error) {
        console.error('导出报告失败:', error)
        this.$message.error('导出报告失败')
      }
    },
    // 刷新数据
    refreshData () {
      this.fetchStatistics()
      this.$message.success('数据已刷新')
    },
    // 获取设备状态颜色
    getDeviceStatusColor (status) {
      const colorMap = {
        '正常': '#67C23A',
        '部分故障': '#E6A23C',
        '故障': '#F56C6C'
      }
      return colorMap[status] || '#909399'
    },
    // 获取报警严重程度颜色
    getAlertSeverityColor (severity) {
      const colorMap = {
        'high': '#F56C6C',
        'medium': '#E6A23C',
        'low': '#67C23A'
      }
      return colorMap[severity] || '#909399'
    },
    // 格式化文件大小
    formatFileSize (bytes) {
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 B'
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    }
  },
  mounted () {
    this.fetchStatistics()
  }
}