import { equipmentAPI } from '../api/apiService'

export default {
  data () {
    return {
      // 设备列表数据
      tableData: [],
      // 查询表单
      queryForm: {
        deviceId: '',
        deviceName: '',
        installationLocation: '',
        status: '',
        dateRange: null
      },
      dialogVisible: false,
      currentDevice: {
        deviceId: '',
        deviceName: '',
        installationLocation: '',
        deviceStatus: '',
        cleaningMode: '',
        deviceType: '',
        lastCleaningTime: '',
        maintenanceStatus: ''
      },
      editIndex: -1, // 用于记录当前编辑的行索引
      isEditing: false, // 标识当前是新增还是编辑模式
      currentPage: 1, // 当前页码
      page: 1,
      pageSize: 5, // 每页显示的条数
      pageSizeOptions: [5, 10, 20, 50], // 可选的每页显示条数
      monitorUrls: {
        total: 0
      },
      loading: false // 加载状态
    }
  },
  computed: {
    dialogTitle () {
      return this.isEditing ? '编辑设备' : '新增设备'
    }
  },
  methods: {
    // 获取设备列表数据
    async fetchData () {
      try {
        this.loading = true
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          deviceId: this.queryForm.deviceId || undefined,
          deviceName: this.queryForm.deviceName || undefined,
          installationLocation: this.queryForm.installationLocation || undefined,
          status: this.queryForm.status || undefined
        }
        
        // 移除空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key]
          }
        })
        
        const response = await equipmentAPI.getEquipmentList(params)
        
        if (response.data.success) {
          this.tableData = response.data.data.list
          this.monitorUrls.total = response.data.data.total
          this.$message.success('数据加载成功')
        } else {
          this.$message.error(response.data.message || '获取设备列表失败')
        }
      } catch (error) {
        console.error('获取设备列表失败:', error)
        this.$message.error('获取设备列表失败')
      } finally {
        this.loading = false
      }
    },
    // 处理页码变化
    handlePageChange (page) {
      this.currentPage = page
      this.fetchData()
    },
    // 处理每页显示条数变化
    handlePageSizeChange (size) {
      this.pageSize = size
      this.currentPage = 1 // 重置页码为第一页
      this.fetchData()
    },
    // 处理查询操作
    handleSearch () {
      this.currentPage = 1
      this.fetchData()
    },
    // 处理重置操作
    handleReset () {
      this.queryForm = {
        deviceId: '',
        deviceName: '',
        installationLocation: '',
        status: '',
        dateRange: null
      }
      this.currentPage = 1
      this.fetchData()
    },
    // 处理新增操作
    handleAdd () {
      this.dialogVisible = true
      this.isEditing = false // 设置为 false 表示新增操作
      this.currentDevice = { // 清空当前设备信息
        deviceId: '',
        deviceName: '',
        installationLocation: '',
        deviceStatus: '',
        cleaningMode: '',
        deviceType: '',
        lastCleaningTime: '',
        maintenanceStatus: ''
      }
    },
    // 处理编辑操作
    handleEdit (row) {
      this.dialogVisible = true
      this.isEditing = true // 设置为 true 表示编辑操作
      this.currentDevice = { ...row }
    },
    // 处理删除操作
    async handleDelete (row) {
      try {
        await this.$confirm('确定要删除该设备吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await equipmentAPI.deleteEquipment(row.deviceId)
        
        if (response.data.success) {
          this.$message.success('删除成功')
          this.fetchData() // 重新加载数据
        } else {
          this.$message.error(response.data.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除设备失败:', error)
          this.$message.error('删除设备失败')
        }
      }
    },
    // 处理保存操作
    async handleSave () {
      try {
        // 验证必填字段
        if (!this.currentDevice.deviceName || !this.currentDevice.installationLocation || !this.currentDevice.deviceType) {
          this.$message.error('请填写必填字段')
          return
        }
        
        if (this.isEditing) {
          // 编辑逻辑
          const response = await equipmentAPI.updateEquipment(this.currentDevice.deviceId, this.currentDevice)
          
          if (response.data.success) {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.fetchData() // 重新加载数据
          } else {
            this.$message.error(response.data.message || '更新失败')
          }
        } else {
          // 新增逻辑
          const response = await equipmentAPI.createEquipment(this.currentDevice)
          
          if (response.data.success) {
            this.$message.success('新增成功')
            this.dialogVisible = false
            this.fetchData() // 重新加载数据
          } else {
            this.$message.error(response.data.message || '新增失败')
          }
        }
      } catch (error) {
        console.error('保存设备失败:', error)
        this.$message.error('保存设备失败')
      }
    },
    getDeviceStatusColor (status) {
      const colorMap = {
        正常: 'success',
        异常: 'danger',
        关闭: 'info'
      }
      return colorMap[status] || 'info'
    },
    getMaintenanceStatusColor (status) {
      const colorMap = {
        正常: 'success',
        需要维护: 'warning',
        维护中: 'info'
      }
      return colorMap[status] || 'info'
    }
  },
  created () {
    this.fetchData() // 在组件创建时调用
  }
}
