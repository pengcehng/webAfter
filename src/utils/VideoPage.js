import { monitoringAPI } from '../api/apiService'
import { mockVideoData } from '../api/mockData/videoMockData'

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      // 查询表单
      queryForm: {
        deviceId: '',
        fileName: '',
        dateRange: []
      },
      // 分页信息
      currentPage: 1,
      pageSize: 10,
      total: 0,
      // 加载状态
      loading: false,
      // 预览对话框
      previewDialogVisible: false,
      currentVideo: null
    }
  },
  
  created() {
    this.fetchData()
  },
  
  methods: {
    // 获取视频数据
    async fetchData() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          deviceId: this.queryForm.deviceId || undefined,
          fileName: this.queryForm.fileName || undefined
        }
        
        // 处理时间范围
        if (this.queryForm.dateRange && this.queryForm.dateRange.length === 2) {
          params.startTime = this.queryForm.dateRange[0]
          params.endTime = this.queryForm.dateRange[1]
        }
        
        // 移除空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key]
          }
        })
        
        try {
          const response = await monitoringAPI.getLocalVideos(params)
          
          if (response.data.success) {
            this.tableData = response.data.data.list || []
            this.total = response.data.data.total || 0
          } else {
            throw new Error(response.data.message || '获取视频数据失败')
          }
        } catch (error) {
          console.warn('API调用失败，使用本地数据:', error.message)
          // 使用本地mock数据作为fallback
          this.tableData = mockVideoData.localVideos || []
          this.total = this.tableData.length
          
          // 应用筛选
          if (this.queryForm.deviceId) {
            this.tableData = this.tableData.filter(item => 
              item.deviceId.includes(this.queryForm.deviceId)
            )
          }
          if (this.queryForm.fileName) {
            this.tableData = this.tableData.filter(item => 
              item.fileName.includes(this.queryForm.fileName)
            )
          }
          
          // 应用分页
          const start = (this.currentPage - 1) * this.pageSize
          const end = start + this.pageSize
          this.tableData = this.tableData.slice(start, end)
        }
        
        if (this.tableData.length === 0 && this.currentPage > 1) {
          // 如果当前页没有数据且不是第一页，回到第一页
          this.currentPage = 1
          this.fetchData()
        }
      } catch (error) {
        console.error('获取视频数据失败:', error)
        this.$message.error('获取视频数据失败')
        this.tableData = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchData()
    },
    
    // 重置搜索
    handleReset() {
      this.queryForm = {
        deviceId: '',
        fileName: '',
        dateRange: []
      }
      this.currentPage = 1
      this.fetchData()
    },
    
    // 刷新数据
    refreshData() {
      this.fetchData()
    },
    
    // 分页变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchData()
    },
    
    // 每页大小变化
    handlePageSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchData()
    },
    
    // 预览视频
    handlePreview(row) {
      this.currentVideo = row
      this.previewDialogVisible = true
      
      // 等待对话框打开后再设置视频源
      this.$nextTick(() => {
        if (this.$refs.videoPlayer) {
          this.$refs.videoPlayer.load()
        }
      })
    },
    
    // 关闭预览
    handleClosePreview() {
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause()
        this.$refs.videoPlayer.currentTime = 0
      }
      this.previewDialogVisible = false
      this.currentVideo = null
    },
    
    // 下载视频
    handleDownload(row) {
      try {
        // 创建下载链接
        const link = document.createElement('a')
        link.href = row.filePath
        link.download = row.fileName
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        this.$message.success('开始下载视频文件')
      } catch (error) {
        console.error('下载失败:', error)
        this.$message.error('下载失败，请检查文件路径')
      }
    },
    
    // 获取画质标签类型
    getQualityType(quality) {
      const qualityMap = {
        '超清': 'success',
        '高清': 'success', 
        '标清': 'warning',
        '低清': 'info'
      }
      return qualityMap[quality] || 'info'
    },
    
    // 获取状态标签类型
    getStatusType(status) {
      const statusMap = {
        '正常': 'success',
        '异常': 'danger',
        '离线': 'info'
      }
      return statusMap[status] || 'info'
    },
    
    // 获取视频海报
    getVideoPoster() {
      if (!this.currentVideo) return ''
      
      // 如果有缩略图，使用缩略图
      if (this.currentVideo.thumbnail) {
        return this.currentVideo.thumbnail
      }
      
      // 否则使用默认海报
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMWEyMDJjIDAlLCAjMmQzNzQ4IDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjMTBiOTgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPuinhumikeebruWJhTwvdGV4dD4KPC9zdmc+'
    }
  }
}