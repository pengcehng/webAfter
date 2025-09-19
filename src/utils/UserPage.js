import { userAPI } from '../api/apiService'

export default {
  data () {
    return {
      // 用户列表数据
      tableData: [],
      // 查询表单
      queryForm: {
        username: '',
        role: '',
        status: ''
      },
      dialogVisible: false,
      currentUser: {
        userId: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        position: '',
        status: '',
        avatar: ''
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
      return this.isEditing ? '编辑用户' : '新增用户'
    }
  },
  methods: {
    // 获取用户列表数据
    async fetchData () {
      try {
        this.loading = true
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize,
          username: this.queryForm.username || undefined,
          role: this.queryForm.role || undefined,
          status: this.queryForm.status || undefined
        }
        
        // 移除空值参数
        Object.keys(params).forEach(key => {
          if (params[key] === undefined || params[key] === '') {
            delete params[key]
          }
        })
        
        const response = await userAPI.getUserList(params)
        
        if (response.data.success) {
          this.tableData = response.data.data.list
          this.monitorUrls.total = response.data.data.total
          this.$message.success('数据加载成功')
        } else {
          this.$message.error(response.data.message || '获取用户列表失败')
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        this.$message.error('获取用户列表失败')
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
        username: '',
        role: '',
        status: ''
      }
      this.currentPage = 1
      this.fetchData()
    },
    // 处理新增操作
    handleAdd () {
      this.dialogVisible = true
      this.isEditing = false
      this.currentUser = {
        userId: '',
        username: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        position: '',
        status: '',
        avatar: ''
      }
    },
    // 处理编辑操作
    handleEdit (row) {
      this.dialogVisible = true
      this.isEditing = true
      this.currentUser = { ...row }
    },
    // 处理删除操作
    async handleDelete (row) {
      try {
        await this.$confirm('确定要删除该用户吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await userAPI.deleteUser(row.userId)
        
        if (response.data.success) {
          this.$message.success('删除成功')
          this.fetchData() // 重新加载数据
        } else {
          this.$message.error(response.data.message || '删除失败')
        }
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error)
          this.$message.error('删除用户失败')
        }
      }
    },
    // 处理保存操作
    async handleSave () {
      try {
        // 验证必填字段
        if (!this.currentUser.username || !this.currentUser.email || !this.currentUser.phone) {
          this.$message.error('请填写必填字段')
          return
        }
        
        if (this.isEditing) {
          // 编辑逻辑
          const response = await userAPI.updateUser(this.currentUser.userId, this.currentUser)
          
          if (response.data.success) {
            this.$message.success('更新成功')
            this.dialogVisible = false
            this.fetchData() // 重新加载数据
          } else {
            this.$message.error(response.data.message || '更新失败')
          }
        } else {
          // 新增逻辑
          const response = await userAPI.createUser(this.currentUser)
          
          if (response.data.success) {
            this.$message.success('新增成功')
            this.dialogVisible = false
            this.fetchData() // 重新加载数据
          } else {
            this.$message.error(response.data.message || '新增失败')
          }
        }
      } catch (error) {
        console.error('保存用户失败:', error)
        this.$message.error('保存用户失败')
      }
    }
  },
  created () {
    this.fetchData() // 在组件创建时调用
  }
}
