import { userAPI, equipmentAPI, cleaningTaskAPI, maintenanceAPI, monitoringAPI, statisticsAPI, stateAPI, alarmAPI, authAPI } from '../api/apiService'

export default {
  data () {
    return {
      activeIndex2: '/MainPage/EquipmentPage', // 更新默认激活的菜单项
      circleUrl: '',
      hasChildComponent: false,
      showEditForm: false,
      showUserDialog: false, // 添加用户信息对话框控制变量
      verificationCodeSent: false,
      userInfo: {
        username: '',
        email: '',
        role: '',
        avatar: ''
      },
      editForm: {
        username: '',
        password: '',
        avatar: '',
        verificationCode: '',
        phone: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      passwordRules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ],
      verificationCodeRules: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码长度为6位', trigger: 'blur' }
      ],
      // 摄像头清洁设备管理数据
      equipmentData: [],
      // 清洁任务管理数据
      cleaningTaskData: [],
      // 维护保养数据
      maintenanceData: [],
      // 监控数据
      monitoringData: [],
      // 数据统计
      statisticsData: {},
      // 设备状态数据
      stateData: [],
      // 报警数据
      alarmData: [],
      countdown: 0,
      verificationCodeValid: false
    }
  },
  methods: {
    async fetchUserInfo () {
      try {
        // 首先尝试从localStorage获取用户信息
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const userInfo = JSON.parse(storedUser)
          this.userInfo = userInfo
          this.circleUrl = userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
          this.editForm.username = userInfo.username
          this.editForm.avatar = userInfo.avatar
          this.editForm.phone = userInfo.phone
          return
        }
        
        // 如果localStorage中没有，则从API获取
        const response = await userAPI.getUserProfile()
        const userInfo = response.data
        this.userInfo = userInfo
        this.circleUrl = userInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
        this.editForm.username = userInfo.username
        this.editForm.avatar = userInfo.avatar
        this.editForm.phone = userInfo.phone
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果API调用失败，使用默认头像
        this.circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      }
    },
    async fetchDashboardData () {
      try {
        // 获取设备数据
        const equipmentResponse = await equipmentAPI.getEquipmentList()
        this.equipmentData = equipmentResponse.data.data || []
        
        // 获取清洁任务数据
        const cleaningResponse = await cleaningTaskAPI.getCleaningTaskList()
        this.cleaningTaskData = cleaningResponse.data.data || []
        
        // 获取维护数据
        const maintenanceResponse = await maintenanceAPI.getMaintenanceList()
        this.maintenanceData = maintenanceResponse.data.data || []
        
        // 获取监控数据
        const monitoringResponse = await monitoringAPI.getMonitoringData()
        this.monitoringData = monitoringResponse.data.data || []
        
        // 获取统计数据
        const statisticsResponse = await statisticsAPI.getStatistics()
        this.statisticsData = statisticsResponse.data || {}
        
        // 获取设备状态数据
        const stateResponse = await stateAPI.getDeviceStateList()
        this.stateData = stateResponse.data.data || []
        
        // 获取报警数据
        const alarmResponse = await alarmAPI.getAlarmList()
        this.alarmData = alarmResponse.data.data || []
      } catch (error) {
        console.error('获取仪表板数据失败:', error)
      }
    },
    handleSelect (key, keyPath) {
      console.log(key, keyPath)
      if (this.$route.path !== key) {
        this.$router.push(key).catch(err => {
          // 忽略 NavigationDuplicated 错误
          if (err.name !== 'NavigationDuplicated') throw err
        })
      }
      this.activeIndex2 = key // 更新激活的菜单项
    },
    handleLogout () {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
    handleCloseUserDialog () {
      this.showUserDialog = false
    },
    handleComponentRendered () {
      this.hasChildComponent = true
    },
    showEditFormDialog () {
      this.showEditForm = true
    },
    resetForm () {
      this.$refs.editForm.resetFields()
      this.verificationCodeSent = false
      this.verificationCodeValid = false
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (!this.verificationCodeValid) {
            this.$message.error('请先验证短信验证码')
            return false
          }
          try {
            await userAPI.updateUserProfile({
              username: this.editForm.username,
              phone: this.editForm.phone,
              avatar: this.editForm.avatar,
              password: this.editForm.password || undefined
            })
            this.$message.success('个人信息更新成功')
            this.showEditForm = false
            this.fetchUserInfo() // 重新获取用户信息
          } catch (error) {
            console.error('更新个人信息失败:', error)
            this.$message.error('更新个人信息失败')
          }
        } else {
          console.log('表单验证失败')
          return false
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.editForm.avatar = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    async sendVerificationCode () {
      try {
        await authAPI.sendVerificationCode({
          phone: this.editForm.phone
        })
        this.$message.success('验证码已发送')
        this.verificationCodeSent = true
        // 60秒后重置
        setTimeout(() => {
          this.verificationCodeSent = false
        }, 60000)
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.$message.error('发送验证码失败')
      }
    },
    async verifyVerificationCode () {
      try {
        await authAPI.verifyCode({
          phone: this.editForm.phone,
          code: this.editForm.verificationCode
        })
        this.$message.success('验证码验证成功')
        this.verificationCodeValid = true
      } catch (error) {
        console.error('验证码验证失败:', error)
        this.$message.error('验证码验证失败')
        this.verificationCodeValid = false
      }
    }
  },
  watch: {
    $route (to, from) {
      if (to.path === '/MainPage') {
        this.hasChildComponent = false
      } else {
        this.hasChildComponent = true
      }
    }
  },
  mounted () {
    this.hasChildComponent = this.$route.path !== '/MainPage'
    this.fetchUserInfo()
    this.fetchDashboardData()
  }
}
