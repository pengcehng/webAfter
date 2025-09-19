import { stateAPI } from '../api/apiService'

export default {
  data () {
    return {
      monitorUrls: [],
      activeIndex2: '4', // 设置默认激活的菜单项
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      squareUrl: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
      sizeList: ['large', 'medium', 'small'],
      tableData: [], // 设备状态数据
      queryForm: {
        stateName: '',
        status: '',
        stateLocation: '',
        dateRange: []
      },
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      total: 0, // 总条数
      statusColors: {
        运行: 'green',
        暂停: 'orange',
        异常: 'red'
      }
    }
  },
  computed: {
    filteredTableData () {
      let filteredData = this.tableData

      // 日期范围过滤
      if (this.queryForm.dateRange && this.queryForm.dateRange.length === 2) {
        const [startDate, endDate] = this.queryForm.dateRange
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.updateTime) // 假设 updateTime 是日期字段
          return itemDate >= startDate && itemDate <= endDate
        })
      }

      // 状态名称过滤
      if (this.queryForm.stateName) {
        filteredData = filteredData.filter(item => {
          return item.stateName.includes(this.queryForm.stateName)
        })
      }

      // 状态过滤
      if (this.queryForm.status) {
        filteredData = filteredData.filter(item => {
          return item.status === this.queryForm.status
        })
      }

      // 地点过滤
      if (this.queryForm.stateLocation) {
        filteredData = filteredData.filter(item => {
          return item.stateLocation.includes(this.queryForm.stateLocation)
        })
      }

      return filteredData
    }
  },
  methods: {
    async fetchData () {
      try {
        const response = await stateAPI.getDeviceStateList({
          page: this.currentPage,
          pageSize: this.pageSize,
          stateName: this.queryForm.stateName,
          status: this.queryForm.status,
          stateLocation: this.queryForm.stateLocation,
          startDate: this.queryForm.dateRange && this.queryForm.dateRange[0] ? this.queryForm.dateRange[0].toISOString() : null,
          endDate: this.queryForm.dateRange && this.queryForm.dateRange[1] ? this.queryForm.dateRange[1].toISOString() : null
        })
        this.tableData = response.data.data
        this.total = response.data.total
        this.$message.success('数据加载成功')
      } catch (error) {
        console.error('获取设备状态失败:', error)
        this.$message.error('获取设备状态失败')
      }
    },
    handlePageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    handlePageSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1 // 重置页码为第一页
      this.fetchData()
    },
    handleSearch () {
      this.currentPage = 1 // 查询时重置页码
      this.fetchData()
    },
    handleReset () {
      this.queryForm = {
        stateName: '',
        status: '',
        stateLocation: '',
        dateRange: []
      }
      this.handleSearch() // 重置后重新查询
    },
    async handleStart (index) {
      try {
        const device = this.tableData[index]
        await stateAPI.updateDeviceState(device.id, {
          ...device,
          status: '运行'
        })
        this.$set(this.tableData[index], 'status', '运行')
        this.$message.success('设备已启动')
      } catch (error) {
        console.error('启动设备失败:', error)
        this.$message.error('启动设备失败')
      }
    },
    async handlePause (index) {
      try {
        const device = this.tableData[index]
        await stateAPI.updateDeviceState(device.id, {
          ...device,
          status: '暂停'
        })
        this.$set(this.tableData[index], 'status', '暂停')
        this.$message.success('设备已暂停')
      } catch (error) {
        console.error('暂停设备失败:', error)
        this.$message.error('暂停设备失败')
      }
    },
    getStatusColor (status) {
      const colorMap = {
        运行: 'success',
        暂停: 'warning',
        异常: 'danger'
      }
      return colorMap[status] || 'info'
    }
  },
  created () {
    this.fetchData() // 组件创建时加载数据
  }
}
