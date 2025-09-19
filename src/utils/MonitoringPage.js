import { monitoringAPI } from '../api/apiService'

export default {
  data () {
    return {
      // 视频列表数据
      tableData: [],
      // 查询表单
      queryForm: {
        recordingStoragePeriod: '',
        dateRange: '',
        monitoringId: ''
      },
      recordedVideos: {},
      activeIndex2: '4', // 设置默认激活的菜单项
      mediaRecorder: null,
      chunks: [],
      isRecording: false,
      recordingIndex: null,
      videoRefs: [],
      isLocalMode: false,
      videoFolder: '',
      loading: false,
      currentPage: 1,
      pageSize: 6,
      totalVideos: 0,
      displayedVideos: [],
      monitorUrls: []
    }
  },
  mounted () {
    this.fetchMonitorUrls()
  },

  watch: {
    // 监听当前页变化，更新显示的视频
    currentPage: {
      handler: function (newVal, oldVal) {
        this.updateDisplayedVideos()
      },
      immediate: true
    },

    // 监听视频列表变化，更新分页信息
    monitorUrls: {
      handler: function (newVal) {
        if (newVal && Array.isArray(newVal)) {
          this.totalVideos = newVal.length
          this.updateDisplayedVideos()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 根据画面质量分数返回对应的CSS类名
    getQualityClass (score) {
      if (!score) return ''
      if (score >= 85) return 'quality-good'
      if (score >= 70) return 'quality-medium'
      return 'quality-poor'
    },

    // 根据设备状态获取视频海报
    getVideoPoster (status) {
      const posterMap = {
        online: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMWEyMDJjIDAlLCAjMmQzNzQ4IDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjMTBiOTgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPuWcqOe6v+ebkeaOpzwvdGV4dD4KPC9zdmc+',
        offline: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMWEyMDJjIDAlLCAjMmQzNzQ4IDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjZWY0NDQ0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPuiuvuWkh+emu+e6vzwvdGV4dD4KPC9zdmc+',
        maintenance: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDQwMCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjQwIiBmaWxsPSJsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMWEyMDJjIDAlLCAjMmQzNzQ4IDEwMCUpIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmaWxsPSIjZjU5ZTBiIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZvbnQtd2VpZ2h0PSI2MDAiPue7tOaKpOS4rTwvdGV4dD4KPC9zdmc+'
      }
      return posterMap[status] || posterMap.offline
    },

    // 获取监控画面地址的函数
    async fetchMonitorUrls () {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          monitoringId: this.queryForm.monitoringId || undefined
        }
        
        // 移除空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key]
          }
        })
        
        const response = await monitoringAPI.getMonitoringList(params)
        
        if (response.data.success) {
          this.monitorUrls = response.data.data.list
          this.totalVideos = response.data.data.total
          
          // 检查是否为本地视频模式
          if (this.monitorUrls.length > 0 && this.monitorUrls[0].monList && this.monitorUrls[0].monList.startsWith('file://')) {
            this.isLocalMode = true
            this.videoFolder = this.monitorUrls[0].monList.substring(7, this.monitorUrls[0].monList.lastIndexOf('/'))
          }
          this.initializeRecordedVideos()
          // 只有在非本地模式下才需要缓存视频
          if (!this.isLocalMode) {
            this.monitorUrls.forEach((monitor, index) => {
              if (monitor.monList) {
                this.cacheVideo(monitor.monList)
              }
            })
          }
          // 重置分页到第一页并更新显示
          this.currentPage = 1
          this.updateDisplayedVideos()
          this.$message.success('监控数据加载成功')
        } else {
          this.$message.error(response.data.message || '获取监控数据失败')
        }
      } catch (error) {
        console.error('获取监控数据失败:', error)
        this.$message.error('获取监控数据失败')
      } finally {
        this.loading = false
      }
    },

    // 选择本地视频文件夹
    async selectLocalVideoFolder () {
      this.loading = true
      try {
        // 调用后端API获取本地视频
        const response = await monitoringAPI.getLocalVideos()
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          this.monitorUrls = response.data.data
          this.totalVideos = response.data.data.length
          this.isLocalMode = true
          if (this.monitorUrls[0].monList) {
            this.videoFolder = this.monitorUrls[0].monList.substring(7, this.monitorUrls[0].monList.lastIndexOf('/'))
          }
          this.initializeRecordedVideos()
          // 重置分页到第一页并更新显示
          this.currentPage = 1
          this.updateDisplayedVideos()
          this.$message.success(`已加载 ${this.monitorUrls.length} 个本地视频文件`)
        } else {
          this.$message.warning('未选择视频文件夹或文件夹中没有视频文件')
        }
      } catch (error) {
        console.error('获取本地视频失败:', error)
        this.$message.error('获取本地视频失败')
      } finally {
        this.loading = false
      }
    },
    initializeRecordedVideos () {
      this.recordedVideos = this.monitorUrls.map(() => [])
    },
    startRecording (index) {
      try {
        const videoElement = this.videoRefs[`videoRef${index}`]
        if (!videoElement) {
          this.$message.error('视频元素未找到')
          return
        }

        // Check if the video element is ready to capture stream
        if (videoElement.readyState < 2) {
          this.$message.error('视频元素尚未准备好捕获流')
          return
        }

        // Use captureStream or mozCaptureStream based on browser support
        let stream
        if (videoElement.captureStream) {
          stream = videoElement.captureStream()
        } else if (videoElement.mozCaptureStream) {
          stream = videoElement.mozCaptureStream()
        } else {
          this.$message.error('captureStream 不被支持')
          return
        }

        this.mediaRecorder = new MediaRecorder(stream)
        this.mediaRecorder.ondataavailable = event => {
          if (event.data.size > 0) {
            this.chunks.push(event.data)
          }
        }
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'video/mp4' })
          const url = URL.createObjectURL(blob)
          this.recordedVideos[index].push(url)
          this.chunks = []
          this.recordingIndex = null
        }
        this.mediaRecorder.start()
        this.isRecording = true
        this.recordingIndex = index
      } catch (error) {
        this.$message.error('开始录像失败: ' + error.message)
      }
    },
    stopRecording () {
      try {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop()
          this.isRecording = false
        }
      } catch (error) {
        this.$message.error('停止录像失败: ' + error.message)
      }
    },
    downloadVideo (url) {
      try {
        const link = document.createElement('a')
        link.href = url
        link.download = 'video.mp4' // 设置下载的文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (error) {
        this.$message.error('下载视频失败: ' + error.message)
      }
    },
    cacheVideo (url) {
      try {
        // 只缓存网络URL，不缓存本地文件URL
        if ('caches' in window && !url.startsWith('file://')) {
          caches.open('video-cache').then(cache => {
            cache.add(url).then(() => {
              console.log('视频缓存成功:', url)
            }).catch(error => {
              console.warn('缓存视频失败:', error.message)
            })
          })
        }
      } catch (error) {
        console.warn('缓存视频失败:', error.message)
      }
    },

    // 下载录制的视频
    downloadRecordedVideo (url, monitorIndex, videoIndex) {
      try {
        const link = document.createElement('a')
        link.href = url
        const fileName = `录制视频_${this.monitorUrls[monitorIndex].monName}_${new Date().toISOString().replace(/[:.]/g, '-')}.mp4`
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        this.$message.success(`正在下载: ${fileName}`)
      } catch (error) {
        this.$message.error('下载录制视频失败: ' + error.message)
      }
    },

    // 刷新视频列表
    refreshVideoList () {
      if (this.isLocalMode) {
        this.selectLocalVideoFolder()
      } else {
        this.fetchMonitorUrls()
      }
    },

    // 更新当前页显示的视频
    updateDisplayedVideos () {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      this.displayedVideos = this.monitorUrls.slice(start, end)
    },

    // 处理页面变化
    handleCurrentChange (val) {
      this.currentPage = val
    }
  }
}
